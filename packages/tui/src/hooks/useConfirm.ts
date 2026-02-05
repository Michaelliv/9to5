import { useInput } from "ink";
import { useCallback, useState } from "react";

export function useConfirm(isActive: boolean): {
	pending: boolean;
	message: string;
	confirm: (message: string) => Promise<boolean>;
} {
	const [state, setState] = useState<{
		pending: boolean;
		message: string;
		resolve: ((value: boolean) => void) | null;
	}>({ pending: false, message: "", resolve: null });

	const confirm = useCallback((message: string): Promise<boolean> => {
		return new Promise<boolean>((resolve) => {
			setState({ pending: true, message, resolve });
		});
	}, []);

	useInput(
		(input) => {
			if (input === "y" || input === "Y") {
				state.resolve?.(true);
				setState({ pending: false, message: "", resolve: null });
			} else if (input === "n" || input === "N" || input === "q") {
				state.resolve?.(false);
				setState({ pending: false, message: "", resolve: null });
			}
		},
		{ isActive: isActive && state.pending },
	);

	return { pending: state.pending, message: state.message, confirm };
}
