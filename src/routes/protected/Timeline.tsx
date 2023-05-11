import { useContext } from "react";
import { Post } from "../../components/Post";
import withSuspenseLoader from "../../components/withSuspenseFallback";
import { SessionContext } from "../../contexts/SessionContext";
import { timelineCache } from "../../suspense/TimelineCache";
import { assert } from "../../utils/assert";
import styles from "./Timeline.module.css";
import { ReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

const Route = withSuspenseLoader(function Timeline() {
  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const posts = timelineCache.read(agent);

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
