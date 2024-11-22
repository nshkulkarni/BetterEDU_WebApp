import { useRTCClient, useLocalMicrophoneTrack, useLocalCameraTrack } from "agora-rtc-react";

const appId = "02f6416f4e654d1d98cd60fd9f6fb5c8";
const token = null;

export const config = { mode: "rtc", codec: "vp8", appId, token };

// Hook for Agora client
export const useClient = () => useRTCClient(config);

// Hook for microphone and camera tracks
export const useMicrophoneAndCameraTracks = () => {
  const microphoneTrack = useLocalMicrophoneTrack();
  const cameraTrack = useLocalCameraTrack();

  return {
    ready: microphoneTrack && cameraTrack,
    tracks: [microphoneTrack, cameraTrack],
  };
};

// Keeping `streamName` intact
export const streamName = "hello"; // Replace with your actual stream name logic
