import React, { useRef, useState, useEffect, useContext, useCallback, forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { TypeCanvasContext, CanvasElement } from "./Types";
import { ElementsContext } from "./Context";
import { CANVASElement } from "./Types/Elements";

interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
	width?: number;
	height?: number;
	children?: React.ReactNode;
	type?: TypeCanvasContext;
	onUpdate?: () => void;
	onRender?: () => void;
	onDestroy?: () => void;
}

export const Context: React.FC<CanvasProps> = ({ children, width = 400, height = 400, type = "2d", onUpdate, onRender, onDestroy, ...props }) => {
	const elements = useRef<Array<CANVASElement & { executable: CanvasElement }>>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

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
		let stoped = false,
			animationFrame: number;

		const loop = () => {
			if (stoped) return;

			animationFrame = requestAnimationFrame(() => {
				const ctx = canvasRef.current?.getContext("2d");
				if (ctx) {
					ctx.clearRect(0, 0, width, height);
					elements.current.forEach(({ executable, ...props }) => {
						executable({ canvas: canvasRef.current, width, height, isGroup: false, typeContext: "2d" }, props as never);
					});
				}

				if (typeof onUpdate === "function") {
					onUpdate();
				}

				loop();
			});
		};

		loop();

		return () => {
			stoped = true;
			cancelAnimationFrame(animationFrame);
		};
	}, [width, height, elements]);

	useLayoutEffect(() => {
		if (typeof onRender === "function") {
			onRender();
		}

		return () => {
			if (typeof onDestroy === "function") {
				onDestroy();
			}
		};
	}, []);

	useEffect(() => {
		elements.current = [];
	}, [children]);

	return (
		<ElementsContext.Provider
			value={{
				canvas: canvasRef.current,
				elements: elements.current,
				pushElement,
				removeElement,
				updateElement,
				getElement,
			}}
		>
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				{...props}
			></canvas>
			{children}
		</ElementsContext.Provider>
	);
};
