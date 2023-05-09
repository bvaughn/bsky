import { FormEvent, useContext, useState } from "react";
import { redirect } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";

import Icon from "../../components/Icon";
import styles from "./SignIn.module.css";
import { TIMELINE_ROUTE } from "../../routes";

export default function SignIn() {
  const { agent, authenticate } = useContext(SessionContext);

  const [isPending, setIsPending] = useState(false);

  const [handle, setHandle] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [service, setService] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    await authenticate(handle, appPassword, service);
    setIsPending(false);
  };

  if (agent !== null) {
    redirect(TIMELINE_ROUTE.path);
    return null;
  }

  return (
    <form className={styles.Form} onSubmit={onSubmit}>
      <div className={styles.Group}>
        <label className={styles.GroupLabel}>Sign into</label>
        <div className={styles.InputWrapper}>
          <Icon className={styles.Icon} type="web" />
          <input
            className={styles.Input}
            disabled={isPending}
            onChange={(event) => setService(event.target.value)}
            placeholder="Bluesky Social"
            type="text"
            value={service}
          />
        </div>
      </div>
      <div className={styles.Group}>
        <label className={styles.GroupLabel}>Account</label>
        <div className={styles.InputWrapper}>
          <Icon className={styles.Icon} type="at" />
          <input
            className={styles.Input}
            disabled={isPending}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="@handle"
            type="text"
            value={handle}
          />
        </div>
        <div className={styles.InputWrapper}>
          <Icon className={styles.Icon} type="password" />
          <input
            className={styles.Input}
            disabled={isPending}
            onChange={(event) => setAppPassword(event.target.value)}
            placeholder="app password"
            type="password"
            value={appPassword}
          />
          <a
            className={styles.LearnMoreLink}
            href="https://github.com/bluesky-social/atproto-ecosystem/blob/main/app-passwords.md"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </a>
        </div>
      </div>
      <button
        className={styles.SubmitButton}
        disabled={isPending || !handle || !appPassword}
      >
        Sign in
      </button>
    </form>
  );
}
