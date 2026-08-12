import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Cpu,
  Play,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/login.css";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { signInWithGoogle, user, authError } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleClick = async () => {
    setLocalError("");
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err.message || "Google sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="landing-container">
      {/* BACKGROUND MESH GLOWS */}
      <div className="mesh-glow glow-1"></div>
      <div className="mesh-glow glow-2"></div>
      <div className="mesh-glow glow-3"></div>

      {/* TOP HEADER */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="logo-icon">T</div>
          <span className="logo-text">testo</span>
        </div>
        <div className="header-status-badge">
          <span className="status-dot pulsing"></span>
          <span>System Operational • v2.4</span>
        </div>
      </header>

      {/* MAIN HERO SPLIT SCREEN */}
      <main className="hero-split-container">
        {/* LEFT COLUMN: BRANDING & LIVE DEMO SHOWCASE */}
        <div className="hero-left-col">
          <div className="badge-tag">
            <Sparkles size={14} color="#D1B9FE" /> Enterprise Quality Platform
          </div>

          <h1 className="hero-title">
            Automated testing <br />
            for <span className="highlight">modern dev teams</span>
          </h1>

          <p className="hero-subtitle">
            Accelerate release cycles, catch bugs before production, and empower your team with Testo's autonomous testing pipeline.
          </p>

          {/* AI AGENT DEMO CARD */}
          <div className="agent-card-wrapper">
            <div className="agent-card">
              <div className="card-topbar">
                <div className="topbar-badge">
                  <Bot size={18} color="#D1B9FE" />
                  <span>Testo Agent v2.4</span>
                </div>
                <div className="topbar-status">
                  <span className="live-dot"></span>
                  <span>Autonomous</span>
                </div>
              </div>

              <div className="card-body">
                <div className="prompt-box">
                  <Terminal size={16} color="#D1B9FE" />
                  <span>testo run --suite=checkout --env=prod</span>
                </div>

                <div className="pipeline">
                  <div className="pipeline-header">
                    <span className="pipeline-title">
                      <Cpu size={14} color="#38bdf8" /> Executing Automated Tests
                    </span>
                    <span className="pipeline-percent">88% Complete</span>
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

                    <div className="step-item active-step">
                      <div className="step-info">
                        <Play size={15} color="#D1B9FE" className="spin-slow" />
                        <span>E2E Order Confirmation Email</span>
                      </div>
                      <span className="status-text running">RUNNING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* METRIC PILLS */}
          <div className="metrics-pills-row">
            <div className="metric-pill">
              <Sparkles size={16} color="#D1B9FE" />
              <div>
                <strong>99.9%</strong>
                <span>Accuracy</span>
              </div>
            </div>
            <div className="metric-pill">
              <Zap size={16} color="#38bdf8" />
              <div>
                <strong>10X</strong>
                <span>Speed</span>
              </div>
            </div>
            <div className="metric-pill">
              <Shield size={16} color="#10b981" />
              <div>
                <strong>SOC2</strong>
                <span>Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FLOATING GLASS AUTH CARD */}
        <div className="hero-right-col">
          <div className="glass-auth-card">
            {/* CARD HEADER */}
            <div className="auth-card-header">
              <h2>Welcome to Testo</h2>
              <p>Sign in with your authorized Google SSO account</p>
            </div>

            {/* ERROR DISPLAY */}
            {displayedError && (
              <div className="auth-error-banner">
                <AlertTriangle size={16} color="#ef4444" />
                <span>{displayedError}</span>
              </div>
            )}

            {/* GOOGLE SSO SIGN-IN */}
            <div className="sso-container">
              <button
                type="button"
                className="btn-google-login"
                onClick={handleGoogleClick}
                disabled={isSubmitting}
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
                <span>{isSubmitting ? "Connecting..." : "Continue with Google SSO"}</span>
              </button>

              <div className="sso-features-list">
                <div className="sso-feature">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Google Workspace Single Sign-On</span>
                </div>
                <div className="sso-feature">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Role-Based Access & DB Verification</span>
                </div>
                <div className="sso-feature">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Secure Session Audit & Encrypted Sync</span>
                </div>
              </div>
            </div>

            {/* CARD FOOTER */}
            <div className="auth-card-footer">
              <Shield size={14} color="#64748b" />
              <span>Protected by Enterprise OAuth 2.0 Security</span>
            </div>
          </div>
        </div>
      </main>

      {/* PARTNERS BANNER */}
      <section className="partners-banner">
        <span className="partners-label">TRUSTED BY ENGINEERING TEAMS AT</span>
        <div className="partners-logos-wrap">
          <span className="partner-logo">FARFETCH</span>
          <span className="partner-logo">UBISOFT</span>
          <span className="partner-logo">ASTER</span>
          <span className="partner-logo">XE</span>
          <span className="partner-logo">ALDI</span>
        </div>
      </section>
    </div>
  );
}
