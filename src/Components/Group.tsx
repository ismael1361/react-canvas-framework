import React, { useCallback, useEffect, useRef } from "react";
import { CanvasElement } from "../Types";
import { ElementsContext } from "../Context";
import { useId, applyStyledProps, usePropsHandle, useElementesContext } from "../Utils";
import { CANVASElement, CANVASGroupElement } from "../Types/Elements";

type Props = Partial<
	CANVASGroupElement & {
		children?: React.ReactNode;
	}
>;

export const Group: React.FC<Props> = ({ children, ...p }) => {
	const id = useId();
	const elements = useRef<Array<CANVASElement & { executable: CanvasElement }>>([]);
	const elementesContext = useElementesContext();

	usePropsHandle<CANVASGroupElement>(
		id,
		p,
		{
			elements: [],
			fill: "transparent",
			stroke: "#000000",
			strokeWidth: 2,
			opacity: 1,
			x: 0,
			y: 0,
		},
		({ canvas, height, width }, props) => {
			const ctx = canvas?.getContext("2d");
			const { compositeOperation, x, y } = props;

			if (ctx) {
				ctx.save();
				applyStyledProps(ctx, props, () => {
					if (typeof compositeOperation === "string") {
						ctx.globalCompositeOperation = compositeOperation;
					}
					elements.current.forEach(({ executable, ...props }) => {
						executable({ canvas, width, height, isGroup: false, typeContext: "2d" }, props as never);
					});
				});
				ctx.restore();
			}
		},
	);

	const pushElement = useCallback((id: string, element: CANVASElement, executable: CanvasElement) => {
		let index = elements.current.findIndex((e) => e.id === id);
		if (index !== -1) index = elements.current.length;
		elements.current[index] = { ...element, id, executable };
		return index;
	}, []);

	const removeElement = useCallback((id: string) => {
		elements.current = elements.current.filter((e) => e.id !== id);
	}, []);

	const updateElement = useCallback((id: string, element: CANVASElement, executable: CanvasElement) => {
		let index = elements.current.findIndex((e) => e.id === id);
		if (index !== -1) index = elements.current.length;
		elements.current[index] = { ...element, id, executable };
	}, []);

	const getElement = useCallback((id: string) => {
		const index = elements.current.findIndex((e) => e.id === id);
		if (index !== -1) {
			return elements.current[index];
		}
		return null;
	}, []);

	useEffect(() => {
		elements.current = [];
	}, [children]);

	return (
		<ElementsContext.Provider
			value={{
				canvas: elementesContext.canvas,
				elements: elements.current,
				pushElement,
				removeElement,
				updateElement,
				getElement,
			}}
		>
			{children}
		</ElementsContext.Provider>
	);
};
