import { useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../../components/Post";
import withSuspenseLoader from "../../components/withSuspenseFallback";
import { SessionContext } from "../../contexts/SessionContext";
import { didCache } from "../../suspense/DIDCache";
import {
  postThreadCache,
  postThreadCacheLoader,
} from "../../suspense/PostCache";
import { assert } from "../../utils/assert";
import { isThreadViewPost, paramsToUri } from "../../utils/bluesky";

import {
  ReasonRepost,
  ThreadViewPost as ThreadViewPostType,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";

import { BskyAgent } from "@atproto/api";
import { useCacheMutation } from "suspense";
import styles from "./Post.module.css";

const Route = withSuspenseLoader(function Post() {
  const { handle, uri: uriFromParams } = useParams();
  assert(handle != null && uriFromParams != null);

  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const did = didCache.read(agent, handle);
  const uri = paramsToUri(did, uriFromParams);
  const post = postThreadCache.read(agent, uri);
  assert(isThreadViewPost(post));

  return <ThreadViewPost post={post} rootUri={uri} />;
});

export default Route;

function ThreadViewPost({
  post,
  rootUri,
}: {
  post: ThreadViewPostType;
  rootUri: string;
}) {
  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const roots: ThreadViewPostType[] = [];
  let record = post.post.record as any; // TODO Type
  while (record?.reply?.parent) {
    const post = postThreadCache.read(agent, record.reply?.parent.uri);
    if (isThreadViewPost(post)) {
      roots.unshift(post);
      record = post.post.record;
    } else {
      record = null;
    }
  }

  const posts: ThreadViewPostType[] = [];
  const queue: ThreadViewPostType[][] = [[post]];

  while (queue.length > 0) {
    const chunk = queue.shift() as ThreadViewPostType[];
    for (let index = chunk.length - 1; index >= 0; index--) {
      const post = chunk[index];
      if (isThreadViewPost(post)) {
        posts.push(post);

        if (post.replies) {
          queue.push(
            post.replies.filter(isThreadViewPost) as ThreadViewPostType[]
          );
        }
      }
    }
  }

  return (
    <div className={styles.Posts}>
      {roots.map((post) => (
        <PostWrapper
          agent={agent}
          key={post.post.cid}
          mutationUri={post.post.uri}
          post={post}
        />
      ))}
      {posts.map((post) => (
        <PostWrapper
          agent={agent}
          key={post.post.cid}
          mutationUri={rootUri}
          post={post}
        />
      ))}
    </div>
  );
}

function PostWrapper({
  agent,
  mutationUri,
  post,
}: {
  agent: BskyAgent;
  mutationUri: string;
  post: ThreadViewPostType;
}) {
  const { isPending, mutateAsync } = useCacheMutation(postThreadCache);

  const mutateAsyncWrapper = useCallback(
    (callback: () => Promise<void>) => {
      mutateAsync([agent, mutationUri], async () => {
        await callback();

        return postThreadCacheLoader(agent, mutationUri);
      });
    },
    [agent, mutateAsync, mutationUri]
  );

  const hasReplies = Boolean(post.replies && post.replies.length > 0);

  return (
    <Post
      hasReplies={hasReplies}
      isPending={isPending}
      mutateAsync={mutateAsyncWrapper}
      postView={post.post}
      reasonRepost={post.reason as ReasonRepost}
    />
  );
}
