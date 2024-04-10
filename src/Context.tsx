import React, { createContext } from "react";
import { PropsCanvasContext, PropsGroupContext } from "./Types";

export const CanvasContext = createContext<PropsCanvasContext>({
	state: {
		canvas: null,
		width: 0,
		height: 0,
		elements: new Map(),
		isGroup: false,
		typeContext: "2d",
	},
	pushElement: () => 0,
	removeElement: () => {},
	updateCanvas: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
});

export const GroupContext = createContext<PropsGroupContext>({
	state: {
		canvas: null,
		width: 0,
		height: 0,
		elements: new Map(),
		isGroup: false,
		typeContext: "2d",
	},
	pushElement: () => 0,
	removeElement: () => {},
	updateCanvas: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
});
