import { lazy, Suspense, useState, useCallback, useEffect } from "react";
import Spinner from "react-spinkit";

// Higher-order component for lazy loading with better error handling
export const createLazyComponent = (importFunc, fallback = null) => {
	const LazyComponent = lazy(importFunc);

	return (props) => (
		<Suspense
			fallback={
				fallback || (
					<div className="flex justify-center items-center min-h-[200px]">
						<Spinner name="circle" color="#3b82f6" />
					</div>
				)
			}
		>
			<LazyComponent {...props} />
		</Suspense>
	);
};

// Optimized lazy loading with preloading
export const useLazyComponent = (importFunc, preload = false) => {
	const [Component, setComponent] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const loadComponent = useCallback(async () => {
		if (Component) return Component;

		setLoading(true);
		setError(null);

		try {
			const module = await importFunc();
			const component = module.default || module;
			setComponent(() => component);
			return component;
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}, [Component, importFunc]);

	// Preload component if requested
	useEffect(() => {
		if (preload && !Component && !loading) {
			loadComponent();
		}
	}, [preload, Component, loading, loadComponent]);

	return {
		Component: Component ? () => <Component /> : null,
		loadComponent,
		loading,
		error,
	};
};

// Preload components on hover/focus for better UX
export const usePreloadOnHover = (importFunc) => {
	const [preloaded, setPreloaded] = useState(false);

	const handleMouseEnter = useCallback(() => {
		if (!preloaded) {
			importFunc().then(() => setPreloaded(true));
		}
	}, [importFunc, preloaded]);

	return { handleMouseEnter, preloaded };
};
