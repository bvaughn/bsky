import { BskyAgent } from "@atproto/api";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authenticateSession, restoreSavedSession } from "../utils/bluesky";

export const SessionContext = createContext<{
  agent: BskyAgent | null;
  authenticate: (
    handle: string,
    appPassword: string,
    service?: string
  ) => Promise<void>;
  // TODO Add sign-out
}>(null as any);

export function SessionContextProvider({ children }: PropsWithChildren) {
  const [agent, setAgent] = useState<BskyAgent | null>(null);

  useEffect(() => {
    async function tryRestoreSavedSession() {
      const agent = await restoreSavedSession();
      if (agent) {
        setAgent(agent);
      }
    }

    tryRestoreSavedSession();
  }, []);

  const authenticate = useCallback(
    async (handle: string, appPassword: string, service?: string) => {
      const agent = await authenticateSession(handle, appPassword, service);
      if (agent) {
        setAgent(agent);
      }
    },
    []
  );

  const context = useMemo(
    () => ({
      agent,
      authenticate,
    }),
    [agent, authenticate]
  );

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  );
}
