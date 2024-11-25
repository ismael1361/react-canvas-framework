import { useEffect, useState } from "react";
import { CanvasElement, GlobalSettingsStyled, HandlerProps } from "../Types";
import { CanvasCurrentElement, CANVASElement } from "../Types/Elements";
import { useElementesContext } from "./canvas";

export const getElementProperties = <P extends Object>(
	id: string,
	props: P | CanvasCurrentElement<P>,
	ctx?: CanvasRenderingContext2D | null,
	alternativeProps?: P | CanvasCurrentElement<P>,
): CanvasCurrentElement<P> => {
	const scale = Object.fromEntries(
		Object.entries(
			typeof (props as any)?.transform?.scale === "number"
				? {
						y: (props as any)?.transform?.scale,
						x: (props as any)?.transform?.scale,
				  }
				: {
						x: (props as any)?.transform?.scale?.x ?? undefined,
						y: (props as any)?.transform?.scale?.y ?? undefined,
				  },
		).filter(([k, v]) => v !== undefined),
	);

	const alternativeScale = Object.fromEntries(
		Object.entries(
			typeof (alternativeProps as any)?.transform?.scale === "number"
				? {
						y: (alternativeProps as any)?.transform?.scale,
						x: (alternativeProps as any)?.transform?.scale,
				  }
				: {
						x: (alternativeProps as any)?.transform?.scale?.x ?? undefined,
						y: (alternativeProps as any)?.transform?.scale?.y ?? undefined,
				  },
		).filter(([k, v]) => v !== undefined),
	);

	return {
		...(props as P),
		id,
		x: (props as any)?.x ?? (alternativeProps as any)?.x ?? 0,
		y: (props as any)?.y ?? (alternativeProps as any)?.y ?? 0,
		fill: (props as any)?.fill ?? (alternativeProps as any)?.fill ?? (ctx?.fillStyle as string) ?? "black",
		stroke: (props as any)?.stroke ?? (alternativeProps as any)?.stroke ?? (ctx?.strokeStyle as string) ?? "black",
		strokeWidth: (props as any)?.strokeWidth ?? (alternativeProps as any)?.strokeWidth ?? (ctx?.lineWidth as number) ?? 1,
		opacity: (props as any)?.opacity ?? (alternativeProps as any)?.opacity ?? (ctx?.globalAlpha as number) ?? 1,
		boxShadow: {
			color: (props as any)?.boxShadow?.color ?? (alternativeProps as any)?.boxShadow?.color ?? (ctx?.shadowColor as string) ?? "black",
			blur: (props as any)?.boxShadow?.blur ?? (alternativeProps as any)?.boxShadow?.blur ?? (ctx?.shadowBlur as number) ?? 0,
			offsetX: (props as any)?.boxShadow?.offsetX ?? (alternativeProps as any)?.boxShadow?.offsetX ?? (ctx?.shadowOffsetX as number) ?? 0,
			offsetY: (props as any)?.boxShadow?.offsetY ?? (alternativeProps as any)?.boxShadow?.offsetY ?? (ctx?.shadowOffsetY as number) ?? 0,
		},
		filter: (props as any)?.filter ?? (alternativeProps as any)?.filter ?? (ctx?.filter as string) ?? "none",
		lineCap: (props as any)?.lineCap ?? (alternativeProps as any)?.lineCap ?? (ctx?.lineCap as any) ?? "butt",
		lineDashOffset: (props as any)?.lineDashOffset ?? (alternativeProps as any)?.lineDashOffset ?? (ctx?.lineDashOffset as number) ?? 0,
		lineJoin: (props as any)?.lineJoin ?? (alternativeProps as any)?.lineJoin ?? (ctx?.lineJoin as any) ?? "bevel",
		transform: {
			matrix: (props as any)?.transform?.matrix ?? (alternativeProps as any)?.transform?.matrix ?? (ctx?.getTransform?.() as any) ?? [1, 0, 0, 0, 1, 0, 0, 0, 1],
			origin: {
				x: (props as any)?.transform?.origin?.x ?? (alternativeProps as any)?.transform?.origin?.x ?? 0,
				y: (props as any)?.transform?.origin?.y ?? (alternativeProps as any)?.transform?.origin?.y ?? 0,
			},
			translate: {
				x: (props as any)?.transform?.translate?.x ?? (alternativeProps as any)?.transform?.translate?.x ?? 0,
				y: (props as any)?.transform?.translate?.y ?? (alternativeProps as any)?.transform?.translate?.y ?? 0,
				z: (props as any)?.transform?.translate?.z ?? (alternativeProps as any)?.transform?.translate?.z ?? undefined,
			},
			rotate: (props as any)?.transform?.rotate ?? (alternativeProps as any)?.transform?.rotate ?? 0,
			scale: Object.assign({ x: 1, y: 1 }, alternativeScale, scale),
			skew: {
				x: (props as any)?.transform?.skew?.x ?? (alternativeProps as any)?.transform?.skew?.x ?? 0,
				y: (props as any)?.transform?.skew?.y ?? (alternativeProps as any)?.transform?.skew?.y ?? 0,
			},
		},
	};
};

const useEllementProperties = <P extends Object>(
	id: string,
	initialProps: Partial<P>,
	defaultProps: P & Partial<GlobalSettingsStyled>,
): [CanvasCurrentElement<P>, HandlerProps<P>, CanvasCurrentElement<P>] => {
	const [originalProps, setOriginalProps] = useState<P & Partial<GlobalSettingsStyled>>({ ...defaultProps, ...initialProps });
	const [props, setProps] = useState<P & Partial<GlobalSettingsStyled>>({ ...defaultProps, ...initialProps });
	const elementesContext = useElementesContext();

	useEffect(() => {
		setProps((pre) => {
			return { ...pre, ...initialProps };
		});
	}, [initialProps]);

	const canvas = elementesContext.canvas;
	const ctx = canvas?.getContext("2d");

	const actualProps = getElementProperties<P>(id, props as any, ctx);
	const previousProps = getElementProperties<P>(id, originalProps as any, ctx);

	const toString = () => {
		return JSON.stringify(actualProps);
	};

	const update = (update: (props: CanvasCurrentElement<P>) => P & Partial<GlobalSettingsStyled>) => {
		const props = update(actualProps);
		setProps((pre) => {
			return { ...pre, ...props };
		});
	};

	const getAttribute = <k extends keyof CanvasCurrentElement<P>>(key: k): ReturnType<typeof getElementProperties<P>>[k] => {
		return actualProps[key as any] ?? previousProps[key as any];
	};

	const setAttribute = <k extends keyof CanvasCurrentElement<P>>(key: k, value: ReturnType<typeof getElementProperties<P>>[k], isOriginal: boolean = false) => {
		setProps((p) => {
			return {
				...p,
				[key]: value,
			};
		});

		if (isOriginal)
			setOriginalProps((p) => {
				return {
					...p,
					[key]: value,
				};
			});
	};

	return [
		actualProps,
		{
			setAttribute,
			getAttribute,
			toString,
			update,
		},
		previousProps,
	];
};

export const usePropsHandle = <P extends CANVASElement>(id: string, initialProps: Partial<P>, defaultProps: P, callback: CanvasElement<P>) => {
	const [props] = useEllementProperties<P>(id, initialProps, defaultProps);
	const elementesContext = useElementesContext();

	useEffect(() => {
		elementesContext.updateElement(id, props as any, callback);
	}, [props, callback, elementesContext]);
};
