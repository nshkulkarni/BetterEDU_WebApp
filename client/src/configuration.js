import {createClient, createMicrophoneAndCameraTracks} from "agora-rtc-react"


const appId = "29a0add947fd4445b04aa9298aacf70d"
const token = null 
export const config = {mode: "rtc" , codec: "vp8", appId: appId, token: token}; 
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks(); 
export const useClient = createClient(config); 
export const streamName ="hello"; 
