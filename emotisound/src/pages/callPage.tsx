import React, { useRef, useEffect } from "react";

const CallPage: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  let pc: RTCPeerConnection;
  let localStream: MediaStream;
  const socket = new WebSocket("wss://testnw.onrender.com/");

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    async function init() {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      pc = new RTCPeerConnection(config);

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
        }
      };
    }

    init();

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "offer") {
        await pc.setRemoteDescription(data.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", answer }));
      }
      if (data.type === "answer") await pc.setRemoteDescription(data.answer);
      if (data.type === "ice") await pc.addIceCandidate(data.candidate);
    };
  }, []);

  const startCall = async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "offer", offer }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#1f1f1f", // dark grey background
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#f5f5f5",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Video Call</h1>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        {/* Local Video */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#2c2c2c", // card grey
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Local</h2>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "320px",
              height: "240px",
              borderRadius: "8px",
              backgroundColor: "#000",
            }}
          />
        </div>

        {/* Remote Video */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#2c2c2c", // card grey
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Remote</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: "320px",
              height: "240px",
              borderRadius: "8px",
              backgroundColor: "#000",
            }}
          />
        </div>
      </div>

      <button
        onClick={startCall}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          fontWeight: "bold",
          backgroundColor: "#4b4b4b",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s, transform 0.2s",
        }}
        onMouseOver={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = "#5c5c5c";
          (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = "#4b4b4b";
          (e.target as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        Start Call
      </button>
    </div>
  );
};

export default CallPage;
