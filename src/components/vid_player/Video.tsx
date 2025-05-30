import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { type VideoQuality } from "@vidstack/react";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import React, { useRef, useEffect, useState } from "react";
import Heatmap from "../Heatmap";

import TimeSliderComponent from "./TimeSliderComponent";
import {
  getUniqueWatchTime,
  ResumeLastTimeandAudio,
  setDataToLocalStorageFromAddSegment,
} from "@/modules/utils/VideoComponent";

interface HeatmapProps {
  show?: boolean;
  color?: string;
  height?: number | string;
  className?: string;
  strokeColor?: string;
  gradientId?: string;
}
interface videoProps {
  video_id?: number;
  video_src?: string;
  watchIntervalTime?: number;
  onTabChange?: {
    videoPause: boolean;
  };

  seekForward?: boolean;
  heatMap?: HeatmapProps;
  //added by rabby
  uniqueTimeWatch: boolean;
  volumeRestore: boolean;
  subtitleRestore: boolean;
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
  videoQuality: number;
  selectedAudio: string;
}
export interface myInfoType {
  array: Segment[];
  video_id: number;
  lastWatchedTime: number;
  lastSubtitle: string;
  lastVideoQuality: number;
  lastPlayBackSpeed: number;
  lastVolume: number;
  isMuted: boolean;
  maxWatchPosition: number;
}

