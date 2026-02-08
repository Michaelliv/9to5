import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
	threshold?: number;
	rootMargin?: string;
	triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
	options: UseScrollAnimationOptions = {},
) {
	const { threshold = 0.2, rootMargin = "0px", triggerOnce = true } = options;
	const ref = useRef<T>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [hasTriggered, setHasTriggered] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setIsVisible(true);
			setHasTriggered(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					setHasTriggered(true);
					if (triggerOnce) {
						observer.disconnect();
					}
				} else if (!triggerOnce) {
					setIsVisible(false);
				}
			},
			{ threshold, rootMargin },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [threshold, rootMargin, triggerOnce]);

	return { ref, isVisible, hasTriggered };
}
