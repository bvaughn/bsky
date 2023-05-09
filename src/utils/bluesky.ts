import { AtpSessionData, AtpSessionEvent, BskyAgent } from "@atproto/api";
import { ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

const DEFAULT_SERVICE = "https://bsky.social";

export async function authenticateSession(
  handle: string,
  appPassword: string,
  service?: string
): Promise<BskyAgent | null> {
  try {
    const agent = createAgent(service);

    const response = await agent.login({
      identifier: handle,
      password: appPassword,
    });

    if (response.success) {
      return agent;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

function createAgent(service?: string) {
  return new BskyAgent({
    service: service || DEFAULT_SERVICE,
    persistSession: (event: AtpSessionEvent, session?: AtpSessionData) => {
      if (session) {
        localStorage.setItem(
          "bsky-session",
          JSON.stringify({
            service,
            session,
          })
        );
      }
    },
  });
}

export function isThreadViewPost(value: any): value is ThreadViewPost {
  return value.$type === "app.bsky.feed.defs#threadViewPost";
}

export async function restoreSavedSession(): Promise<BskyAgent | null> {
  try {
    const data = localStorage.getItem("bsky-session");
    if (data) {
      const { service, session } = JSON.parse(data);
      const agent = createAgent(service);

      const response = await agent.resumeSession(session);
      if (response.success) {
        return agent;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}
