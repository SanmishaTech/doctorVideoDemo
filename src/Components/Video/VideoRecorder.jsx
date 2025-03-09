import { useState, useRef, useEffect } from "react";
import { apiClient } from "../../api";

function VideoRecorder({ videoId }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  const handleStartRecording = async () => {
    // Call deleteVideo API to delete old video
    try {
      const response = await apiClient.delete(`/deleteVideo/${videoId}`);
      console.log(response.data.message);
    } catch (error) {
      console.error('❌ Error deleting old video:', error);
    }

    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

    mediaRecorderRef.current.start(3000); // Send data every second

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());

    // Stop the timer
    clearInterval(timerRef.current);
    setTimer(0);

    // Display progress message
    setProgressMessage("Processing Video...");

    // Call finishUpload API
    try {
      const response = await apiClient.post(`/finishUpload/${videoId}`);
      console.log(response.data.message);
      setProgressMessage("Video Uploaded.");
    } catch (error) {
      console.error('❌ Error finishing upload:', error);
      setProgressMessage("Error uploading video.");
    }
  };

  useEffect(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        console.log("MediaRecorder stopped, handling remaining chunks...");
        // Handle remaining chunks
        mediaRecorderRef.current.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            // Send remaining video chunk to the server
            const formData = new FormData();
            formData.append('video', event.data, 'video.webm');

            try {
              const response = await apiClient.post(`/upload/${videoId}`, formData);
              console.log(response.data.message);
            } catch (error) {
              console.error('❌ Error uploading remaining video chunk:', error);
            }
          }
        };
      };
    }
  }, [videoId]);

  // Format the timer value as mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
      {isRecording && (
        <div className="mt-4 text-xl font-bold">
          Timer: {formatTime(timer)}
        </div>
      )}
      {progressMessage && (
        <div className="mt-4 text-xl font-bold">
          {progressMessage}
        </div>
      )}
    </div>
  );
}

export default VideoRecorder;