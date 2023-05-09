import { ThreadViewPost as ThreadViewPostType } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

import format from "date-fns/format";
import { Link } from "react-router-dom";
import { PROFILE_ROUTE } from "../routes";
import { usePostMenu } from "../hooks/usePostMenu";
import { isThreadViewPost } from "../utils/bluesky";
import { formatRelativeTime } from "../utils/time";
import Icon from "./Icon";
import styles from "./ThreadViewPost.module.css";

export function ThreadViewPost({ post }: { post: ThreadViewPostType }) {
  const createdAt = new Date((post.post.record as any).createdAt);
  const { menu, onClick, onKeyDown } = usePostMenu(post.post);

  return (
    <>
      <div className={styles.Post}>
        <div className={styles.Row}>
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
              </Link>
              <div className={styles.Time}>{formatRelativeTime(createdAt)}</div>
            </div>
            <Link
              className={styles.Link}
              to={PROFILE_ROUTE.linkTo(post.post.author.handle)}
            >
              <div className={styles.Handle}>@{post.post.author.handle}</div>
            </Link>
          </div>
        </div>
        <div className={styles.Content}>
          {(post.post.record as any).text ?? ""}
        </div>
        <div className={styles.Time}>
          {format(createdAt, "LLL d, yyyy 'at' h:mm a")}
        </div>

        <div className={styles.ActionsRow}>
          <button className={styles.ActionButton}>
            <Icon className={styles.ActionIcon} type="comment" />
          </button>
          <button className={styles.ActionButton}>
            <Icon className={styles.ActionIcon} type="share" />
          </button>
          <button className={styles.ActionButton}>
            <Icon className={styles.ActionIcon} type="like" />
          </button>
          <button
            className={styles.ActionButton}
            onClick={onClick}
            onKeyDown={onKeyDown}
          >
            <Icon className={styles.ActionIcon} type="menu" />
          </button>
        </div>
      </div>
      {menu}
      {post.replies?.map((reply) => {
        if (isThreadViewPost(reply)) {
          return <ThreadViewPost key={reply.post.cid} post={reply} />;
        } else {
          // TODO
          return null;
        }
      })}
    </>
  );
}
