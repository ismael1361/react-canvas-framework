import { useState } from "react";
import { GlobalSettingsStyled } from "../Types";

export * from "./canvas";
export * from "./elements";

export const generateUniqueId = (prefix = "id") => {
	const timestamp = Date.now().toString(36);
	const randomNum = Math.random().toString(36).substring(2, 5);
	return `${prefix}_${timestamp}_${randomNum}`;
};

export const useId = () => {
	const [id] = useState(generateUniqueId());
	return id;
};

export const applyStyledProps = (ctx: CanvasRenderingContext2D, props: Partial<GlobalSettingsStyled>, draw?: (ctx: CanvasRenderingContext2D) => void) => {
	const { x = 0, y = 0, fill, stroke, strokeWidth, opacity, boxShadow, filter, lineCap, lineDashOffset, lineJoin, transform } = props;
	if (typeof fill === "string") {
		ctx.fillStyle = fill === "none" ? "transparent" : fill;
	}
	if (typeof stroke === "string") {
		ctx.strokeStyle = stroke;
	}
	if (typeof strokeWidth === "number") {
		ctx.lineWidth = strokeWidth;
	}
	if (typeof opacity === "number" && opacity < 1) {
		ctx.globalAlpha = opacity;
	}
	if (typeof boxShadow === "object" && boxShadow !== null) {
		const { color, blur, offsetX, offsetY } = boxShadow;
		if (typeof color === "string") ctx.shadowColor = color === "none" ? "transparent" : color;
		if (typeof blur === "number") ctx.shadowBlur = blur;
		if (typeof offsetX === "number") ctx.shadowOffsetX = offsetX;
		if (typeof offsetY === "number") ctx.shadowOffsetY = offsetY;
	}
	if (typeof filter === "string") {
		ctx.filter = filter;
	}
	if (typeof lineCap === "string") {
		ctx.lineCap = lineCap;
	}
	if (typeof lineDashOffset === "number") {
		ctx.lineDashOffset = lineDashOffset;
	}
	if (typeof lineJoin === "string") {
		ctx.lineJoin = lineJoin;
	}

	if (typeof transform === "object" && transform !== null) {
		const matrix = ctx.getTransform();
		if (transform.origin) {
			matrix.translateSelf(x + (transform.origin.x ?? 0), y + (transform.origin.y ?? 0));
		}

		if (typeof transform.translate === "object" && transform.translate !== null) {
			matrix.translateSelf(transform.translate.x ?? 0, transform.translate.y ?? 0, transform.translate.z);
		}

		if (typeof transform.rotate === "number") {
			matrix.rotateSelf(transform.rotate);
		}

		if (typeof transform.scale === "number" || (typeof transform.scale === "object" && transform.scale !== null)) {
			const { x: sX, y: sY } = typeof transform.scale === "number" ? { x: transform.scale, y: transform.scale } : transform.scale;
			matrix.scaleSelf(sX ?? 1, sY ?? 1, 1);
		}

		if (Array.isArray(transform.matrix) && transform.matrix.length === 6 && transform.matrix.every((n) => typeof n === "number")) {
			matrix.multiplySelf(new DOMMatrix(transform.matrix));
		}

		if (transform.origin) {
			matrix.translateSelf(-(x + (transform.origin.x ?? 0)), -(y + (transform.origin.y ?? 0)));
		}

		ctx.setTransform(matrix);
	}

	draw?.(ctx);
};
