import { useState, useRef } from "react";
import Doctors from "./Doctors/Index";

function Home() {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const videoRef = useRef(null);

  const handleDownload = () => {
    // Convert Cloudinary video URL to MP4 format
    const mp4Url = selectedVideoUrl.replace(/(\/v\d+\/)(.*)(\.\w+)$/, '$1$2.mp4');
    
    // Open the MP4 URL in a new tab
    window.open(mp4Url, '_blank');
  };

  return (
    <div className="flex h-screen">
      <div className="w-3/5 bg-blue-100 p-6">
        <Doctors onSelectDoctor={setSelectedVideoUrl} />
      </div>
      <div className="w-2/5 bg-green-100 flex flex-col items-center justify-center">
        {selectedVideoUrl ? (
          <>
            <video ref={videoRef} src={selectedVideoUrl} controls className="w-full h-full"></video>
            <button onClick={handleDownload} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Download</button>
          </>
        ) : (
          <h1 className="text-3xl font-bold text-green-700">Right Column (40%)</h1>
        )}
      </div>
    </div>
  );
}

export default Home;