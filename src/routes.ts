import { ComponentType, lazy } from "react";

export type Route = {
  Component: ComponentType;
  path: string;

  // Allow other properties (like linkTo() functions)
  [key: string]: unknown;
};

export const PAGE_NOT_FOUND_ROUTE = {
  Component: lazy(() => import("./routes/public/PageNotFound")),
  path: "*",
};

export const PROFILE_ROUTE = {
  Component: lazy(() => import("./routes/protected/Profile")),
  linkTo: (handle: string) => `/profile/${handle}`,
  path: "/profile/:handle",
};

export const POST_ROUTE = {
  Component: lazy(() => import("./routes/protected/Post")),
  linkTo: (handle: string, uri: string) => `/profile/${handle}/post/${uri}`,
  path: "/profile/:handle/post/:uri",
};

export const SIGN_IN_ROUTE = {
  Component: lazy(() => import("./routes/public/SignIn")),
  path: "/",
};

export const TIMELINE_ROUTE = {
  Component: lazy(() => import("./routes/protected/Timeline")),
  path: "/",
};

export const PUBLIC_ROUTES: Route[] = [PAGE_NOT_FOUND_ROUTE];
export const UNAUTHENTICATED_ROUTES: Route[] = [SIGN_IN_ROUTE];
export const AUTHENTICATED_ROUTES: Route[] = [
  PROFILE_ROUTE,
  POST_ROUTE,
  TIMELINE_ROUTE,
];
