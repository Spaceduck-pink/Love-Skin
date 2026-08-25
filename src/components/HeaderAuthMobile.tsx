import { getHeaderAuth } from "@/lib/header-auth";
import { signInWithGoogle, signOut } from "@/lib/auth-actions";
import MobileNavLink from "./MobileNavLink";
import styles from "./Header.module.css";

export default async function HeaderAuthMobile() {
  const { isSignedIn, isAdmin, username } = await getHeaderAuth();
  const signIn = signInWithGoogle.bind(null, "/");

  return (
    <>
      {isAdmin && (
        <MobileNavLink href="/admin" className={styles.mobileNavLink}>
          Admin dashboard
        </MobileNavLink>
      )}

      {isSignedIn ? (
        <>
          {username && (
            <MobileNavLink href={`/u/${username}`} className={styles.mobileNavLink}>
              View profile
            </MobileNavLink>
          )}
          <MobileNavLink href="/my-routine" className={styles.mobileNavLink}>
            My routine
          </MobileNavLink>
          <MobileNavLink href="/settings" className={styles.mobileNavLink}>
            Settings
          </MobileNavLink>
          <form action={signOut}>
            <button type="submit" className={`${styles.mobileNavLink} ${styles.mobileNavButton}`}>
              Log out
            </button>
          </form>
        </>
      ) : (
        <form action={signIn}>
          <button type="submit" className={`${styles.mobileNavLink} ${styles.mobileNavButton}`}>
            Log in
          </button>
        </form>
      )}
    </>
  );
}
