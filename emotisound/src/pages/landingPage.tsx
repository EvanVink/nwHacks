import React from "react";
import { Link } from "react-router-dom";

const styles = `
  @keyframes zoom {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
  
  .sway-image {
    animation: zoom 6s ease-in-out infinite;
  }
`;

const LandingPage: React.FC = () => {
  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "4rem 3rem",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 700,
              color: "#1a281f",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Connect With
            <br />
            <span style={{ color: "#6D28D9" }}>Emotion</span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#5a6b6b",
              marginBottom: "2rem",
              maxWidth: "500px",
              lineHeight: 1.6,
            }}
          >
            Experience video calls like never before. EmotiSound detects emotions in real-time
            and brings your conversations to life with personalized audio feedback.
          </p>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <Link
              to="/call"
              style={{
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "#6D28D9",
                color: "#ffffff",
                borderRadius: "50px",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(224, 120, 86, 0.3)",
                transition: "transform 0.3s, box-shadow 0.3s",
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLAnchorElement).style.boxShadow =
                  "0 12px 32px rgba(224, 120, 86, 0.4)";
                (e.target as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLAnchorElement).style.boxShadow =
                  "0 8px 24px rgba(224, 120, 86, 0.3)";
                (e.target as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              Start a Call
            </Link>
          </div>

          {/* Features */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "3rem" }}>
            <div>
              <h3 style={{ color: "#1a281f", marginBottom: "0.5rem", fontSize: "1rem" }}>
                Real-time Detection
              </h3>
              <p style={{ color: "#7a8a8a", fontSize: "0.9rem" }}>
                Instant emotion recognition
              </p>
            </div>
            <div>
              <h3 style={{ color: "#1a281f", marginBottom: "0.5rem", fontSize: "1rem" }}>
                Audio Feedback
              </h3>
              <p style={{ color: "#7a8a8a", fontSize: "0.9rem" }}>
                Personalized sound responses
              </p>
            </div>
            <div>
              <h3 style={{ color: "#1a281f", marginBottom: "0.5rem", fontSize: "1rem" }}>
                Better Connections
              </h3>
              <p style={{ color: "#7a8a8a", fontSize: "0.9rem" }}>
                More meaningful conversations
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(26, 40, 31, 0.1) 0%, rgba(224, 120, 86, 0.1) 100%)",
              pointerEvents: "none",
            }}
          />
          <img
            src="/images/portrait-smiley-woman-waving.jpg"
            alt="Happy woman connecting"
            className="sway-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "drop-shadow(-10px 20px 40px rgba(0, 0, 0, 0.2))",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
