import React, { useState, useEffect, useRef } from 'react';
import { useEmotionDetection } from '../hooks/useEmotionDetection';

const CallPage: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isActive, setIsActive] = useState(false);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const config = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    useEffect(() => {
        // Prevent duplicate connections
        if (socketRef.current) return;

        socketRef.current = new WebSocket("wss://testnw.onrender.com/");

        async function init() {
            localStreamRef.current = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current;
            }

            pcRef.current = new RTCPeerConnection(config);

            localStreamRef.current.getTracks().forEach((track) => {
                pcRef.current!.addTrack(track, localStreamRef.current!);
            });

            pcRef.current.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                    setIsActive(true);
                }
            };

            pcRef.current.onicecandidate = (event) => {
                if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
                }
            };
        }

        init();

        const socket = socketRef.current!;
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "offer") {
                await pcRef.current!.setRemoteDescription(data.offer);
                const answer = await pcRef.current!.createAnswer();
                await pcRef.current!.setLocalDescription(answer);
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: "answer", answer }));
                }
            }
            if (data.type === "answer") await pcRef.current!.setRemoteDescription(data.answer);
            if (data.type === "ice") await pcRef.current!.addIceCandidate(data.candidate);
        };


    }, []);

    const startCall = async () => {
        if (!pcRef.current || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socketRef.current.send(JSON.stringify({ type: "offer", offer }));
    };

    const { currentEmotion, confidence, error: detectionError } = useEmotionDetection(
        remoteVideoRef,
        isActive
    );

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
                        flex: isActive ? 1 : 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#2c2c2c",
                        padding: "1rem",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        transition: "flex 0.4s ease",
                    }}
                >
                    <h2 style={{ marginBottom: "1rem" }}>Local</h2>

                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                            width: "100%",
                            maxWidth: isActive ? "320px" : "480px",
                            aspectRatio: "4 / 3",
                            borderRadius: "8px",
                            backgroundColor: "#000",
                            transition: "all 0.4s ease",
                        }}
                    />
                </div>



                {/* Remote Video */}
                <div
                    style={{
                        flex: isActive ? 1 : 0,
                        opacity: isActive ? 1 : 0,
                        overflow: "hidden",
                        pointerEvents: isActive ? "auto" : "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#2c2c2c",
                        padding: isActive ? "1rem" : "0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        transition: "all 0.4s ease",
                    }}
                >
                    <h2 style={{ marginBottom: "1rem" }}>Remote</h2>

                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                            width: "100%",
                            maxWidth: "320px",
                            aspectRatio: "4 / 3",
                            borderRadius: "8px",
                            backgroundColor: "#000",
                        }}
                    />
                    {isActive && currentEmotion && (
                        <div style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
                            {currentEmotion} ({Math.round(confidence * 100)}%)
                        </div>
                    )}
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
