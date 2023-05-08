import { AtpSessionData, AtpSessionEvent, BskyAgent } from "@atproto/api";
import { createSingleEntryCache } from "suspense";

export const agentCache = createSingleEntryCache<[], BskyAgent>({
  load: async () => {
    const agent = new BskyAgent({
      service: import.meta.env.VITE_BSKY_SERVICE,
      persistSession: (event: AtpSessionEvent, session?: AtpSessionData) => {
        console.log("persistSession", event, session);
        if (session) {
          localStorage.setItem("bsky-session", JSON.stringify(session));
        }
      },
    });

    const savedSessionData = localStorage.getItem("bsky-session");
    if (savedSessionData) {
      console.log("resumeSession:", JSON.parse(savedSessionData));
      await agent.resumeSession(JSON.parse(savedSessionData));
    } else {
      const response = await agent.login({
        identifier: import.meta.env.VITE_BSKY_HANDLE,
        password: import.meta.env.VITE_BSKY_APP_PASSWORD,
      });
      console.log("response:", response);
    }

    return agent;
  },
});
