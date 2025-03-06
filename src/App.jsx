import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import VideoRecorderPage from "./Components/Video/VideoRecorderPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/record/:videoId" element={<VideoRecorderPage />} />
    </Routes>
  );
}

export default App;
