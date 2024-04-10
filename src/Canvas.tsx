import React, { useRef, useState, useEffect, useContext, useCallback, forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { TypeCanvasContext, CanvasElement } from "./Types";
import { CanvasContext } from "./Context";

interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
	width?: number;
	height?: number;
	children?: React.ReactNode;
	type?: TypeCanvasContext;
	onUpdate?: () => void;
	onRender?: () => void;
	onDestroy?: () => void;
}

export const Context = forwardRef<HTMLCanvasElement | null, CanvasProps>(({ children, width = 400, height = 400, type = "2d", onUpdate, onRender, onDestroy, ...props }, ref) => {
	const elements = useRef<Map<string, { executable: CanvasElement; time: number; index: number }>>(new Map());
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pendencyRef = useRef<number>(0);

	const updateCanvas = useCallback(() => {
		if (pendencyRef.current > 0) {
			pendencyRef.current += 1;
			return;
		}
		pendencyRef.current = 1;
		const loop = () => {
			requestAnimationFrame(() => {
				const ctx = canvasRef.current?.getContext("2d");
				if (ctx) {
					ctx.clearRect(0, 0, width, height);
					const elementsArray = Array.from(elements.current.entries());
					elementsArray.sort((a, b) => a[1].index - b[1].index);
					elementsArray.forEach(([_, { executable }]) => {
						executable({ canvas: canvasRef.current, width, height, isGroup: false, typeContext: "2d" });
					});
				}
				if (pendencyRef.current > 1) {
					pendencyRef.current = 1;
					loop();
				}
				pendencyRef.current = 0;

				if (typeof onUpdate === "function") {
					onUpdate();
				}
			});
		};

		loop();
	}, [width, height]);

	const pushElement = useCallback(
		(id: string, time: number, element: CanvasElement) => {
			const index = elements.current.size;
			elements.current.set(id, { executable: element, time, index });
			updateCanvas();
			return index;
		},
		[elements],
	);

	const removeElement = useCallback(
		(id: string, time: number) => {
			elements.current.delete(id);
			updateCanvas();
		},
		[elements],
	);

	const addEventListener = useCallback((event: string, callback: (event: any) => void) => {}, []);

	const removeEventListener = useCallback((event: string, callback: (event: any) => void) => {}, []);

	useEffect(() => {
		updateCanvas();
	}, [width, height, elements]);

	useImperativeHandle(
		ref,
		() => {
			return canvasRef?.current as any;
		},
		[canvasRef?.current],
	);

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

	return (
		<CanvasContext.Provider
			value={{
				state: {
					canvas: canvasRef.current,
					width,
					height,
					elements: elements.current,
					isGroup: false,
					typeContext: "2d",
				},
				pushElement,
				removeElement,
				updateCanvas,
				addEventListener,
				removeEventListener,
			}}
		>
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				{...props}
			></canvas>
			{children}
		</CanvasContext.Provider>
	);
});
