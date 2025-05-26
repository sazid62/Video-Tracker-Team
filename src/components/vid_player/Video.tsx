import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  type MediaQualitiesChangeEvent,
  type MediaQualityChangeEvent,
  type VideoQuality,
} from "@vidstack/react";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  useMediaContext,
  
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import React, { useRef, useEffect } from "react";
import Heatmap from "../Heatmap";
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
  lastSubtitle: string;
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
  const videoRef = useRef<MediaPlayerInstance>(null);
  // const videoRef = useRef<HTMLVideoElement>(null);
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
  const video_Quality = useRef("auto");

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
      (item: {
        video_id: number;
        array: [];
        lastWatchedTime: number;
        lastSubtitle: string;
      }) => item.video_id === video_id
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
    seekStatus.current = "noseeked";
    console.log(
      videoRef.current?.state.lastKeyboardAction,
      "gooooooooooooooooooood"
    );
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
          subtitleLanguage: subtitleRef.current,
          playBackSpeed: playBackSpeed.current,
          videoQuality: video_Quality.current,
        },
      ],
    };

    console.log("Adding Segment: ", myInfo.current);

    if (videoRef.current) {
      console.log(videoRef.current.textTracks, "TEXTTRACKSSSSSSSS");
      const tracks = videoRef.current.textTracks;
      let lastSubtitleLocal = "no";
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].mode === "showing") {
          lastSubtitleLocal = tracks[i].label;
          break;
        }
      }
      myInfo.current.lastSubtitle = lastSubtitleLocal;
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
      const tracks = videoRef.current.state.textTracks;
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

    if (!videoRef.current?.state.seeking) {
      
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
      const tracks = videoRef.current.state.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode =
          tracks[i].label === myInfo.current.lastSubtitle
            ? "showing"
            : "disabled";
      }
    }
    console.log(videoRef.current?.duration);
    setHeatMapArray(generateHeatmap());
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
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (videoRef?.current) {
          console.log(onTabChange);
          if (onTabChange.pause) videoRef?.current.pause();
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

    const handleOnKeyDown = (e: KeyboardEvent) => {
      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        seekStatus.current = "keyboard";
        console.log("Key-pressed");
        console.log("seekStatus test", seekStatus.current);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("enterpictureinpicture", handleEnterPiP);
    document.addEventListener("leavepictureinpicture", handleLeavePiP);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    videoRef?.current?.addEventListener("waiting", handleBuffering);
    videoRef?.current?.addEventListener("stalled", handleNetworkError); 

    window.onbeforeunload = handleBeforeUnload;

    return () => {
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
    lastVolume.current = videoRef.current?.volume as number;
    muteStatus.current = videoRef.current?.muted as boolean;
  };

  const handleRateChange = () => {
    addSegment();
    playBackSpeed.current = videoRef.current?.playbackRate as number;
    // console.log("Rate change", videoRef.current?.playbackRate);
  };

  const handleQualityChange = (quality: VideoQuality | null) => {
    addSegment();
    video_Quality.current = quality?.id || "auto";
  };

  const handleOnLoadedMetaData = () => {
    
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-6 gap-12 justify-center ml-50 mt-20">
      <div>
        <MediaPlayer
          ref={videoRef}
          // src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          // src={video_src[Object.keys(video_src)[0]]}
          style={{ width: "720px", height: "720px" }}
          src={[
            {
              src: "https://files.vidstack.io/sprite-fight/1080p.mp4",
              type: "video/mp4",
              width: 1920,
              height: 1080,
            },
            {
              src: "https://files.vidstack.io/sprite-fight/720p.mp4",
              type: "video/mp4",
              width: 1280,
              height: 720,
            },
            {
              src: "https://files.vidstack.io/sprite-fight/240p.mp4",
              type: "video/mp4",
              width: 320,
              height: 240,
            },
          ]}
          className="mb-2"
          // onKeyDown={(e)=>{console.log("Down")}}

          onQualityChange={handleQualityChange}
          onPlay={handlePlay}
          onVolumeChange={handleVolumeChange}
          onLoadedMetadata={handleOnLoadedMetaData}
          onLoadedData={handleLoadedData}
          onRateChange={handleRateChange}
          onPause={handlePause}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          playsInline={false}
        >
          <MediaProvider>
            ;
            <track
              kind="subtitles"
              src="/subtitles/subtitles-es.vtt"
              srcLang="es"
              label="Spanish Subtitles"
              
            />
            <track
              kind="subtitles"
              src="/subtitles/subtitles-en.vtt"
              srcLang="en"
              label="English Subtitles"
            />
          </MediaProvider>
          <DefaultVideoLayout  icons={defaultLayoutIcons} />
        </MediaPlayer>
        <div className=" " style={{ width: "720px" }}>
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
        <div className="text-gray-800 font-medium">
          {getUniqueWatchTime()} seconds unique viewed by you
        </div>
      </div>
    </div>
  );
}

export default Video;
