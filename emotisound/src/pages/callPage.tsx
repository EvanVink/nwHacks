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
          socket.send(
            JSON.stringify({
              type: "ice",
              candidate: event.candidate,
            })
          );
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

        socket.send(
          JSON.stringify({
            type: "answer",
            answer,
          })
        );
      }

      if (data.type === "answer") {
        await pc.setRemoteDescription(data.answer);
      }

      if (data.type === "ice") {
        await pc.addIceCandidate(data.candidate);
      }
    };
  }, []); // runs once when component mounts

  const startCall = async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.send(
      JSON.stringify({
        type: "offer",
        offer,
      })
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Local</h2>
      <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "300px" }}></video>

      <h2>Remote</h2>
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }}></video>

      <br />
      <button onClick={startCall} style={{ marginTop: "1rem" }}>
        Start Call
      </button>
    </div>
  );
};

export default CallPage;
