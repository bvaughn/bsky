import { BskyAgent } from "@atproto/api";
import { createCache } from "suspense";

// Provides the DID of a repo
// https://atproto.com/lexicons/com-atproto-identity#comatprotoidentityresolvehandle
export const didCache = createCache<[agent: BskyAgent, handle: string], string>(
  {
    debugLabel: "com.atproto.identity.resolveHandle",
    getKey: ([agent, handle]) => handle,
    load: async ([agent, handle]) => {
      const response = await agent.resolveHandle({ handle });
      return response.data.did;
    },
  }
);
