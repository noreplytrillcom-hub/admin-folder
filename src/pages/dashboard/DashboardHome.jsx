import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function DashboardHome() {
  const { user } = useAuth();
  const currentFormattedDate = new Date().toUTCString();
  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className={styles.welcomeCard}>
      <div className={styles.welcomeText}>
        <h1>Hello {displayName}, Welcome to Testo</h1>
        <p>{currentFormattedDate}</p>
      </div>
      <img
        src="/SEO analytics team.gif"
        alt="Dashboard Illustration"
        className={styles.bannerIllustration}
      />
    </div>
  );
}
