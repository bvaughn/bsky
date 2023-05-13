import { BskyAgent } from "@atproto/api";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { createSingleEntryCache } from "suspense";

// A view of the user's home timeline
// https://atproto.com/lexicons/app-bsky-feed#appbskyfeedgettimeline
export const timelineCache = createSingleEntryCache<
  [agent: BskyAgent],
  FeedViewPost[]
>({
  debugLabel: "app.bsky.feed.getTimeline",
  load: async ([agent]) => timelineCacheLoader(agent),
});

export async function timelineCacheLoader(
  agent: BskyAgent
): Promise<FeedViewPost[]> {
  const response = await agent.getTimeline();
  return response.data.feed;
}
