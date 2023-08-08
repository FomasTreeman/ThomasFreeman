
export type Repo = {
    md: string,
    name: string,
    url: string
}

export type RepoError = {
    error: string
}


export type Data = { repos: Repo[] | RepoError | Promise<Repo[] | RepoError>, pinned: string[], productions: Record<string, string> }
