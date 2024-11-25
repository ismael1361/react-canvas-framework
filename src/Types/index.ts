import { CanvasCurrentElement, CANVASElement } from "./Elements";

export type TypeCanvasContext = "2d";

export interface CanvasElementPropertiesTransform {
	origin: {
		x: number;
		y: number;
	};
	translate: {
		x: number;
		y: number;
		z: number | undefined;
	};
	rotate: number;
	scale:
		| {
				x: number;
				y: number;
		  }
		| number;
	skew: {
		x: number;
		y: number;
	};
	matrix: [number, number, number, number, number, number];
}

export interface CanvasElementProperties {
	id: string;
	x: number;
	y: number;
	fill: string;
	stroke: string;
	strokeWidth: number;
	opacity: number;
	boxShadow: {
		color: string;
		blur: number;
		offsetX: number;
		offsetY: number;
	};
	filter: string;
	lineCap: "butt" | "round" | "square";
	lineDashOffset: number;
	lineJoin: "bevel" | "round" | "miter";
	transform: CanvasElementPropertiesTransform;
}

export interface GlobalSettingsStyled extends Omit<CanvasElementProperties, "boxShadow" | "transform"> {
	boxShadow: Partial<CanvasElementProperties["boxShadow"]>;
	transform: Partial<
		Pick<CanvasElementProperties["transform"], "matrix" | "rotate"> & {
			origin: Partial<CanvasElementPropertiesTransform["origin"]>;
			translate: Partial<CanvasElementPropertiesTransform["translate"]>;
			scale: Partial<CanvasElementPropertiesTransform["scale"]> | number;
			skew: Partial<CanvasElementPropertiesTransform["skew"]>;
		}
	>;
}

export interface CanvasElementEventListener {
	onClick: (e: MouseEvent) => void;
}

export interface CanvasState {
	canvas: HTMLCanvasElement | null;
	width: number;
	height: number;
	isGroup: boolean;
	typeContext: TypeCanvasContext;
}

export type CanvasElement<P extends CANVASElement = never> = (state: Omit<CanvasState, "elements">, props: P) => void;

export interface PropsElementsContext {
	canvas: HTMLCanvasElement | null;
	elements: Array<CANVASElement>;
	pushElement: (id: string, element: CANVASElement, executable: CanvasElement) => number;
	removeElement: (id: string) => void;
	updateElement: (id: string, element: CANVASElement, executable: CanvasElement) => void;
	getElement: (id: string) => CANVASElement | null;
}

export type Path2D = Array<
	| {
			type: "m" | "M" | "l" | "L" | "t" | "T";
			args: {
				x: number;
				y: number;
			};
	  }
	| {
			type: "h" | "H";
			args: {
				x: number;
			};
	  }
	| {
			type: "v" | "V";
			args: {
				y: number;
			};
	  }
	| {
			type: "c" | "C";
			args: {
				x1: number;
				y1: number;
				x2: number;
				y2: number;
				x: number;
				y: number;
			};
	  }
	| {
			type: "s" | "S";
			args: {
				x2: number;
				y2: number;
				x: number;
				y: number;
			};
	  }
	| {
			type: "q" | "Q";
			args: {
				x1: number;
				y1: number;
				x: number;
				y: number;
			};
	  }
	| {
			type: "a" | "A";
			args: {
				x: number;
				y: number;
				angle: number;
				largeArcFlag: number;
				sweepFlag: number;
				rx: number;
				ry: number;
			};
	  }
	| {
			type: "z" | "Z";
			args?: {};
	  }
>;

export interface HandlerProps<P extends Object> {
	setAttribute: <k extends keyof Omit<CanvasCurrentElement<P>, "toString" | "update" | "__original__">>(key: k, value: CanvasCurrentElement<P>[k], isOriginal?: boolean) => void;
	getAttribute: <k extends keyof Omit<CanvasCurrentElement<P>, "toString" | "update" | "__original__">>(key: k) => CanvasCurrentElement<P>[k];
	toString: () => string;
	update: (update: (props: CanvasCurrentElement<P>) => P & Partial<GlobalSettingsStyled>) => void;
}
