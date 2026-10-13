# /play: from one game to a platform

A plan for turning `/play` from a single Svelte file into a small game library with a live layer underneath. The live layer is the point: it is the thing a static portfolio cannot show, and it is an honest excuse to use MQTT, async multiplayer and verifiable state.

Pizza Rush stays as the first game. Nothing here needs it rewritten in one go.

## Where it is today

- One 41 KB component at `src/routes/play/+page.svelte`: orders spawn on `setInterval`, ingredients are clicked into a pizza, `servePizza()` matches against active orders, lives and combos, levels from elapsed time, Web Audio beeps.
- Randomness is `Math.random()` throughout. Difficulty scales on wall-clock elapsed time.
- Leaderboard: a JSON file in Vercel Blob, read back through three stacked cache-busting strategies because Blob is not a database.
- No identity. A name is typed at the end of a run.

## The shape of the end state

```
/play                      library: every game, who is online, live scores
/play/pizza-rush           a game, mounted by the shell
/play/<game>/daily         today's seeded challenge
/play/<game>/r/<room>      a room: challenge, ghost, or turn-based match
/play/leaderboard          all games, filterable

shared
  $lib/play/engine         Game interface, fixed-rate loop, seeded RNG, replay
  $lib/play/live           MQTT client, presence, topics, room helpers
  $lib/play/identity       anonymous id, optional passkey
server
  Turso                    players, scores, runs (seed + inputs), rooms, moves
  MQTT broker (WSS)        presence and events, no game state of record
```

Two rules that keep it coherent:

1. **Turso is the record. MQTT is the nervous system.** Anything that must survive a refresh goes in the database. MQTT carries "this just happened"; a client that missed a message reads the current state from Turso on connect.
2. **A run is a seed and a list of inputs.** Not a stream of state. Everything below depends on this.

## Step 1: deterministic runs

Do this first. It is the foundation for daily challenges, challenges between friends, ghosts, replays and score verification, and it makes every later message smaller.

### The idea

One number stands in for every random choice a run makes. If all randomness flows from it, two runs with the same seed are identical. The only unknown is what the player did.

### The change

Replace `Math.random()` with a seeded generator. mulberry32 is five lines and good enough:

```ts
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Then:

- Every order template pick, spawn delay and timer length comes from `random()`. No `Math.random()` anywhere in game logic.
- **Tick count, not wall clock.** The loop runs at a fixed rate (say 10 Hz, which is what the 100 ms interval already is) and everything that currently reads `elapsedTime` or `Date.now()` reads the tick number instead. Rendering can interpolate; logic cannot look at the clock.
- **Same call sequence regardless of input.** The order schedule should not depend on how fast the player serves, so generate it up front from the seed (or generate on a fixed tick cadence that the player cannot influence). If a player action ever changes how many times `random()` is called, replays drift.
- **Pure step function.** Aim for `step(state, input, random) -> state` with no timers, no DOM and no audio in it. `updateGame()` and `generateOrder()` are most of the way there. Sound, DOM and the interval loop become callers of `step`.
- **Inputs are recorded** as `[tick, action]` pairs: `[[12, "add:cheese"], [19, "serve"], [23, "clear"]]`. A whole run is a few hundred bytes.

Put the engine in `$lib/play/engine/` so both the browser and the server can import it. The server will need it for step 5.

### What it unlocks

| Feature | What it is, once runs are deterministic |
|---|---|
| Daily challenge | Seed = today's date. Everyone gets the same orders. The board closes at midnight. |
| Beat my run | A seed and a score. The recipient's client regenerates the identical game. |
| Replay | Seed + inputs, played back through `step`. |
| Ghost | A replay played alongside a live game, drawn as an overlay. |
| Verified scores | The server replays the inputs and checks the score. No inputs produce a fake score. |
| Reproducible bugs | "Seed 8812, tick 240" is a test case. |

## Step 2: Turso as the record

The CMS already uses Turso, so the client and migrations exist.

```sql
players   id, display_name, created_at, passkey_credential_id (nullable)
games     slug, name, version            -- version matters for replays (see note)
runs      id, game, player_id, seed, score, ticks, inputs (json), created_at, verified
daily     game, date, seed
rooms     id, game, kind (challenge|ghost|match), created_by, state (json), created_at
moves     room_id, seq, player_id, payload (json), created_at
```

- `runs.inputs` is the replay. Store it; it is small.
- `games.version`: a replay is only valid against the game code that produced it. Bump the version when `step` changes behaviour, and keep old versions importable (or accept that old replays break, and say so on the board).
- Delete the Blob leaderboard and its cache-busting code. `/api/leaderboard` becomes a query.

## Step 3: the live layer (MQTT over WebSockets)

Run a broker with WebSocket support, Mosquitto or EMQX, on the gameserver VM, published through the Cloudflare Tunnel as `wss://play-mq.<domain>`. Every `/play` page connects as a client with its player id.

