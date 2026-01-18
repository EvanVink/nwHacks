import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmotionDetection } from '../hooks/useEmotionDetection';
import type { Emotion } from '../types';

const CallPage: React.FC = () => {
    const navigate = useNavigate();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [endMessage, setEndMessage] = useState<string>("");

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const lastEmotionRef = useRef<Emotion | null>(null);

    // Play sound when emotion is detected
    const playEmotionSound = (emotion: Emotion) => {
        const audio = new Audio(`/sounds/${emotion}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(err => console.log("Could not play sound:", err));
    };

    // End call and return to landing page
    const endCall = () => {
        // Notify the other user that this user is ending the call
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: "end-call" }));
        }
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        pcRef.current?.close();
        if (socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING) {
            socketRef.current?.close();
        }
        socketRef.current = null;
        setEndMessage("You ended the call");
        setCallEnded(true);
        setTimeout(() => navigate('/'), 2000);
    };

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
        socket.onclose = () => {
            console.log("Remote user closed connection");
            endCall();
        };

        socket.onerror = () => {
            console.log("Socket connection error");
            endCall();
        };

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
            if (data.type === "end-call") {
                console.log("Other user ended the call");
                localStreamRef.current?.getTracks().forEach(track => track.stop());
                pcRef.current?.close();
                socketRef.current = null;
                setEndMessage("The other user ended the call");
                setCallEnded(true);
                setTimeout(() => navigate('/'), 2000);
            }
        };


    }, []);

    const startCall = async () => {
        if (!pcRef.current || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socketRef.current.send(JSON.stringify({ type: "offer", offer }));
    };

    const { currentEmotion, confidence } = useEmotionDetection(
        remoteVideoRef,
        isActive
    );

    const [hasRemoteStream, setHasRemoteStream] = useState(false);

    useEffect(() => {
        const checkRemoteStream = () => {
            setHasRemoteStream(!!remoteVideoRef.current?.srcObject);
        };
        const interval = setInterval(checkRemoteStream, 500);
        return () => clearInterval(interval);
    }, []);

    // Play sound when emotion changes
    useEffect(() => {
        if (currentEmotion && currentEmotion !== lastEmotionRef.current) {
            lastEmotionRef.current = currentEmotion;
            playEmotionSound(currentEmotion);
        }
    }, [currentEmotion]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#1f1f1f",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#f5f5f5",
            }}
        >
            {/* Call Ended Popup */}
            {callEnded && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: "#2c2c2c",
                        padding: "2rem",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                        textAlign: "center",
                    }}>
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#4fc3f7" }}>
                            Call Ended
                        </h2>
                        <p style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#b0b0b0" }}>
                            {endMessage}
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#808080", marginTop: "1rem" }}>
                            Returning to home...
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{
                padding: "1.5rem",
                textAlign: "center",
                borderBottom: "1px solid #2c2c2c"
            }}>
                <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Video Call</h1>
            </div>

            {/* Main Video Area */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    gap: hasRemoteStream ? "1rem" : "0",
                    padding: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
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


            {/* Bottom Controls */}
            <div style={{
                padding: "1.5rem",
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                borderTop: "1px solid #2c2c2c"
            }}>
                <button
                    onClick={startCall}
                    style={{
                        padding: "0.75rem 2.5rem",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        backgroundColor: "#4b4b4b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "24px",
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
                <button
                    onClick={endCall}
                    style={{
                        padding: "0.75rem 2.5rem",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "24px",
                        cursor: "pointer",
                        transition: "background-color 0.3s, transform 0.2s",
                    }}
                    onMouseOver={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#f44336";
                        (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                    }}
                    onMouseOut={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#d32f2f";
                        (e.target as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                >
                    End Call
                </button>
            </div>
        </div>
    );
};

export default CallPage;
