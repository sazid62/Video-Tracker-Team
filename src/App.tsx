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
        video_src={
          "https://cdn.bitmovin.com/content/assets/sintel/hls/playlist.m3u8"
        }
        watchIntervalTime={5}
        seekForward={false}
        onTabChange={{
          videoPause: true,
        }}
        heatMap={{
          show: true,
          color: "#8884d8",
          height: 48,
          className: "",
          strokeColor: "#8884d8",
          gradientId: "colorUv",
        }}
        uniqueTimeWatch={true}
        volumeRestore={true}
        subtitleRestore={true}
      />
    </>
  );
}

export default App;
