import React, { useState, useEffect, useContext, ForwardedRef, useImperativeHandle, forwardRef } from "react";
import { CanvasElement, GlobalSettingsStyled } from "../Types";
import { CanvasContext, GroupContext } from "../Context";
import { generateUniqueId } from ".";

export const useCanvasContext = () => {
	const canvasContext = useContext(CanvasContext);
	const groupContext = useContext(GroupContext);
	return groupContext.state.isGroup ? groupContext : canvasContext;
};

export const useCanvas = (callback: CanvasElement, deps: React.DependencyList) => {
	const canvasContext = useCanvasContext();
	const [id] = useState<string>(generateUniqueId());
	const [time] = useState<number>(Date.now());
	const [index, setIndex] = useState<number>(0);

	useEffect(() => {
		const { pushElement, removeElement, updateCanvas } = canvasContext;
		const index = pushElement(id, time, callback);
		setIndex(index);
		updateCanvas();
		return () => {
			removeElement(id, time);
		};
	}, [...deps, id]);

	return canvasContext;
};
