import React from "react";
import { Sparkles, Layers, Clock, ArrowRight } from "lucide-react";

export default function PagePlaceholder({ title, category, description, phase }) {
  return (
    <div style={{
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      minHeight: "calc(100vh - 64px)"
    }}>
      <div style={{
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "0 10px 40px -5px rgba(0, 0, 0, 0.4)",
        maxWidth: "800px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontSize: "11px",
            fontWeight: "800",
            color: "#D1B9FE",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            padding: "3px 10px",
            borderRadius: "99px",
            textTransform: "uppercase",
            letterSpacing: "0.06em"
          }}>
            {category || "SUPER-ADMIN MODULE"}
          </span>
          <span style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#34d399",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "3px 10px",
            borderRadius: "99px"
          }}>
            Scheduled: {phase || "Phase Roadmap"}
          </span>
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#ffffff", margin: 0 }}>
          {title}
        </h1>

        <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
          {description || "This module is part of the 18-Page Super-Admin Portal architecture and is fully wired in the navigation shell."}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "12px",
          padding: "16px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          color: "#cbd5e1",
          fontSize: "13px"
        }}>
          <Clock size={18} color="#D1B9FE" />
          <span>Navigation shell is active. Ready to build features upon Phase approval.</span>
        </div>
      </div>
    </div>
  );
}
