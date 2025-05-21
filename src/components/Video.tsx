import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import Heatmap from "./Heatmap";
interface videoProps {
  video_id?: number;
}
function Video({ video_id = 12 }: videoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const videoSrc = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  const lastWatched = useRef(0);
  const startWatched = useRef(0);

  const handleBeforeUnload=()=>{
    addSegment({
      start: startWatched.current,
      end: lastWatched.current,
    });
  }

  window.onbeforeunload=handleBeforeUnload;

  const myInfoInitialize = (): {
    array: [];
    video_id: number;
  } => {
    const all = JSON.parse(localStorage.getItem("video-editor") || "[]");
    return (
      all.find(
        (item: { video_id: number; array: [] }) => item.video_id === video_id
      ) || {
        array: [],
        video_id: video_id,
      }
    );
  };

  console.log(myInfoInitialize(), "test");

  const myInfo = useRef<{ array: []; video_id: number }>(myInfoInitialize());

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(videoSrc);
        hlsRef.current.attachMedia(videoRef.current);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest loaded");
          videoRef.current
            ?.play()
            .catch((e) => console.log("Autoplay prevented:", e));
        });
      }
    }

    // Cleanup function
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  const setDataToLocalStorageFromAddSegment = () => {
    const previousPushedData = JSON.parse(
      localStorage.getItem("video-editor") || "[]"
    );

    const index = previousPushedData.findIndex(
      (item: { video_id: number; array: [] }) => item.video_id === video_id
    );
    if (index !== -1) {
      previousPushedData[index] = myInfo.current;
    } else {
      previousPushedData.push(myInfo.current);
    }

    localStorage.setItem("video-editor", JSON.stringify(previousPushedData));
  };

  const addSegment = (segment: { start: number; end: number }) => {
    if (segment.start >= segment.end) {
      return;
    }
    console.log("Adding Segment: ", segment);
    myInfo.current = {
      ...myInfo.current,
      array: [
        ...myInfo.current.array,
        {
          start: segment.start,
          end: segment.end,
        },
      ],
    };
    console.log(myInfo.current);

    setDataToLocalStorageFromAddSegment();
  };

  const getCurrentTime = (): number => {
    if (videoRef?.current?.currentTime) return videoRef.current.currentTime;
    else return 0;
  };

  const generateHeatmap = () => {
    const all = JSON.parse(localStorage.getItem("video-editor") || "[]");
    const allWatcherArray: { start: number; end: number }[] = [];

    all.map((item: { video_id: number; array: [] }) => {
      if (item.video_id === video_id) {
        allWatcherArray.push(...item.array);
      }
    });

    const videoDuration = Math.floor(videoRef?.current?.duration || 0);
    const freqArray = Array(videoDuration + 1).fill(0);

    allWatcherArray.map((item: { start: number; end: number }) => {
      item.start = Math.floor(item.start);
      item.end = Math.floor(item.end);

      freqArray[item.start] += 1;
      freqArray[item.end + 1] += -1;
    });

    for (let i = 1; i < freqArray.length; i++) {
      freqArray[i] += freqArray[i - 1];
    }
    freqArray.pop();

    return freqArray;
  };

  const handlePlay = () => {
    console.log("Video played at time:", getCurrentTime());
    startWatched.current = getCurrentTime();
  };

  const handlePause = () => {
    console.log("Video paused at time:", getCurrentTime());
    addSegment({
      start: startWatched.current,
      end: lastWatched.current,
    });


    startWatched.current = getCurrentTime() + 1;
  };

  const handleSeeking = () => {
    console.log("Before seekd user at:  ", lastWatched.current);

    addSegment({
      start: startWatched.current,
      end: lastWatched.current,
    });

    startWatched.current = getCurrentTime();

    console.log("Seeking to time:", getCurrentTime());
  };

  const handleSeeked = () => {
    console.log("Seeked to time:", getCurrentTime());
  };

  const handleEnded = () => {
    console.log("Video ended at time:", getCurrentTime());
    addSegment({
      start: startWatched.current,
      end: lastWatched.current,
    });
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current?.seeking) {
      lastWatched.current = getCurrentTime();
      if(lastWatched.current-startWatched.current>=5){
        addSegment({
          start: startWatched.current,
          end: lastWatched.current,
        });
        startWatched.current=getCurrentTime()+1;
      }
    }
  };
  const [HeatMapArray, setHeatMapArray] = React.useState<number[]>([]);
  const handleLoadedData = () => {
    setHeatMapArray(generateHeatmap());
  };

  const handleEmptied = () => {
    console.log("Video emptied at time:", getCurrentTime());
  };
  const handleAbort = () => {
    console.log("Video aborted at time:", getCurrentTime());
  };

  return (
    <div>
      <video
        ref={videoRef}
        controls
        width="500"
        onPlay={handlePlay}
        onLoadedData={handleLoadedData}
        onPause={handlePause}
        onSeeking={handleSeeking}
        onSeeked={handleSeeked}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onEmptied={handleEmptied}
        onAbort={handleAbort}
      />
      {HeatMapArray.length > 0 && <Heatmap pv={HeatMapArray} />}
    </div>
  );
}

export default Video;
