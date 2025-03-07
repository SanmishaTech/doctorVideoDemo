import { useState } from "react";
import Doctors from "./Doctors/Index";

function Home() {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="w-3/5 bg-blue-100 p-6">
        <Doctors onSelectDoctor={setSelectedVideoUrl} />
      </div>
      <div className="w-2/5 bg-green-100 flex items-center justify-center">
        {selectedVideoUrl ? (
          <video src={selectedVideoUrl} controls className="w-full h-full"></video>
        ) : (
          <h1 className="text-3xl font-bold text-green-700">Right Column (40%)</h1>
        )}
      </div>
    </div>
  );
}

export default Home;