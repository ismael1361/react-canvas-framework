import React, { useCallback, useContext, useRef } from "react";
import { CanvasElement } from "../Types";
import { CanvasContext, GroupContext } from "../Context";
import { applyForwardRef, applyStyledProps, useCanvas, usePropsImperativeHandle } from "../Utils";
import { CANVASGroupElement } from "../Types/Elements";

type Props = Partial<
	CANVASGroupElement & {
		children?: React.ReactNode;
	}
>;

export const Group = applyForwardRef<Props, CANVASGroupElement>(({ children, ...p }, ref) => {
	const [props] = usePropsImperativeHandle<CANVASGroupElement>(ref, p, {
		fill: "transparent",
		stroke: "#000000",
		strokeWidth: 2,
		opacity: 1,
		x: 0,
		y: 0,
	});
	const canvasContext = useContext(CanvasContext);
	const elements = useRef<Map<string, { executable: CanvasElement; time: number; index: number }>>(new Map());

	const pushElement = useCallback(
		(id: string, time: number, element: CanvasElement) => {
			const index = elements.current.size;
			elements.current.set(id, { executable: element, time, index });
			return index;
		},
		[elements],
	);

	const removeElement = useCallback(
		(id: string, time: number) => {
			elements.current.delete(id);
		},
		[elements],
	);

	useCanvas(
		({ canvas, height, width }) => {
			const ctx = canvas?.getContext("2d");
			const { compositeOperation, x, y } = props;

			if (ctx) {
				ctx.save();
				applyStyledProps(ctx, props, () => {
					if (typeof compositeOperation === "string") {
						ctx.globalCompositeOperation = compositeOperation;
					}
					const elementsArray = Array.from(elements.current.entries());
					elementsArray.sort((a, b) => a[1].index - b[1].index);
					elementsArray.forEach(([_, { executable }]) => {
						executable({ canvas, width, height, isGroup: false, typeContext: canvasContext.state.typeContext });
					});
				});
				ctx.restore();
			}
		},
		[props, canvasContext.state],
	);

	return (
		<GroupContext.Provider
			value={{
				state: {
					canvas: canvasContext.state.canvas,
					width: canvasContext.state.width,
					height: canvasContext.state.height,
					elements: elements.current,
					isGroup: true,
					typeContext: canvasContext.state.typeContext,
				},
				pushElement,
				removeElement,
				updateCanvas: canvasContext.updateCanvas,
				addEventListener: canvasContext.addEventListener,
				removeEventListener: canvasContext.removeEventListener,
			}}
		>
			{children}
		</GroupContext.Provider>
	);
});
