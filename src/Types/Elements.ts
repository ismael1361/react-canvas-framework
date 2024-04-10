import { CanvasElementProperties, GlobalSettingsStyled, Path2D } from "./";

export type CanvasCurrentElement<P = {}> = Omit<P, keyof CanvasElementProperties> & CanvasElementProperties;

export interface CANVASGroupElement extends Partial<GlobalSettingsStyled> {
	compositeOperation?:
		| "source-over"
		| "source-in"
		| "source-out"
		| "source-atop"
		| "destination-over"
		| "destination-in"
		| "destination-out"
		| "destination-atop"
		| "lighter"
		| "copy"
		| "xor"
		| "multiply"
		| "screen"
		| "overlay"
		| "darken"
		| "lighten"
		| "color-dodge"
		| "color-burn"
		| "hard-light"
		| "soft-light"
		| "difference"
		| "exclusion"
		| "hue"
		| "saturation"
		| "color"
		| "luminosity";
	x: number;
	y: number;
}

export interface CANVASLineElement extends Partial<GlobalSettingsStyled> {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export interface CANVASCircleElement extends Partial<GlobalSettingsStyled> {
	x: number;
	y: number;
	radius: number;
}

export interface CANVASRectElement extends Partial<GlobalSettingsStyled> {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface CANVASArcElement extends Partial<GlobalSettingsStyled> {
	x: number;
	y: number;
	radius: number;
	startAngle: number;
	endAngle: number;
	counterclockwise: boolean;
}

export interface CANVASEllipseElement extends Partial<GlobalSettingsStyled> {
	x: number;
	y: number;
	radiusX: number;
	radiusY: number;
	rotation: number;
	startAngle: number;
	endAngle: number;
	counterclockwise: boolean;
}

export interface CANVASPathElement extends Partial<GlobalSettingsStyled> {
	d: string | Path2D;
}

export interface CANVASImageElement extends Partial<GlobalSettingsStyled> {
	x: number;
	y: number;
	width?: number;
	height?: number;
	src: string;
	smoothingEnabled?: boolean;
	smoothingQuality?: "low" | "medium" | "high";
}

export interface CANVASTextElement extends Partial<GlobalSettingsStyled> {
	x: number;
	y: number;
	font: string;
	size: number;
	textAlign: "left" | "right" | "center" | "start" | "end";
	textBaseline: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
	textRendering: "auto" | "optimizeSpeed" | "optimizeLegibility" | "geometricPrecision";
	wordSpacing: number;
	letterSpacing: number;
	fontStretch: "normal" | "wider" | "narrower" | "ultra-condensed" | "extra-condensed" | "condensed" | "semi-condensed" | "semi-expanded" | "expanded" | "extra-expanded" | "ultra-expanded";
	fontVariantCaps: "normal" | "small-caps" | "all-small-caps" | "petite-caps" | "all-petite-caps" | "unicase" | "titling-caps";
	direction: "ltr" | "rtl" | "inherit";
}
