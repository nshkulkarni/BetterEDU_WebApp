import {useState} from "react"
import {useClient} from "./configuration"
import {Grid,Button} from"@material-ui/core"
import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"
import VideocamIcon from "@mui/icons-material/Videocam"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"

export default function Controls(props)
{
    const client = useClient(); 
    const {tracks, setStart,setInCall} = props
    const [trackState, setTrackState ] = useState({video:true, audio:true})

    // Mute or disable video
    const disableCamMic = async (type) => {
        if (type === "audio" )
            {
               console.log(tracks)
                await tracks[0].setEnabled(!trackState.audio);
            
                setTrackState( (prior) => 
                    {
                        return {...prior , audio: !prior.audio}
                    })
            }
            else if (type === "video" )
                {
                    console.log("Video off")
                    await tracks[1].setEnabled(!trackState.video);
                    setTrackState( (prior) => 
                        {
                            return {...prior , video: !prior.video}
                        })
                }
    };

    // function to leave channel make sure to close video/audio
    const leaveChat = async () => 
    {
        await client.leave(); 
        tracks[0].close() 
        tracks[1].close()
        client.removeAllListeners() 
        setInCall(false)
        setStart(false)
    };

    return (
        <Grid container spacing ={2} alignItems="center" justifyContent="center" columns={{ xs: 2, sm: 4, md: 6 }} >
            <Grid item> 
            <Button variant="contained"
                 color={trackState.video ? "primary" : "secondary"} 
                  onClick={ () => disableCamMic("video") }
                >
                    {trackState.video ? <VideocamIcon/> : <VideocamOffIcon/>}
                </Button>
            </Grid>
            <Grid item> 
            <Button variant="contained"
                 color="default"
                  onClick={ () => leaveChat() } >
                   Leave Chat 
                   <ExitToAppIcon/>
                </Button>
            </Grid>
            <Grid item> 
                <Button variant="contained"
                 color={trackState.audio ? "primary" : "secondary"} 
                  onClick={ () => disableCamMic("audio") }
                >
                    {trackState.audio ? <MicIcon/> : <MicOffIcon/>}
                </Button>
            </Grid>
        </Grid>

    ); 

}