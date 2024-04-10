import React from "react";
import { applyForwardRef, applyStyledProps, useCanvas, usePropsImperativeHandle } from "../Utils";
import { CANVASLineElement } from "../Types/Elements";

export const Line = applyForwardRef<Partial<CANVASLineElement>, CANVASLineElement>((p, ref) => {
	const [props] = usePropsImperativeHandle<CANVASLineElement>(ref, p, {
		x1: 0,
		y1: 0,
		x2: 15,
		y2: 15,
	});

	useCanvas(
		({ canvas }) => {
			const ctx = canvas?.getContext("2d");
			const { x1, y1, x2, y2 } = props;

			if (ctx) {
				ctx.save();
				applyStyledProps(ctx, props, (ctx) => {
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
					ctx.closePath();
				});
				ctx.restore();
			}
		},
		[props],
	);

	return null;
});
