import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Lock,
  Play,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/login.css";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { signInWithGoogle, user, authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="logo-icon">T</div>
          <span>testo</span>
        </div>

      </header>

      {/* HERO SECTION */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="badge-tag">
            <Sparkles size={14} color="#818cf8" /> Enterprise Admin & Quality Platform
          </div>

          <h1 className="hero-title">
            Automated testing <br />
            for <span className="highlight">modern dev teams</span>
          </h1>

          <p className="hero-subtitle">
            Accelerate release cycles, catch bugs early, and streamline end-to-end software quality with Testo's autonomous testing dashboard.
          </p>

          <div className="login-action-box">
            <button
              className="btn-google-login"
              onClick={() => signInWithGoogle()}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="login-features">
              <div className="feature-check">
                <CheckCircle2 size={15} color="#10b981" /> Single Sign-On (SSO)
              </div>
              <div className="feature-check">
                <CheckCircle2 size={15} color="#10b981" /> Role-Based Access
              </div>
            </div>
          </div>

          {authError && (
            <div className="auth-error">
              <AlertTriangle size={16} />
              <span>{authError}</span>
            </div>
          )}
        </div>

        {/* AI AGENT DEMO CARD */}
        <div className="hero-illustration">
          <div className="agent-card">
            <div className="card-topbar">
              <div className="topbar-badge">
                <Bot size={18} color="#818cf8" />
                <span>Testo Agent v2.4</span>
              </div>
              <div className="topbar-status">
                <span className="live-dot"></span>
                <span>Autonomous</span>
              </div>
            </div>

            <div className="card-body">
              <div className="prompt-box">
                <Terminal size={16} color="#818cf8" />
                <span>testo run --suite=checkout --env=prod</span>
              </div>

              <div className="pipeline">
                <div className="pipeline-header">
                  <span>Executing Automated Tests</span>
                  <span style={{ color: "#10b981", fontWeight: "700" }}>
                    88% Complete
                  </span>
                </div>

                <div className="progress-track">
                  <div className="progress-fill"></div>
                </div>

                <div className="step-list">
                  <div className="step-item">
                    <div className="step-info">
                      <CheckCircle2 size={15} color="#10b981" />
                      <span>Authentication & SSO Flow</span>
                    </div>
                    <span className="status-text passed">PASSED</span>
                  </div>

                  <div className="step-item">
                    <div className="step-info">
                      <CheckCircle2 size={15} color="#10b981" />
                      <span>Stripe Payment API Handshake</span>
                    </div>
                    <span className="status-text passed">PASSED</span>
                  </div>

                  <div className="step-item">
                    <div className="step-info">
                      <Play size={15} color="#818cf8" />
                      <span>E2E Order Confirmation Email</span>
                    </div>
                    <span className="status-text running">RUNNING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* PARTNERS LOGO BANNER */}
      <section className="partners-banner">
        <span className="partner-logo">FARFETCH</span>
        <span className="partner-logo">UBISOFT</span>
        <span className="partner-logo">ASTER</span>
        <span className="partner-logo">XE</span>
        <span className="partner-logo">ALDI</span>
      </section>

      {/* METRICS FOOTER */}
      <footer className="metrics-section">
        <div className="metric-card">
          <div className="metric-icon">
            <Sparkles size={20} color="#818cf8" />
          </div>
          <div>
            <div className="metric-num">99.9%</div>
            <div className="metric-label">Test execution accuracy</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Zap size={20} color="#818cf8" />
          </div>
          <div>
            <div className="metric-num">10X</div>
            <div className="metric-label">Faster release pipelines</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Shield size={20} color="#818cf8" />
          </div>
          <div>
            <div className="metric-num">500+</div>
            <div className="metric-label">Enterprise deployments</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
