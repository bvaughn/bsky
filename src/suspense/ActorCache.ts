import { BskyAgent } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { createCache } from "suspense";

// https://atproto.com/lexicons/app-bsky-actor#appbskyactorgetprofile
export const actorCache = createCache<
  [agent: BskyAgent, actor: string],
  ProfileViewDetailed
>({
  debugLabel: "app.bsky.actor.getProfile",
  getKey: ([agent, actor]) => actor,
  load: async ([agent, actor]) => {
    const response = await agent.getProfile({ actor });
    return response.data;
  },
});
