import { useParams } from "react-router-dom";
import { ThreadViewPost } from "../components/ThreadViewPost";
import withSuspenseLoader from "../components/withSuspenseFallback";
import { agentCache } from "../suspense/AgentCache";
import { didCache } from "../suspense/DIDCache";
import { postThreadCache } from "../suspense/PostCache";
import { isThreadViewPost } from "../utils/bluesky";

const Route = withSuspenseLoader(function Post() {
  const { handle, uri: uriFromParams } = useParams();

  const agent = agentCache.read();
  const did = didCache.read(agent, handle!);

  const uri = `at://${did}/app.bsky.feed.post/${uriFromParams}`;

  const postThread = postThreadCache.read(agent, uri);
  console.log(postThread);

  if (isThreadViewPost(postThread)) {
    return <ThreadViewPost post={postThread} />;
  } else {
    // TODO Handle other types
    return <div>Unsupported type</div>;
  }
});

export default Route;
