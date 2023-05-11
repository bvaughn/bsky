import { ThreadViewPost as ThreadViewPostType } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

import { isThreadViewPost } from "../utils/bluesky";
import { Post } from "./Post";
import styles from "./ThreadViewPost.module.css";

export function ThreadViewPost({ post }: { post: ThreadViewPostType }) {
  return (
    <div className={styles.Posts}>
      <Post postView={post.post} />
      {post.replies?.map((reply) => {
        if (isThreadViewPost(reply)) {
          return <Post key={reply.post.cid} postView={reply.post} />;
        } else {
          // TODO
          return null;
        }
      })}
    </div>
  );
}
