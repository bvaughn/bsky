import { ComponentType, lazy } from "react";

export type Route = {
  Component: ComponentType;
  path: string;

  // Allow other properties (like linkTo() functions)
  [key: string]: unknown;
};

export const PAGE_NOT_FOUND_ROUTE = {
  Component: lazy(() => import("./routes/PageNotFound")),
  path: "*",
};

export const PROFILE_ROUTE = {
  Component: lazy(() => import("./routes/Profile")),
  linkTo: (handle: string) => `/profile/${handle}`,
  path: "/profile/:handle",
};

export const POST_ROUTE = {
  Component: lazy(() => import("./routes/Post")),
  linkTo: (handle: string, uri: string) => `/profile/${handle}/post/${uri}`,
  path: "/profile/:handle/post/:uri",
};

export const TIMELINE_ROUTE = {
  Component: lazy(() => import("./routes/Timeline")),
  path: "/",
};

export const ROUTES: Route[] = [
  PAGE_NOT_FOUND_ROUTE,
  PROFILE_ROUTE,
  POST_ROUTE,
  TIMELINE_ROUTE,
];
