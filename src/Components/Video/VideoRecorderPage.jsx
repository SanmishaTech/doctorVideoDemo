import { useParams } from "react-router-dom";
import VideoRecorder from "./VideoRecorder";

function VideoRecorderPage() {
  const { videoId } = useParams();
  return (
    <div className="h-screen flex items-center justify-center">
      <VideoRecorder videoId={videoId} />
    </div>
  );
}

export default VideoRecorderPage;