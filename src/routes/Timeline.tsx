import { agentCache } from "../suspense/AgentCache";
import { timelineCache } from "../suspense/TimelineCache";
import { FeedViewPost } from "../components/FeedViewPost";
import styles from "./Timeline.module.css";
import withSuspenseLoader from "../components/withSuspenseFallback";

const Route = withSuspenseLoader(function Timeline() {
  const agent = agentCache.read();
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
