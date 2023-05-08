import { BskyAgent } from "@atproto/api";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { createCache } from "suspense";

// A view of an actor's feed
// https://atproto.com/lexicons/app-bsky-feed#appbskyfeedgetauthorfeed
// TODO This should probably be an interval cache (to work with cursor?)
export const authorFeedCache = createCache<
  [agent: BskyAgent, actor: string],
  FeedViewPost[]
>({
  debugLabel: "app.bsky.feed.getAuthorFeed",
  getKey: ([agent, actor]) => actor,
  load: async ([agent, actor]) => {
    const response = await agent.getAuthorFeed({
      actor,
    });
    return response.data.feed;
  },
});
