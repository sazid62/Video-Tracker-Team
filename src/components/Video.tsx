import React, { useEffect, useRef } from "react";

import Heatmap from "./Heatmap";
interface videoProps {
  video_id?: number;
  video_src?: string;
  watchIntervalTime?: number;
}
interface myInfoType {
  array: [];
  video_id: number;
  lastWatchedTime: number;
}
function Video({
  video_id = 12,
  video_src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  watchIntervalTime = 30,
}: videoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const lastWatched = useRef(0);
  const startWatched = useRef(0);
  const isPlaying = useRef(false);
  const screen_mode = useRef("normal");
  const lastVolume=useRef(1);
  const muteStatus=useRef(false);

  

  const myInfoInitialize = (): myInfoType => {
    const all = JSON.parse(localStorage.getItem("video-editor") || "[]");
    return (
      all.find(
        (item: { video_id: number; array: [] }) => item.video_id === video_id
      ) || {
        array: [],
        video_id: video_id,
        lastWatchedTime: 0,
      }
    );
  };

  const myInfo = useRef<myInfoType>(myInfoInitialize());

  const getUniqueWatchTime = () => {
    let end: number = -1;
    const segmentFlooredArray = myInfo.current.array.map(
      (item: { start: number; end: number }) => {
        return {
          start: Math.floor(item.start),
          end: Math.floor(item.end),
        };
      }
    );
    segmentFlooredArray.sort(
      (
        a: { start: number; end: number },
        b: { start: number; end: number }
      ) => {
        if (a.start == b.start) {
          return b.end - a.end;
        }
        return a.start - b.start;
      }
    );

    let uniqueWatchTime: number = 0;

    segmentFlooredArray.map((item: { start: number; end: number }) => {
      if (end === -1) {
        if (item.start === 0) {
          uniqueWatchTime--;
        }
        uniqueWatchTime += item.end - item.start + 1;
        end = item.end + 1;
      } else {
        if (item.start > end) {
          uniqueWatchTime += item.end - item.start + 1;
          end = item.end + 1;
        } else {
          uniqueWatchTime += Math.max(0, item.end - end + 1);
          end = Math.max(end, item.end + 1);
        }
      }
    });

    return uniqueWatchTime;
  };

  const setDataToLocalStorageFromAddSegment = () => {
    const previousPushedData = JSON.parse(
      localStorage.getItem("video-editor") || "[]"
    );

    const index = previousPushedData.findIndex(
      (item: { video_id: number; array: []; lastWatchedTime: number }) =>
        item.video_id === video_id
    );
    if (index !== -1) {
      previousPushedData[index] = myInfo.current;
    } else {
      previousPushedData.push(myInfo.current);
    }

    localStorage.setItem("video-editor", JSON.stringify(previousPushedData));
  };

  const addSegment = () => {
    if (startWatched.current >= lastWatched.current) {
      return;
    }
    console.log("Adding Segment: ", {
      start: startWatched.current,
      end: lastWatched.current,
      screen_mode: screen_mode.current,
    });

    myInfo.current = {
      ...myInfo.current,
      array: [
        ...myInfo.current.array,
        {
          start: startWatched.current,
          end: lastWatched.current,
          screen_mode: screen_mode.current,
          current_volume:lastVolume.current,
          isMuted:muteStatus.current
        },
      ],
    };
    myInfo.current.lastWatchedTime = lastWatched.current;
    startWatched.current = getCurrentTime() + 1;
    lastWatched.current = getCurrentTime() + 1;
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
    isPlaying.current = true;
    console.log("Video played at time:", getCurrentTime());
    console.log("My current Playing sound is",videoRef.current?.volume)
    startWatched.current =
      startWatched.current !== 0 ? getCurrentTime() + 1 : getCurrentTime();
    lastWatched.current = getCurrentTime();
    lastVolume.current=videoRef.current?.volume as number
    muteStatus.current=videoRef.current?.muted as boolean
  };

  const handlePause = () => {
    isPlaying.current = false;
    console.log("Video paused at time:", getCurrentTime());
    addSegment();
  };

  const handleSeeking = () => {
    console.log("Before seekd user at:  ", lastWatched.current);

    if (
      isPlaying.current &&
      getCurrentTime() > lastWatched.current &&
      lastWatched.current - startWatched.current >= 1
    ) {
      addSegment();
    }

    console.log("Seeking to time:", getCurrentTime());
  };

  const handleSeeked = () => {
    // isPlaying.current = false;
    console.log("Seeked to time:", getCurrentTime());

    startWatched.current = getCurrentTime() + 1;
    lastWatched.current = getCurrentTime() + 1;
  };

  const handleEnded = () => {
    console.log("Video ended at time:", getCurrentTime());
    isPlaying.current = false;
    addSegment();
  };

  const handleTimeUpdate = () => {
    // console.log(screen_mode.current);
    if (!videoRef.current?.seeking) {
      lastWatched.current = getCurrentTime();
      // console.log(startWatched.current, lastWatched.current, isPlaying.current);
      if (
        lastWatched.current - startWatched.current >= watchIntervalTime &&
        isPlaying.current
      ) {
        addSegment();
      }
    }

    setHeatMapArray(generateHeatmap());
  };
  const [HeatMapArray, setHeatMapArray] = React.useState<number[]>([]);
  const handleLoadedData = () => {
    if (videoRef.current && myInfo.current) {
      videoRef.current.currentTime = myInfo.current.lastWatchedTime;
    }
    console.log(videoRef.current?.duration);
    setHeatMapArray(generateHeatmap());
  };

  useEffect(() => {
    console.log("Dukese");
    const handleFullScreenChange = () => {
      addSegment();
      console.log(document.fullscreenElement, "FullScreenElemt");
      screen_mode.current = document.fullscreenElement
        ? "fullscreen"
        : "normal";
      console.log(screen_mode.current, getCurrentTime());
    };

    const handleEnterPiP = () => {
      addSegment();
      console.log("PIP mode ON");
      screen_mode.current = "pip";
    };

    const handleLeavePiP = () => {
      addSegment();
      console.log("PIP mode OFF");
      screen_mode.current = document.fullscreenElement
        ? "fullscreen"
        : "normal";

      console.log(screen_mode.current, "Set Screen Mode");
    };
    const handleBeforeUnload = () => {
      addSegment();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (videoRef?.current) videoRef?.current.pause();
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("enterpictureinpicture", handleEnterPiP);
    document.addEventListener("leavepictureinpicture", handleLeavePiP);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.onbeforeunload = handleBeforeUnload;

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("enterpictureinpicture", handleEnterPiP);
      document.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);
  const handleVolumeChange=()=>{
    if(isPlaying.current){
      addSegment()
    }
    lastVolume.current=videoRef.current?.volume as number
    muteStatus.current=videoRef.current?.muted as boolean
  }

  return (
    <div>
      <video
        className="mb-4"
        ref={videoRef}
        src={video_src}
        controls
        onPlay={handlePlay}
        onVolumeChange={handleVolumeChange}
        onLoadedData={handleLoadedData}
        onPause={handlePause}
        onSeeking={handleSeeking}
        onSeeked={handleSeeked}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      />
      {HeatMapArray.length > 0 && <Heatmap pv={HeatMapArray} />}
      <br />
      <br />
      {getUniqueWatchTime()}
      {`   seconds unique Viewed by you`}
    </div>
  );
}

export default Video;
