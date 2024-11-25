import { createContext } from "react";
import { PropsElementsContext } from "./Types";

export const ElementsContext = createContext<PropsElementsContext>({
	canvas: null,
	elements: [],
	pushElement: () => 0,
	removeElement: () => {},
	updateElement: () => {},
	getElement: () => null,
});
