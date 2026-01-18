import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#2c2c2c", // dark grey background
        color: "#f5f5f5", // light grey text
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#fff" }}>
        Welcome to My Video App
      </h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "2rem", maxWidth: "600px" }}>
        Easily start video calls with friends. Click below to get started!
      </p>

      <Link
        to="/call"
        style={{
          padding: "1rem 2.5rem",
          fontSize: "1.2rem",
          fontWeight: "bold",
          backgroundColor: "#4b4b4b", // medium grey button
          color: "#fff",
          borderRadius: "10px",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "transform 0.2s, background-color 0.3s",
        }}
        onMouseOver={(e) => {
          (e.target as HTMLAnchorElement).style.backgroundColor = "#5c5c5c"; // lighter on hover
          (e.target as HTMLAnchorElement).style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          (e.target as HTMLAnchorElement).style.backgroundColor = "#4b4b4b";
          (e.target as HTMLAnchorElement).style.transform = "scale(1)";
        }}
      >
        Go to Call Page
      </Link>
    </div>
  );
};

export default LandingPage;
