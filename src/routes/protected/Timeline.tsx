import { useContext } from "react";
import { FeedViewPost } from "../../components/FeedViewPost";
import withSuspenseLoader from "../../components/withSuspenseFallback";
import { SessionContext } from "../../contexts/SessionContext";
import { timelineCache } from "../../suspense/TimelineCache";
import { assert } from "../../utils/assert";
import styles from "./Timeline.module.css";

const Route = withSuspenseLoader(function Timeline() {
  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const posts = timelineCache.read(agent);

  return (
    <div className={styles.Posts}>
      {posts.map((post) => (
        <FeedViewPost key={post.post.cid} post={post} />
      ))}
    </div>
  );
});

export default Route;
