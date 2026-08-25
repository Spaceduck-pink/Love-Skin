import { getHeaderAuth } from "@/lib/header-auth";
import { signInWithGoogle } from "@/lib/auth-actions";
import AccountMenu from "./AccountMenu";
import styles from "./Header.module.css";

export default async function HeaderAuthDesktop() {
  const { isSignedIn, isAdmin, firstName, username, avatarUrl } = await getHeaderAuth();
  const signIn = signInWithGoogle.bind(null, "/");

  if (!isSignedIn) {
    return (
      <form action={signIn} className={styles.authDesktop}>
        <button type="submit" className={styles.authLink}>
          Log in
        </button>
      </form>
    );
  }

  return (
    <div className={styles.authDesktop}>
      <AccountMenu isAdmin={isAdmin} firstName={firstName} username={username} avatarUrl={avatarUrl} />
    </div>
  );
}
