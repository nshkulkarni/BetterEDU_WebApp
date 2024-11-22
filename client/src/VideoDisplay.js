import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

export default function Video(props) {
  const { users, tracks } = props;
  const [gridSpacing, setGridSpacing] = useState(12);
  const num = 12 / (users.length + 1);

  // Adjust grid spacing based on the number of users
  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(num), 4));
  }, [num]);

  // Play the local video track
  useEffect(() => {
    if (tracks && tracks[1]) {
      tracks[1].play("local-video");
    }
  }, [tracks]);

  return (
    <Grid
      container
      style={{ height: "100%" }}
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Box style={{ position: "relative" }} />
      <Grid
        item
        xs={gridSpacing}
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ background: "#f0f0", padding: "25px" }}
      >
        {/* Local video */}
        <div
          id="local-video"
          style={{
            height: "100%",
            width: "100%",
            background: "#f0f0",
            padding: "10px",
          }}
        />
      </Grid>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <Grid
                key={user.uid}
                item
                xs={gridSpacing}
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{ background: "#f0f0", padding: "25px" }}
              >
                {/* Remote video */}
                <div
                  id={`remote-video-${user.uid}`}
                  style={{
                    height: "100%",
                    width: "100%",
                    background: "#f0f0",
                    padding: "10px",
                  }}
                  ref={(node) => user.videoTrack && user.videoTrack.play(node)}
                />
              </Grid>
            );
          } else return null;
        })}
    </Grid>
  );
}
