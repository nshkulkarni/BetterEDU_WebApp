import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid } from "@material-ui/core";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box"

export default function Video(props) {
  const { users, tracks } = props;
  const [gridSpacing, setGridSpacing] = useState(12);
  const num = 12 / (users.length + 1)
  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(num), 4));
  }, [users, tracks]);

  return (
  
    <Grid container style={{ height: "100%"}}  spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
      <Box style={{ position: "relative" }}></Box>
      <Grid item xs={gridSpacing} display = "flex" justifyContent="center" alignItems="center" size= "grow" style={{background: '#f0f0', padding: '25px'}} >
       
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          style={{ height: "100%", width: "100%" , background:'#f0f0', padding: '10px'}}
          
        />
      </Grid>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
               <Grid item xs={gridSpacing} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} display = "flex" justifyContent="center" alignItems="center" size= "grow" style={{background: '#f0f0', padding: '25px'}} >
                <paper> 
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  style={{ height: "100%", width: "100%" , background:'#f0f0', padding: '10px'}}
                />
                </paper>
              </Grid>
            );
          } else return null;
        })}
    </Grid>
  );
}