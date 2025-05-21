import "./App.css";

import Video from "./components/Video";

function App() {
  return (
    <>
      <Video
        video_id={15}
        video_src={
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
        watchIntervalTime={5}
      />
    </>
  );
}

export default App;
