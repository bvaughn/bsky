import { ReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback, useContext } from "react";
import { useCacheMutation } from "suspense";
import { Post } from "../../components/Post";
import withSuspenseLoader from "../../components/withSuspenseFallback";
import { SessionContext } from "../../contexts/SessionContext";
import {
  timelineCache,
  timelineCacheLoader,
} from "../../suspense/TimelineCache";
import { assert } from "../../utils/assert";
import styles from "./Timeline.module.css";

const Route = withSuspenseLoader(function Timeline() {
  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const posts = timelineCache.read(agent);

  const { isPending, mutateAsync } = useCacheMutation(timelineCache);

  const mutateAsyncWrapper = useCallback(
    (callback: () => Promise<void>) => {
      mutateAsync([agent], async () => {
        await callback();

        return timelineCacheLoader(agent);
      });
    },
    [agent, mutateAsync]
  );

  return (
    <div className={styles.Posts}>
      {posts.map((post) => (
        <Post
          hasReplies={false}
          isPending={isPending}
          key={post.post.cid}
          mutateAsync={mutateAsyncWrapper}
          postView={post.post}
          reasonRepost={post.reason as ReasonRepost}
        />
      ))}
    </div>
  );
});

export default Route;
