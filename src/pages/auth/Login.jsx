import {
  Bot,
  CheckCircle2,
  Play,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/login.css"; // Ensure path matches your project structure
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
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">testo</div>
        <button className="btn-liquid-glass" onClick={() => signInWithGoogle()}>
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Automated testing <br />
            for <span className="highlight">modern dev teams</span>
          </h1>
          <p className="hero-subtitle">
            Accelerate release cycles, catch bugs early, and streamline
            end-to-end software quality with Testo.
          </p>
          {authError && <p className="auth-error">{authError}</p>}
        </div>

        {/* AI Agent Card */}
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
                  <span style={{ color: "#10b981", fontWeight: "600" }}>
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

      {/* Partners Banner */}
      <section className="partners-banner">
        <span className="partner-logo">FARFETCH</span>
        <span className="partner-logo">UBISOFT</span>
        <span className="partner-logo">ASTER</span>
        <span className="partner-logo">XE</span>
        <span className="partner-logo">ALDI</span>
      </section>

      {/* Metrics Section */}
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