function Video({
  video_id = 12,
  video_src = "https://cdn.bitmovin.com/content/assets/sintel/hls/playlist.m3u8",
  watchIntervalTime = 30,
  onTabChange = { videoPause: false },
  seekForward = false,

  heatMap = {
    show: true,
    color: "red",
    height: 100,
    strokeColor: "darkred",
    className: "rounded-lg shadow",
  },
  uniqueTimeWatch = false,
  volumeRestore = false,
  subtitleRestore = false,
}: videoProps) {
  const videoRef = useRef<MediaPlayerInstance>(null);
  // const videoRef = useRef<HTMLVideoElement>(null);
  const previousSubtitleModeRef = useRef("no");
  const previousAudioModeRef = useRef("no");
  const lastWatched = useRef(0);

  const isPlaying = useRef(false);
  const screen_mode = useRef("normal");
  const lastVolume = useRef(1);
  const muteStatus = useRef(false);
  const seekStatus = useRef("noseeked");

  const playBackSpeed = useRef(1);
  const video_Quality = useRef(720);
  const activeTimeOnPageRef = useRef(0);

  const myInfoInitialize = (): myInfoType => {
    const all = JSON.parse(localStorage.getItem("video-editor") || "[]");
    return (
      all.find(
        (item: { video_id: number; array: [] }) => item.video_id === video_id
      ) || {
        array: [],
        video_id: video_id,
        lastWatchedTime: 0,
        lastSubtitle: "no",
        lastVideoQuality: 720,
        lastPlayBackSpeed: 1,
        lastVolume: 1,
        isMuted: false,
        maxWatchPosition: 0,
      }
    );
  };

  const myInfo = useRef<myInfoType>(myInfoInitialize());
  const startWatched = useRef(myInfo.current.lastWatchedTime);

  const addSegment = () => {
    if (startWatched.current >= lastWatched.current) {
      return;
    }

    seekStatus.current = "noseeked";

    if (
      videoRef.current?.state.lastKeyboardAction?.action === "seekForward" ||
      videoRef.current?.state.lastKeyboardAction?.action === "seekBackward"
    ) {
      seekStatus.current = "keyboard";
      videoRef.current.state.lastKeyboardAction.action = "No";
    }

    if (videoRef.current?.state.seeking && seekStatus.current === "noseeked") {
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
          subtitleLanguage: previousSubtitleModeRef.current,
          playBackSpeed: playBackSpeed.current,
          videoQuality: video_Quality.current,
          selectedAudio: previousAudioModeRef.current,
        },
      ],
    };

    console.log("Adding Segment: ", myInfo.current);
    if (subtitleRestore === true) {
      myInfo.current.lastSubtitle = previousSubtitleModeRef.current;
    }
    myInfo.current.lastWatchedTime =
      getCurrentTime() > 0 ? getCurrentTime() : lastWatched.current;
    myInfo.current.lastVideoQuality = video_Quality.current;
    myInfo.current.lastPlayBackSpeed = playBackSpeed.current;
    if (volumeRestore === true) {
      myInfo.current.lastVolume = lastVolume.current;
      myInfo.current.isMuted = muteStatus.current;
    }
    seekStatus.current = "noseeked";

    lastWatched.current = getCurrentTime();
    startWatched.current = getCurrentTime();

    setDataToLocalStorageFromAddSegment(myInfo, video_id);
  };

  const getCurrentTime = (): number => {
    if (videoRef?.current?.currentTime) return videoRef.current.currentTime;
    else return 0;
  };

  const generateHeatmap = () => {
    if (heatMap.show === false) {
      return [];
    }
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
      if (item.start < item.end) {
        freqArray[item.start + 1] += 1;
        freqArray[item.end + 1] += -1;
      }
    });

    for (let i = 1; i < freqArray.length; i++) {
      freqArray[i] += freqArray[i - 1];
    }
    freqArray.pop();

    return freqArray;
  };

  const handlePlay = () => {
    isPlaying.current = true;

    startWatched.current = getCurrentTime();
    lastWatched.current = getCurrentTime();
    if (volumeRestore === true) {
      lastVolume.current = videoRef.current?.volume as number;
      muteStatus.current = videoRef.current?.muted as boolean;
    }
  };

  const handlePause = () => {
    isPlaying.current = false;
    console.log("Video paused at time:", getCurrentTime());

    addSegment();
  };

  const blockSeekingForward = () => {
    if (videoRef.current && seekForward === true) {
      videoRef.current.currentTime =
        getCurrentTime() <= myInfo.current.maxWatchPosition
          ? getCurrentTime()
          : Math.min(lastWatched.current, myInfo.current.maxWatchPosition);
    }
  };

  const handleSeeking = () => {
    console.log("Before seekd user at:  ", lastWatched.current);

    if (
      isPlaying.current &&
      getCurrentTime() > lastWatched.current &&
      lastWatched.current - startWatched.current >= 0
    ) {
      if (seekStatus.current === "noseeked") {
        seekStatus.current = "mouse";
      }

      addSegment();
    }

    blockSeekingForward();
  };

  const handleSeeked = () => {
    blockSeekingForward();
    startWatched.current = getCurrentTime();
    lastWatched.current = getCurrentTime();
  };

  const handleEnded = () => {
    console.log("Video ended at time:", getCurrentTime());
    isPlaying.current = false;
    addSegment();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current?.state.seeking) {
      lastWatched.current = getCurrentTime();
      myInfo.current.maxWatchPosition = Math.max(
        myInfo.current.maxWatchPosition,
        getCurrentTime()
      );

      if (
        Math.abs(lastWatched.current - startWatched.current) >=
        watchIntervalTime
      ) {
        addSegment();
      }
    }
    setHeatMapArray(generateHeatmap());
  };
  const [HeatMapArray, setHeatMapArray] = React.useState<number[]>([]);

  const selectLastVideoQuality = () => {
    const player = videoRef.current;

    const qualitiesArray = player?.qualities.toArray();
    const lastQuality = qualitiesArray?.find(
      (q) => q.height === myInfo.current.lastVideoQuality
    );

    if (lastQuality) {
      lastQuality.selected = true;
      console.log("Selected video last watch quality:", lastQuality);
    } else {
      console.warn("Last video quality not found");
    }
  };
  const selectLastPlayBackSpeed = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = myInfo.current.lastPlayBackSpeed;
    }
  };
  const selectLastVolume = () => {
    if (volumeRestore === false) {
      return;
    }
    if (videoRef.current) {
      videoRef.current.muted = myInfo.current.isMuted;
      videoRef.current.volume = myInfo.current.lastVolume;
    }
  };

  const handleLoadedData = () => {
    selectLastVideoQuality();
    selectLastPlayBackSpeed();
    selectLastVolume();
    ResumeLastTimeandAudio(videoRef, myInfo, previousAudioModeRef);

    startCountingPageStayTime();

    activeTimeOnPageRef.current = parseInt(
      localStorage.getItem("stayTime") || "1"
    );
    setHeatMapArray(generateHeatmap());
  };

  const activeTimeIntervalRef = useRef<NodeJS.Timeout>(undefined);
  const [pageStayTime, setPageStayTime] = useState(0);

  const startCountingPageStayTime = () => {
    if (activeTimeIntervalRef.current)
      clearInterval(activeTimeIntervalRef.current);

    activeTimeIntervalRef.current = setInterval(() => {
      // setActiveTimeOnPage((prev) => prev + 1);
      activeTimeOnPageRef.current += 1;

      setPageStayTime(activeTimeOnPageRef.current);
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
    };
    const handleBeforeUnload = () => {
      addSegment();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (videoRef?.current) {
          console.log(onTabChange);
          if (onTabChange.videoPause) videoRef?.current.pause();
        }
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

    const handleFocus = () => {
      console.log("FOCUS");
      startCountingPageStayTime();
    };

    const handleBlur = () => {
      console.log("HandleBLUR");
      clearInterval(activeTimeIntervalRef.current);
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("enterpictureinpicture", handleEnterPiP);
    document.addEventListener("leavepictureinpicture", handleLeavePiP);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    videoRef?.current?.addEventListener("waiting", handleBuffering);
    videoRef?.current?.addEventListener("stalled", handleNetworkError);

    window.onbeforeunload = handleBeforeUnload;

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
  const handleVolumeChange = () => {
    if (isPlaying.current) {
      addSegment();
    }
    if (volumeRestore === true) {
      lastVolume.current = videoRef.current?.volume as number;
      muteStatus.current = videoRef.current?.muted as boolean;
    }
  };

  const handleRateChange = () => {
    addSegment();
    const rate = videoRef.current?.playbackRate;
    if (rate !== undefined) {
      playBackSpeed.current = rate;
    }
  };

  const handleQualityChange = (quality: VideoQuality | null) => {
    console.log("Quality changed: ", quality);
    addSegment();
    video_Quality.current = quality?.height as number;
  };

  const textTrackRef = useRef("first");
  const handleTextTrackChange = () => {
    if (textTrackRef.current === "first" && subtitleRestore) {
      const textTracks = videoRef?.current?.textTracks || [];
      for (let i = 0; i < textTracks?.length; i++) {
        if (textTracks[i]?.language === myInfo.current.lastSubtitle) {
          textTracks[i].mode = "showing";
        } else {
          textTracks[i].mode = "disabled";
        }
      }
      textTrackRef.current = "second";
    }

    if (isPlaying.current) {
      addSegment();
    }
    const textTrack = videoRef.current?.textTracks || [];
    for (let i = 0; i < textTrack?.length; i++) {
      if (textTrack[i]?.mode === "showing") {
        previousSubtitleModeRef.current =
          textTrack[i]?.language || "not define";
        return;
      }
    }
    previousSubtitleModeRef.current = "no";
  };

  const trackChangingAudio = () => {
    const audiotrack = videoRef.current?.audioTracks || [];
    for (let i = 0; i < audiotrack?.length; i++) {
      if (audiotrack[i]?.selected) {
        previousAudioModeRef.current = audiotrack[i]?.language || "not define";
        return;
      }
    }
    previousAudioModeRef.current = "no";
  };

  const handleonAudioTrackChange = () => {
    if (isPlaying.current) {
      addSegment();
    }
    trackChangingAudio();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6 gap-12 justify-center ml-50 mt-20">
      <div>
        <MediaPlayer
          ref={videoRef}
          src={video_src}
          style={{ width: "1280px", height: "720px" }}
          className="mb-2"
          onQualityChange={handleQualityChange}
          onPlay={handlePlay}
          onVolumeChange={handleVolumeChange}
          onLoadedData={handleLoadedData}
          onRateChange={handleRateChange}
          onPause={handlePause}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          crossOrigin
          playsInline={false}
          onTextTrackChange={handleTextTrackChange}
          onAudioTrackChange={handleonAudioTrackChange}
        >
          <MediaProvider></MediaProvider>
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            slots={{
              timeSlider: (
                <div className="relative w-full group mb-6 h-4">
                  <div className="absolute bottom-full left-0 w-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <Heatmap pv={HeatMapArray} {...heatMap} />
                  </div>
                  <TimeSliderComponent />
                </div>
              ),
            }}
          />
        </MediaPlayer>
      </div>

      <div className="flex flex-col items-start gap-4">
        {uniqueTimeWatch && (
          <div className="text-green-600 text-xl font-semibold">
            {getUniqueWatchTime(uniqueTimeWatch, myInfo)} seconds unique viewed
          </div>
        )}
        <div className=" text-red-600 text-xl font-semibold">
          {pageStayTime} second stayed on this page
        </div>
      </div>
    </div>
  );
}

export default Video;
