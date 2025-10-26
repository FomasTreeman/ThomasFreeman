declare module 'locomotive-scroll' {
	export type LocoElement = HTMLElement | Window | Document;
	export type LocoOptions = {
		el: HTMLElement;
		smooth?: boolean;
		direction?: 'vertical' | 'horizontal';
		multiplier?: number;
		lerp?: number;
		smartphone?: { smooth?: boolean; breakpoint?: number };
		tablet?: { smooth?: boolean; breakpoint?: number };
		getDirection?: boolean;
		class?: string;
	};
	export default class LocomotiveScroll {
		constructor(options: LocoOptions);
		on(event: 'scroll', cb: (args: any) => void): void;
		on(event: 'call', cb: (fn: string, way: 'enter' | 'leave', obj: any) => void): void;
		update(): void;
		start(): void;
		stop(): void;
		destroy(): void;
		scrollTo(target: number | string | HTMLElement, options?: any): void;
	}
}