Topics:

```
play/presence/<playerId>          retained; payload { name, game, since }; last-will clears it
play/<game>/scores                new verified scores, for live toasts on every open page
play/<game>/daily                 the day's seed, retained, rotated by a cron
play/<game>/rooms/<roomId>/events moves, joins, "your turn", ghost frames
play/lobby                        "looking for a game" announcements
```

Patterns, all borrowed from Home Assistant's discovery model:

- **Presence** is a retained message plus a last-will. The library page subscribes to `play/presence/+` and has a live "who is here" list with no polling and no server code.
- **Retained daily seed** means a client that opens at 23:59 still gets today's and sees the flip at midnight.
- **The broker is not the record.** A client that connects mid-game reads the room from Turso, then subscribes for what happens next.

Auth: the broker accepts a short-lived token minted by a SvelteKit endpoint from the player's session, with ACLs so a client can publish only to its own presence topic and to rooms it is in. EMQX has HTTP auth hooks for exactly this; Mosquitto needs a plugin.

## Step 4: async multiplayer

Rooms are topics plus a row. Start async; it is more interesting than real-time and far more forgiving on a hobby budget.

- **Challenge:** A creates a room with a seed. Publishes a link. B plays the same seed. Both runs are stored; the room shows both scores and both replays.
- **Ghost:** the same, but B's client also subscribes to A's stored replay and draws A's pizza being built next to B's own, tick for tick. Works for any game with a visual state.
- **Turn-based game:** each move is one `moves` row and one MQTT message. The opponent can reply tomorrow. The room state is derived by replaying the moves, so it is deterministic too.

## Step 5: verified scores

When a run is submitted, the client sends `{ game, version, seed, inputs, claimedScore }`. The server imports the same engine, replays the inputs, and stores the run as verified only if the scores match. The leaderboard shows verified runs; a client cannot fake one, because there are no inputs that produce a fake score.

This is also where a seeded daily board becomes trustworthy.

## Step 6: one real-time game

Only after rooms exist. A small two-player game, co-op kitchen or a Pong-like, with client-side prediction and a tiny WebSocket authority reconciling positions. Keep it deliberately minimal; the goal is to have built one, and to be able to explain tick rates, reconciliation and cheating in an interview.

## The games

- **Pizza Rush**, refactored onto the `Game` interface (start, pause, step, render, score events, seed).
- **Boids**, which already exists on the portfolio. Add a herding objective and it is a second tenant for very little.
- **A turn-based game**, built for the async layer from the start, where the point is that the other player might answer tomorrow.

The shell should be able to mount a game knowing only the interface, so a third game is a folder, not a feature.

## Identity

Anonymous first: a random player id in `localStorage`, a display name, nothing else. Optional **passkeys** (WebAuthn) to claim an identity across devices without a password. Scores from anonymous players stay; claiming later links them.

## Deliberately not doing

- **A game engine.** Pizza Rush is DOM and that is fine. Canvas or Pixi only when the real-time game needs it.
- **Server-authoritative Pizza Rush.** Verification by replay gives the same guarantee with none of the latency.
- **Accounts with passwords.**

## Order of work

1. Seeded RNG and tick-based loop in Pizza Rush. Record inputs. Prove a replay reproduces a run. *(One evening.)*
2. Turso tables, move the leaderboard, delete the Blob code. *(One evening.)*
3. Broker on the gameserver VM behind the tunnel, presence on the library page. *(A weekend, mostly the broker auth.)*
4. Daily challenge: cron rotates the seed, retained topic, board per day.
5. Challenge rooms, then ghosts.
6. Verified submission.
7. Second game onto the interface.
8. Turn-based game.
9. Real-time game, last.

After step 3 the library page already demonstrates something no static portfolio does. Everything after that is additive.
