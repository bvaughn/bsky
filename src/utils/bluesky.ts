import { ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export function isThreadViewPost(value: any): value is ThreadViewPost {
  return value.$type === "app.bsky.feed.defs#threadViewPost";
}
