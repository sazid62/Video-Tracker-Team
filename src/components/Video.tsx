import React, { useRef } from "react";

import Heatmap from "./Heatmap";
interface videoProps {
  video_id?: number;
  video_src?: string;
  watchIntervalTime?: number;
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

  const handleBeforeUnload = () => {
    addSegment({
      start: startWatched.current,
      end: lastWatched.current,
      
    });
  };

  window.onbeforeunload = handleBeforeUnload;

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

  const myInfo = useRef<{ array: []; video_id: number }>(myInfoInitialize());

  const getUniqueWatchTime=()=>{
    let end:number=-1;
    const segmentFlooredArray=myInfo.current.array.map((item:{start:number,end:number})=>{
      return {
        start:Math.floor(item.start),
        end:Math.floor(item.end)
      }
    })
    segmentFlooredArray.sort((a:{start:number,end:number},b:{start:number,end:number})=>{
      if(a.start==b.start){
        return b.end-a.end
      }
      return a.start-b.start
    });

    let uniqueWatchTime:number=0;

    segmentFlooredArray.map((item:{start:number,end:number})=>{
      if(end===-1){
        uniqueWatchTime+=(item.end-item.start+1);
        end=item.end+1;
      }
      else{
        if(item.start>end){
          uniqueWatchTime+=(item.end-item.start+1);
          end=item.end+1;
        }
        else{
          uniqueWatchTime+=(Math.max(0,item.end-end+1));
          end=Math.max(end,item.end+1);
        }
      }
    })

    return uniqueWatchTime;
  }

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
    isPlaying.current = true;
    console.log("Video played at time:", getCurrentTime());
    startWatched.current = getCurrentTime();
    lastWatched.current = getCurrentTime();
  };

  const handlePause = () => {
    isPlaying.current = false;
    console.log("Video paused at time:", getCurrentTime());
    addSegment({
      start: startWatched.current,
      end: lastWatched.current,
    });

    startWatched.current = getCurrentTime();
    lastWatched.current = getCurrentTime();
  };

  const handleSeeking = () => {
    console.log("Before seekd user at:  ", lastWatched.current);

    if (
      isPlaying.current &&
      getCurrentTime() > lastWatched.current &&
      lastWatched.current - startWatched.current >= 1
    ) {
      addSegment({
        start: startWatched.current,
        end: lastWatched.current,
      });
    }

    startWatched.current = getCurrentTime();
    lastWatched.current = getCurrentTime();

    console.log("Seeking to time:", getCurrentTime());
  };

  const handleSeeked = () => {
    // isPlaying.current = false;
    console.log("Seeked to time:", getCurrentTime());

    startWatched.current = getCurrentTime();
    lastWatched.current = getCurrentTime();
  };

  const handleEnded = () => {
    console.log("Video ended at time:", getCurrentTime());
    isPlaying.current = false;
    addSegment({
      start: startWatched.current,
      end: lastWatched.current,
    });

    lastWatched.current = getCurrentTime();
    startWatched.current = getCurrentTime();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current?.seeking) {
      lastWatched.current = getCurrentTime();
      // console.log(startWatched.current, lastWatched.current, isPlaying.current);
      if (
        lastWatched.current - startWatched.current >= watchIntervalTime &&
        isPlaying.current
      ) {
        addSegment({
          start: startWatched.current,
          end: lastWatched.current,
        });
        startWatched.current = getCurrentTime() + 1;
      }
    }

    setHeatMapArray(generateHeatmap());
  };
  const [HeatMapArray, setHeatMapArray] = React.useState<number[]>([]);
  const handleLoadedData = () => {
    console.log(videoRef.current?.duration);
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
        className="mb-4"
        ref={videoRef}
        src={video_src}
        controls
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
      <br />
      <br />
      {
        getUniqueWatchTime()
      }
    </div>

    
  );
}

export default Video;
