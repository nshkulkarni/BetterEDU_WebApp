import {createClient, createMicrophoneAndCameraTracks} from "agora-rtc-react"


const appId = "02f6416f4e654d1d98cd60fd9f6fb5c8"
const token = null 
export const config = {mode: "rtc" , codec: "vp8", appId: appId, token: token}; 
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks(); 
export const useClient = createClient(config); 
export const streamName ="hello"; 
