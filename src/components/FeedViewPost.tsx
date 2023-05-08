import { FeedViewPost as FeedViewPostType } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

import { Link } from "react-router-dom";
import { POST_ROUTE, PROFILE_ROUTE } from "../config";
import { formatRelativeTime } from "../utils/time";
import styles from "./FeedViewPost.module.css";

export function FeedViewPost({ post }: { post: FeedViewPostType }) {
  const createdAt = new Date((post.post.record as any).createdAt);

  // e.g. at://did:plc:4w3lx5jmokfvihilz2q562ev/app.bsky.feed.post/3jv6commtli2u
  const uri = post.post.uri.split("/").pop() as string;

  console.log(post);

  return (
    <div className={styles.Post}>
      <img
        className={styles.Avatar}
        src={post.post.author.avatar}
        alt="avatar"
      />

      <div className={styles.Column}>
        <div className={styles.Row}>
          <Link
            className={styles.Link}
            to={PROFILE_ROUTE.linkTo(post.post.author.handle)}
          >
            <div className={styles.DisplayName}>
              {post.post.author.displayName}
            </div>
            <div className={styles.Handle}>(@{post.post.author.handle})</div>
          </Link>
          •
          <Link
            className={styles.Link}
            to={POST_ROUTE.linkTo(post.post.author.handle, uri)}
          >
            {formatRelativeTime(createdAt)}
          </Link>
        </div>

        <div>{(post.post.record as any).text ?? ""}</div>
      </div>
    </div>
  );
}
