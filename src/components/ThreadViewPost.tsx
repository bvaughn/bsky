import {
  ReasonRepost,
  ThreadViewPost as ThreadViewPostType,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";

import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { postThreadCache } from "../suspense/PostCache";
import { assert } from "../utils/assert";
import { isThreadViewPost } from "../utils/bluesky";
import { Post } from "./Post";
import styles from "./ThreadViewPost.module.css";

export function ThreadViewPost({ post }: { post: ThreadViewPostType }) {
  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const roots: ThreadViewPostType[] = [];
  let record = post.post.record as any; // TODO Type
  while (record?.reply?.parent) {
    const post = postThreadCache.read(agent, record.reply?.parent.uri);
    if (isThreadViewPost(post)) {
      roots.unshift(post);
      record = post.post.record;
    } else {
      record = null;
    }
  }

  const posts: ThreadViewPostType[] = [];
  const queue: ThreadViewPostType[][] = [[post]];

  while (queue.length > 0) {
    const chunk = queue.shift() as ThreadViewPostType[];
    for (let index = chunk.length - 1; index >= 0; index--) {
      const post = chunk[index];
      if (isThreadViewPost(post)) {
        posts.push(post);
        queue.push(
          post.replies?.filter(isThreadViewPost) as ThreadViewPostType[]
        );
      }
    }
  }

  return (
    <div className={styles.Posts}>
      {roots.map((post) => (
        <Post
          hasReplies={post.replies && post.replies.length > 0}
          key={post.post.cid}
          postView={post.post}
          reasonRepost={post.reason as ReasonRepost}
        />
      ))}
      {posts.map((post) => (
        <Post
          hasReplies={post.replies && post.replies.length > 0}
          key={post.post.cid}
          postView={post.post}
          reasonRepost={post.reason as ReasonRepost}
        />
      ))}
    </div>
  );
}
