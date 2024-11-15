import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";

const VideoChat = () => {
  const { channelName } = useParams();
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const appId = "f7294ff691de4e0195f59f9ad1c2e9e4"; // Replace with your actual Agora App ID
  const token = "007eJxTYLipHP/G2MHO9vKZLLWldhu3iZi9Vt70r87J+gxD8MEH5ncUGNLMjSxN0tLMLA1TUk1SDQwtTdNMLdMsE1MMk41SLVNNnq0xT28IZGQwvizCysgAgSA+F4NTfkqlrmduYnoqAwMADkMhcg=="; // Replace with your actual Agora token
  const uid = null; // Leave as null for Agora to auto-assign UID

  useEffect(() => {
    let mounted = true;
    let videoTrack, audioTrack;

    const init = async () => {
      try {
        console.log("Joining channel...");
        await client.join(appId, channelName, token, uid);

        if (client.connectionState === "CONNECTED") {
          console.log("Creating and publishing local tracks...");
          videoTrack = await AgoraRTC.createCameraVideoTrack();
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

          if (mounted) {
            setLocalVideoTrack(videoTrack);
            setLocalAudioTrack(audioTrack);
            await client.publish([videoTrack, audioTrack]);
            setJoined(true);
            videoTrack.play("local-video"); // Targeting a specific div ID

            // Handle remote users joining
            client.on("user-published", async (user, mediaType) => {
              await client.subscribe(user, mediaType);
              if (mediaType === "video") {
                setRemoteUsers(prevUsers => [...prevUsers, user]);
                user.videoTrack.play(`remote-video-${user.uid}`);
              }
              if (mediaType === "audio") {
                user.audioTrack.play();
              }
            });

            // Handle remote users leaving
            client.on("user-unpublished", (user) => {
              setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
            });
          }
        }
      } catch (error) {
        console.error("Failed to join Agora channel:", error);
      }
    };

    init();

    return () => {
      mounted = false;
      console.log("Leaving channel and cleaning up...");
      client.leave();
      videoTrack?.close();
      audioTrack?.close();
    };
  }, [client, channelName, appId, token]);

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const leaveCall = async () => {
    try {
      await client.leave();
      localAudioTrack?.close();
      localVideoTrack?.close();
      setJoined(false);
    } catch (error) {
      console.error("Error leaving the call:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Video Chat - {channelName}</h2>
      <div id="video-container" style={styles.videoContainer}>
        <div id="local-video" style={styles.videoArea}></div>
        {remoteUsers.map(user => (
          <div key={user.uid} id={`remote-video-${user.uid}`} style={styles.videoArea}></div>
        ))}
      </div>
      <div style={styles.controlBar}>
        <button onClick={toggleAudio} style={styles.controlButton}>
          <img src={isAudioMuted ? "/icons/mic-off.png" : "/icons/mic-on.png"} alt="Toggle Audio" />
        </button>
        <button onClick={toggleVideo} style={styles.controlButton}>
          <img src={isVideoMuted ? "/icons/video-off.png" : "/icons/video-on.png"} alt="Toggle Video" />
        </button>
        <button onClick={leaveCall} style={styles.endButton}>
          <img src="/icons/end-call.png" alt="End Call" />
        </button>
      </div>
      {!joined && <p>Joining channel...</p>}
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1D1D42",
  },
  title: {
    color: "#00ADEF",
    marginBottom: "10px",
  },
  videoContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    height: "80%",
    backgroundColor: "#1D1D42",
    padding: "10px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  videoArea: {
    width: "45%",
    height: "300px",
    backgroundColor: "black",
    borderRadius: "10px",
    overflow: "hidden",
  },
  controlBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "10px",
    backgroundColor: "#FFFFFF",
  },
  controlButton: {
    backgroundColor: "#00ADEF",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 10px",
    cursor: "pointer",
  },
  endButton: {
    backgroundColor: "#FF4C4C",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 10px",
    cursor: "pointer",
  },
};

export default VideoChat;
