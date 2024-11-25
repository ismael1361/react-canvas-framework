import React from "react";
import { applyStyledProps, usePropsHandle, useId } from "../Utils";
import { CANVASLineElement } from "../Types/Elements";

export const Line: React.FC<Partial<CANVASLineElement>> = (p) => {
	const id = useId();

	usePropsHandle<CANVASLineElement>(
		id,
		p,
		{
			x1: 0,
			y1: 0,
			x2: 15,
			y2: 15,
		},
		({ canvas }, props) => {
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
	);

	return <></>;
};
