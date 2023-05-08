import { useParams } from "react-router-dom";
import withSuspenseLoader from "../components/withSuspenseFallback";
import { actorCache } from "../suspense/ActorCache";
import { agentCache } from "../suspense/AgentCache";

import { BskyAgent } from "@atproto/api";
import { FeedViewPost } from "../components/FeedViewPost";
import { authorFeedCache } from "../suspense/AuthorFeedCache";
import styles from "./Profile.module.css";

const Route = withSuspenseLoader(function Post() {
  const { handle } = useParams();

  const agent = agentCache.read();
  // const did = didCache.read(agent, handle!);
  const profileView = actorCache.read(agent, handle!);

  return (
    <div className={styles.Profile}>
      <div className={styles.Banner}>
        <img
          alt="Banner"
          className={styles.BannerImage}
          src={profileView.banner}
        />
        <img
          alt="Avatar"
          className={styles.AvatarImage}
          src={profileView.avatar}
        />
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
        <FeedViewPost key={post.post.cid} post={post} />
      ))}
    </div>
  );
});

export default Route;
