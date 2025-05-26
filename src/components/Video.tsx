import React, { useCallback, useEffect, useRef, useState } from "react";

import Heatmap from "./Heatmap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface videoProps {
  video_id?: number;
  video_src?: { [key: string]: string };
  watchIntervalTime?: number;
  onTabChange?: {
    pause: boolean;
  };
}

interface Segment {
  start: number;
  end: number;
  screen_mode: string;
  current_volume: number;
  isMuted: boolean;
  seekByMouseOrKey: string;
  subtitleLanguage: string;
  playBackSpeed: number;
  videoQuality: string;
}
interface myInfoType {
  array: Segment[];
  video_id: number;
  lastWatchedTime: number;
  videoQuality: string;
}
function Video({
  video_id = 12,
  video_src = {
    "720p":
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  watchIntervalTime = 30,
  onTabChange = { pause: false },
}: videoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousModeRef = useRef<Record<string, string>>({});
  const lastWatched = useRef(0);
  const startWatched = useRef(0);
  const isPlaying = useRef(false);
  const screen_mode = useRef("normal");
  const lastVolume = useRef(1);
  const muteStatus = useRef(false);
  const seekStatus = useRef("noseeked");
  const subtitleRef = useRef("no");
  const playBackSpeed = useRef(1);
  const quality = useRef(Object.keys(video_src)[0] || "720p");

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

    if (videoRef.current?.seeking && seekStatus.current === "noseeked") {
      seekStatus.current = "mouse";
    }

    myInfo.current = {
      ...myInfo.current,
      array: [
        ...myInfo.current.array,
        {
          start: startWatched.current,
          end: lastWatched.current,
          screen_mode: screen_mode.current,
          current_volume: lastVolume.current,
          isMuted: muteStatus.current,
          seekByMouseOrKey: seekStatus.current,
          subtitleLanguage: subtitleRef.current,
          playBackSpeed: playBackSpeed.current,
          videoQuality: quality.current,
        },
      ],
    };

    console.log("Adding Segment: ", myInfo.current);

    if (videoRef.current) {
      console.log(videoRef.current.textTracks, "TEXTTRACKSSSSSSSS");
    }
    myInfo.current.lastWatchedTime = lastWatched.current;
    startWatched.current = getCurrentTime() + 1;
    lastWatched.current = getCurrentTime() + 1;
    seekStatus.current = "noseeked";
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
    console.log("My current Playing sound is", videoRef.current?.volume);
    startWatched.current =
      startWatched.current !== 0 ? getCurrentTime() + 1 : getCurrentTime();
    lastWatched.current = getCurrentTime();
    lastVolume.current = videoRef.current?.volume as number;
    muteStatus.current = videoRef.current?.muted as boolean;
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
      // console.log("CTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
      if (seekStatus.current === "noseeked") {
        seekStatus.current = "mouse";
      }
      addSegment();
    }

    console.log("Seeking to time:", getCurrentTime());
  };

  const handleSeeked = () => {
    // isPlaying.current = false;
    console.log("Seeked to time:", getCurrentTime());
    console.log("CTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
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

    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const prevMode = previousModeRef.current[track.label];
        if (prevMode !== track.mode) {
          addSegment();
          console.log(
            `Track ${track.label} changed from ${prevMode} to ${track.mode}`
          );
          previousModeRef.current[track.label] = track.mode;

          // Log active subtitle
          const activeTrack = Array.from(tracks).find(
            (t) => t.mode === "showing"
          );
          if (activeTrack) {
            subtitleRef.current = activeTrack.language;
            console.log(`Active subtitle: ${activeTrack.label}`);
          } else {
            subtitleRef.current = "no";
            console.log("No subtitles active");
          }
        }
      }
    }

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

    // setHeatMapArray(generateHeatmap());
  };
  const [HeatMapArray, setHeatMapArray] = React.useState<number[]>([]);
  // const [activeTimeOnPageRef ,  setActiveTimeOnPage] = useState(0);
  const activeTimeOnPageRef = useRef(0);
  const handleLoadedData = () => {
    if (videoRef.current && myInfo.current) {
      quality.current = myInfo.current.videoQuality;
      videoRef.current.currentTime = myInfo.current.lastWatchedTime;

      // setActiveTimeOnPage(parseInt(localStorage.getItem("stayTime") || "1"));
      activeTimeOnPageRef.current = parseInt(
        localStorage.getItem("stayTime") || "1"
      );
    }
    setHeatMapArray(generateHeatmap());
  };
  const activeTimeIntervalRef = useRef<NodeJS.Timeout>(undefined);
  const startCountingPageStayTime = () => {
    if (activeTimeIntervalRef.current)
      clearInterval(activeTimeIntervalRef.current);

    activeTimeIntervalRef.current = setInterval(() => {
      // setActiveTimeOnPage((prev) => prev + 1);
      activeTimeOnPageRef.current += 1;
      // console.log("activeTimeOnPageRef", activeTimeOnPageRef.current);
      localStorage.setItem("stayTime", activeTimeOnPageRef.current.toString());
    }, 1000);
  };
  useEffect(() => {
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
      localStorage.setItem("stayTime", activeTimeOnPageRef.current.toString());
      if (activeTimeIntervalRef.current)
        clearInterval(activeTimeIntervalRef.current);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (videoRef?.current) {
          console.log(onTabChange);
          if (onTabChange.pause) videoRef?.current.pause();
        }
        if (activeTimeIntervalRef.current)
          clearInterval(activeTimeIntervalRef.current);
      } else {
        startCountingPageStayTime();
      }
    };
    const handleBuffering = () => {
      addSegment();
      console.log("Buffering");
    };
    const handleNetworkError = () => {
      addSegment();
      console.log("Network Error");
    };
    const handleLoadedData = () => {
      startCountingPageStayTime();
    };

    const handleFocus = () => {
      console.log("FOCUS");
      startCountingPageStayTime();
    };

    const handleBlur = () => {
      console.log("HandleBLUR");
      clearInterval(activeTimeIntervalRef.current);
    };
    // window.focus = handleFocus;
    // window.blur = handleBlur;
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("enterpictureinpicture", handleEnterPiP);
    document.addEventListener("leavepictureinpicture", handleLeavePiP);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    videoRef?.current?.addEventListener("waiting", handleBuffering);
    videoRef?.current?.addEventListener("stalled", handleNetworkError);

    window.onbeforeunload = handleBeforeUnload;
    window.onload = handleLoadedData;

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      videoRef?.current?.removeEventListener("waiting", handleBuffering);
      videoRef?.current?.removeEventListener("stalled", handleNetworkError);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("enterpictureinpicture", handleEnterPiP);
      document.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);

  console.log("Relaod");
  const handleVolumeChange = () => {
    if (isPlaying.current) {
      addSegment();
    }
    lastVolume.current = videoRef.current?.volume as number;
    muteStatus.current = videoRef.current?.muted as boolean;
  };
  const handleOnKeyDown = (e: KeyboardEvent) => {
    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      seekStatus.current = "keyboard";
      console.log("Key-pressed");
      console.log("seekStatus test", seekStatus.current);
    }
  };

  if (videoRef.current) {
    videoRef.current.onkeydown = handleOnKeyDown;
  }

  const handleRateChange = () => {
    addSegment();
    playBackSpeed.current = videoRef.current?.playbackRate as number;
    // console.log("Rate change", videoRef.current?.playbackRate);
  };

  const handleQualityChange = (selectedQuality: string) => {
    console.log(selectedQuality, "selectedQuality");

    if (videoRef.current) {
      addSegment();

      const currentTime = videoRef.current.currentTime;
      const isPlaying = !videoRef.current.paused;

      videoRef.current.src = video_src[selectedQuality];

      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (isPlaying) {
            videoRef.current.play();
          }
        }
      };

      quality.current = selectedQuality;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6 gap-12 justify-center ml-50 mt-20">
      <div className="flex flex-col items-center gap-4">
        <video
          style={{ width: "640px", height: "360px" }}
          className="mb-2"
          ref={videoRef}
          src={video_src[Object.keys(video_src)[0]]}
          controls
          onPlay={handlePlay}
          onVolumeChange={handleVolumeChange}
          onLoadedData={handleLoadedData}
          onRateChange={handleRateChange}
          onPause={handlePause}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
        >
          <track
            kind="subtitles"
            src="/subtitles/subtitles-en.vtt"
            srcLang="en"
            label="English Subtitles"
          />
          <track
            kind="subtitles"
            src="/subtitles/subtitles-es.vtt"
            srcLang="es"
            label="Spanish Subtitles"
          />
        </video>

        {/* Heatmap Under Video */}
        <div className="w-[640px]">
          {HeatMapArray.length > 0 ? (
            <Heatmap pv={HeatMapArray} />
          ) : (
            <div className="h-20 bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
              No heatmap data
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4">
        <Select
          onValueChange={handleQualityChange}
          defaultValue={quality.current}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Video quality" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(video_src).map((quality) => (
              <SelectItem key={quality} value={quality}>
                {quality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-blue-800 font-medium">
          {getUniqueWatchTime()} seconds unique viewed by you
        </div>
        <div className="text-red-800 font-medium">
          {activeTimeOnPageRef.current} seconds active on this page
        </div>
      </div>
    </div>
  );
}

export default Video;
