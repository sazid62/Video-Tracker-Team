import "./App.css";

import Video from "./components/Video";

function App() {
  const videoSources = {
    "140p": "video/BigBuckBunny_140p.mp4",
    "480p": "video/BigBuckBunny_480p.mp4",
    "720p": "video/BigBuckBunny_720p.mp4",
    "1080p": "video/BigBuckBunny_1080p.mp4",
  };
  return (
    <>
      <Video
        video_id={15}
        video_src={videoSources}
        watchIntervalTime={5}
        onTabChange={{
          pause: true,
        }}
      />
    </>
  );
}

export default App;
