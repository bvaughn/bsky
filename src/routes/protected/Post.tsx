import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ThreadViewPost } from "../../components/ThreadViewPost";
import withSuspenseLoader from "../../components/withSuspenseFallback";
import { SessionContext } from "../../contexts/SessionContext";
import { didCache } from "../../suspense/DIDCache";
import { postThreadCache } from "../../suspense/PostCache";
import { assert } from "../../utils/assert";
import { isThreadViewPost } from "../../utils/bluesky";

const Route = withSuspenseLoader(function Post() {
  const { handle, uri: uriFromParams } = useParams();

  const { agent } = useContext(SessionContext);
  assert(agent != null);

  const did = didCache.read(agent, handle!);

  const uri = `at://${did}/app.bsky.feed.post/${uriFromParams}`;

  const post = postThreadCache.read(agent, uri);

  if (isThreadViewPost(post)) {
    return <ThreadViewPost post={post} />;
  } else {
    // TODO Handle other types
    return <div>Unsupported type</div>;
  }
});

export default Route;
