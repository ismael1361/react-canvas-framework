import { useContext } from "react";
import { ElementsContext } from "../Context";

export const useElementesContext = () => {
	const elementsContext = useContext(ElementsContext);
	return elementsContext;
};
