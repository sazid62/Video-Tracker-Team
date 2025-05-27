import "./App.css";

// import Video from "./components/Video";
import Video from "./components/vid_player/Video";

function App() {
  const videoSources = {
    "140p": "video/v2.mp4",

    "480p": "video/v1.mp4",
  };
  return (
    <>
      {/* <Video
        video_id={15}
        video_src={videoSources}
        watchIntervalTime={5}
        onTabChange={{
          pause: true,
        }}
      /> */}
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
