import {
  PostView,
  ReasonRepost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { usePostMenu } from "../hooks/usePostMenu";
import { POST_ROUTE, PROFILE_ROUTE } from "../routes";
import { formatRelativeTime } from "../utils/time";
import Icon from "./Icon";
import styles from "./Post.module.css";

export function Post({
  postView,
  reasonRepost,
}: {
  postView: PostView;
  reasonRepost: ReasonRepost | undefined;
}) {
  const { menu, onClick, onKeyDown } = usePostMenu(postView);
  console.log(postView, reasonRepost);

  const record = postView.record as any; // TODO Type

  const createdAt = new Date(record.createdAt);

  // e.g. at://did:plc:4w3lx5jmokfvihilz2q562ev/app.bsky.feed.post/3jv6commtli2u
  const uri = postView.uri.split("/").pop() as string;

  return (
    <div className={styles.Post}>
      <div className={styles.Top}>
        <div className={styles.Author}>
          <img
            className={styles.Avatar}
            src={postView.author.avatar}
            alt="avatar"
          />

          <div className={styles.AuthorColumn}>
            <div className={styles.AuthorTopRow}>
              <Link
                className={styles.DisplayNameLink}
                to={PROFILE_ROUTE.linkTo(postView.author.handle)}
              >
                {postView.author.displayName}
              </Link>
              <div className={styles.Time}>
                <Link
                  className={styles.PostLink}
                  to={POST_ROUTE.linkTo(postView.author.handle, uri)}
                >
                  {formatRelativeTime(createdAt)}
                </Link>
              </div>

              <div className={styles.Spacer} />

              {reasonRepost && (
                <div className={styles.RepostedBy}>
                  <Icon className={styles.ActionIcon} type="share" />
                  <span>Reposted by</span>
                  <Link
                    className={styles.DisplayNameLink}
                    to={PROFILE_ROUTE.linkTo(reasonRepost.by.handle)}
                  >
                    {reasonRepost.by.displayName}
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.AuthorBottomRow}>
              <Link
                className={styles.HandleLink}
                to={PROFILE_ROUTE.linkTo(postView.author.handle)}
              >
                @{postView.author.handle}
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.Text}>{record.text ?? ""}</div>

        {/* TODO Media */}

        <div className={styles.Time}>
          {format(createdAt, "LLL d, yyyy 'at' h:mm a")}
        </div>
      </div>

      <div className={styles.Bottom}>
        <div className={styles.ActionsRow}>
          <button className={styles.ActionButton}>
            <Icon className={styles.ActionIcon} type="comment" />
            {postView.replyCount && postView.replyCount > 0 && (
              <div className={styles.Count}>{postView.replyCount}</div>
            )}
          </button>
          <button className={styles.ActionButton}>
            <Icon className={styles.ActionIcon} type="share" />
            {postView.repostCount && postView.repostCount > 0 && (
              <div className={styles.Count}>{postView.repostCount}</div>
            )}
          </button>
          <button className={styles.ActionButton}>
            <Icon className={styles.ActionIcon} type="like" />
            {postView.likeCount && postView.likeCount > 0 && (
              <div className={styles.Count}>{postView.likeCount}</div>
            )}
          </button>
          <button
            className={styles.ActionButton}
            onClick={onClick}
            onKeyDown={onKeyDown}
          >
            <Icon className={styles.ActionIcon} type="menu" />
          </button>
          {menu}
        </div>
      </div>
    </div>
  );
}
