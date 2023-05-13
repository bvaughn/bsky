import { BskyAgent } from "@atproto/api";
import {
  BlockedPost,
  NotFoundPost,
  PostView,
  ThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { createCache } from "suspense";

// https://atproto.com/lexicons/app-bsky-feed#appbskyfeedgetpost
// agent.getPost({})

// A view of an actor's feed
// https://atproto.com/lexicons/app-bsky-feed#appbskyfeedgetposts
export const postsCache = createCache<
  [agent: BskyAgent, uris: string[]],
  PostView[]
>({
  debugLabel: "app.bsky.feed.getPosts",
  getKey: ([agent, uris]) => uris.join(","),
  load: async ([agent, uris]) => postsCacheLoader(agent, uris),
});

export async function postsCacheLoader(
  agent: BskyAgent,
  uris: string[]
): Promise<PostView[]> {
  const result = await agent.getPosts({
    uris,
  });
  return result.data.posts;
}

// https://atproto.com/lexicons/app-bsky-feed#appbskyfeedgetpostthread
export const postThreadCache = createCache<
  [agent: BskyAgent, uri: string, depth?: number],
  ThreadViewPost | NotFoundPost | BlockedPost
>({
  debugLabel: "app.bsky.feed.getPostThread",
  getKey: ([agent, uri, depth]) => `${uri}-${depth}`,
  load: async ([agent, uri, depth]) => postThreadCacheLoader(agent, uri, depth),
});

export async function postThreadCacheLoader(
  agent: BskyAgent,
  uri: string,
  depth?: number
): Promise<ThreadViewPost | NotFoundPost | BlockedPost> {
  const result = await agent.getPostThread({
    uri,
    depth,
  });
  return result.data.thread as ThreadViewPost | NotFoundPost | BlockedPost;
}
