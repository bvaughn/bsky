import { ComponentType, ReactNode, Suspense } from "react";

export default function withSuspenseLoader<Props extends Object>(
  Component: ComponentType<Props>,
  fallback: ReactNode = "Loading..."
): ComponentType<Props> {
  function WrappedComponent(props: Props) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  }

  // Format for display in DevTools
  const name = Component.displayName || Component.name || "Unknown";
  WrappedComponent.displayName = `withSuspenseLoader(${name})`;

  return WrappedComponent;
}
