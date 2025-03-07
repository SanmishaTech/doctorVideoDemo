import { useState, useRef } from "react";
import { apiClient } from "../../api";

function VideoRecorder({ videoId }) {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleStartRecording = async () => {
    // Call deleteVideo API to delete old video
    try {
      const response = await apiClient.delete(`/deleteVideo/${videoId}`);
      console.log(response.data.message);
    } catch (error) {
      console.error('❌ Error deleting old video:', error);
    }

    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        // Send video chunk to the server
        const formData = new FormData();
        formData.append('video', event.data, 'video.webm');

        try {
          const response = await apiClient.post(`/upload/${videoId}`, formData);
          console.log(response.data.message);
        } catch (error) {
          console.error('❌ Error uploading video chunk:', error);
        }
      }
    };

    mediaRecorderRef.current.start(1000); // Send data every second
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());

    // Call finishUpload API
    try {
      const response = await apiClient.post(`/finishUpload/${videoId}`);
      console.log(response.data.message);
    } catch (error) {
      console.error('❌ Error finishing upload:', error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Video Recorder</h2>
      <video ref={videoRef} autoPlay className="w-full h-64 bg-black mb-4"></video>
      <div className="flex gap-4">
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start
        </button>
        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Finish
        </button>
      </div>
    </div>
  );
}

export default VideoRecorder;