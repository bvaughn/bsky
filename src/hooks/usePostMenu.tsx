import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import {
  ContextMenuDivider,
  ContextMenuItem,
  useContextMenu,
} from "use-context-menu";
import Icon from "../components/Icon";

// TODO
export function usePostMenu(postView: PostView) {
  const {
    contextMenu: menu,
    onContextMenu: onClick,
    onKeyDown,
  } = useContextMenu(
    <>
      <ContextMenuItem>
        <>
          <Icon type="copy" /> Copy post text
        </>
      </ContextMenuItem>
      <ContextMenuItem>
        <>
          <Icon type="share" /> Share
        </>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem>
        <>
          <Icon type="mute" /> Mute thread
        </>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem>
        <>
          <Icon type="report" /> Report post
        </>
      </ContextMenuItem>
      <ContextMenuItem>
        <>
          <Icon type="delete" /> Delete post
        </>
      </ContextMenuItem>
    </>,
    { alignTo: "auto-target" }
  );

  return { menu, onClick, onKeyDown };
}
