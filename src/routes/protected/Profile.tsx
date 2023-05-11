import { useParams } from "react-router-dom";
import withSuspenseLoader from "../../components/withSuspenseFallback";
import { actorCache } from "../../suspense/ActorCache";

import { BskyAgent } from "@atproto/api";
import { ReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useContext } from "react";
import { Post } from "../../components/Post";
import { SessionContext } from "../../contexts/SessionContext";
import { authorFeedCache } from "../../suspense/AuthorFeedCache";
import { assert } from "../../utils/assert";
import styles from "./Profile.module.css";

const Route = withSuspenseLoader(function Post() {
  const { handle } = useParams();

  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const profileView = actorCache.read(agent, handle!);

  return (
    <div className={styles.Profile}>
      <div className={styles.Banner}>
        {profileView.banner ? (
          <img
            alt="Banner"
            className={styles.BannerImage}
            src={profileView.banner}
          />
        ) : (
          <div className={styles.BannerImage} />
        )}
        {profileView.avatar ? (
          <img
            alt="Avatar"
            className={styles.AvatarImage}
            src={profileView.avatar}
          />
        ) : (
          <div className={styles.AvatarImage} />
        )}
      </div>
      <div className={styles.DisplayName}>{profileView.displayName}</div>
      <div className={styles.Handle}>@{profileView.handle}</div>
      <div className={styles.CountsRow}>
        <div className={styles.Count}>
          {profileView.followersCount}{" "}
          <label className={styles.CountLabel}>followers</label>
        </div>
        <div className={styles.Count}>
          {profileView.followsCount}{" "}
          <label className={styles.CountLabel}>following</label>
        </div>
        <div className={styles.Count}>
          {profileView.postsCount}{" "}
          <label className={styles.CountLabel}>posts</label>
        </div>
      </div>
      <div className={styles.Description}>{profileView.description}</div>
      <Posts agent={agent} handle={handle!} />
    </div>
  );
});

const Posts = withSuspenseLoader(function Posts({
  agent,
  handle,
}: {
  agent: BskyAgent;
  handle: string;
}) {
  console.log(`<Posts handle="${handle}">`);
  const posts = authorFeedCache.read(agent, handle);
  console.log("<Posts>", posts);

  return (
    <div className={styles.Posts}>
      {posts.map((post) => (
        <Post
          key={post.post.cid}
          postView={post.post}
          reasonRepost={post.reason as ReasonRepost}
        />
      ))}
    </div>
  );
});

export default Route;
