import {
  ReasonRepost,
  ThreadViewPost as ThreadViewPostType,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";

import { isThreadViewPost } from "../utils/bluesky";
import { Post } from "./Post";
import styles from "./ThreadViewPost.module.css";

export function ThreadViewPost({ post }: { post: ThreadViewPostType }) {
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
