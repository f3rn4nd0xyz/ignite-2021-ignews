import { SignInButton } from "../SingInButton";
import styles from "./styles.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActiveLink } from "../ActiveLink";

export function Header() {
    const { asPath } = useRouter();

    

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/assets/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/" legacyBehavior>
            <a className={asPath === '/' ? styles.active : ''}>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" legacyBehavior>
            <a className={asPath === '/posts' ? styles.active : ''}>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
