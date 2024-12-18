import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // This hook will extract URL params

import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
} from "./configuration.js";
import { Grid } from "@material-ui/core";
import Video from "./VideoDisplay.js";
import Controls from "./ChatOptions.js";


/* File contains set of event handler to deal with closing/opening a new stream for the user. */

export default function VideoChat(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const [published, setIsPublished] = useState(false); // Track if already published
  const { streamName } = useParams() 
  console.log("Channel Name:", streamName);
  
  /* trrigger when a user has subscribed */ 
  useEffect(() => {
    let init = async (name) => {

      console.log( "Parameters"+ name) 
      client.on("user-published", async (currClient, type) => {
        await client.subscribe(currClient, type);
        if (type === "video") {
          setUsers((prior) => {
            return [...prior, currClient];
          });
        }
        if (type === "audio")
         {
          currClient.audioTrack.play();
        }
      });

      /* trigger when a user has muted their mic or camera */  
      client.on("user-unpublished", (currClient, type) => {
        console.log("user-unpublished event")
        if (type === "audio") {
          if (currClient.audioTrack) 
            { 
              currClient.audioTrack.stop();
             console.log("audio stop") 
            } 
        }
        if (type === "video") {
          setUsers((prior) => {
            console.log("stop video")
            return prior.filter((User) => User.uid !== currClient.uid);
          
          });
        }
      });

      client.on("user-left", (currClient) => { console.log("user left event") 
        setUsers((prior) => {  return prior.filter((User) => User.uid !== currClient.uid); });
      });

      try
       {
        await client.join(config.appId, name, config.token, null);
        console.log("*** Joined: " + name + " ***" ) // joined this channel 
      } catch (error) {
        console.log("error");
      }
      setStart(true);
    };
    
    // call when read and track initalized , initalizes with the url stream name. 
    if (ready && tracks) {
      try {
        init(streamName);
      } catch (error) {
        console.log(error);
      }
    }
  }, [streamName, client, ready, tracks]);


  useEffect(() => {
    // Publish tracks only once and after init is completed
    if (start && tracks && !published) {
      client
        .publish(tracks)
        .then(() => setIsPublished(true))
        .catch((error) => console.error("Error publishing tracks:", error));
    }
  }, [client, start, tracks, published]);

  return (
    <Grid container direction="column" style={{ height: "90%" , width:"100%" }}  spacing={1} >
      <Grid item style={{ height: "5%" }}>
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </Grid>
      <Grid item style={{ height: "95%" }}>
        {start && tracks && <Video tracks={tracks} users={users} />}
      </Grid>
    </Grid>
  );
}

