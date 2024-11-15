import { useState } from "react";
import { Button } from "@material-ui/core";
import VideoCall from "./VideoChat";

function App() {
  const [inCall, setCall] = useState(false);

  return (
    <div
      className="App"
      style={{
        height: "100vh", // Use viewport height to cover full screen
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Centers horizontally
        alignItems: "center", // Center items horizontally
        paddingTop: "10vh", // Push down from the top
        background: "#28489d"
      }}
    >
      {inCall ? (
        <VideoCall setInCall={setCall} />
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setCall(true)}
        >
          Join
        </Button>
      )}
    </div>
  );
}

export default App;