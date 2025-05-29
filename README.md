# 🎥 Video Analytics

## 🧩 Overview

**Video Analytics** is a feature-rich React-based video component powered by **VidStack** that enables developers to deeply track and analyze user behavior during video playback.

## 🚀 Features

| Feature                       | Description                                                                                 | Status  |
| ----------------------------- | ------------------------------------------------------------------------------------------- | ------- |
| 🔥 Heatmap                    | Displays view heatmap per segment. Color-coded versions supported. Toggle ON/OFF via props. | ✅ Done |
| ▶️ Resume Capabilities        | Resumes video from the last watched position.                                               | ✅ Done |
| ⏱️ Unique Watch Time          | Tracks total unique time watched per user.                                                  | ✅ Done |
| 🕒 Total Watch Time           | Aggregates total watch time across sessions.                                                | ✅ Done |
| ⏮️ Seek Control               | Prevents forward seeking. Rewind allowed. Configurable via props.                           | ✅ Done |
| 🪟 Tab Visibility Control     | Pauses or continues video on tab switch. Fully configurable.                                | ✅ Done |
| 📶 Network & Buffer Handling  | Sends real-time network/buffering data to backend.                                          | ✅ Done |
| 🖥️ Watch Time by Mode         | Logs time spent in normal, fullscreen, and PiP modes.                                       | ✅ Done |
| 🖱️ Keyboard & Mouse Events    | Captures user inputs like key presses and mouse movements.                                  | ✅ Done |
| 🔊 Volume Tracking            | Stores and restores volume per segment.                                                     | ✅ Done |
| 📝 Subtitle Segment Analysis  | Analyzes subtitle segments and phrase usage (no resume supported).                          | ✅ Done |
| 🌐 Subtitle Toggle & Language | Tracks subtitle ON/OFF and selected language.                                               | ✅ Done |
| 🎧 Multi-Audio Support        | Logs start/end times of each audio track.                                                   | ✅ Done |
| ⏩ Playback Speed Resume      | Resumes video with previously selected speed.                                               | ✅ Done |
| 💡 VidStack Integration       | Fully integrated with the powerful VidStack framework.                                      | ✅ Done |
| 🧍 Page Stay Duration         | Measures how long users stay on the video page (active/idle).                               | ✅ Done |
| 📺 Quality Persistence        | Remembers selected video quality (480p, 720p, 1080p) across sessions.                       | ✅ Done |
| ⚙️ Feature Toggles            | All major features are toggleable by developer props or UI (WIP).                           | ✅ Done |

---

## 📦 Tech Stack

- **Framework**: React + Vite
- **Player SDK**: [VidStack](https://vidstack.io/)
- **Charts**: Recharts
- **UI Libraries**: Radix UI, Lucide Icons
- **Styling**: Tailwind CSS, tailwind-merge
- **Video Streaming**: HLS.js

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/sazid62/Video-Tracker-Team.git
cd Video-Tracker-Team

# Install dependencies
npm install
npm run dev

```

## 🚀 Example Usage

```bash
import Video from "./components/vid_player/Video";

function App() {
  return (
    <Video
      video_id={15}
      video_src="https://cdn.bitmovin.com/content/assets/sintel/hls/playlist.m3u8"
      watchIntervalTime={5}
      seekForward={false}
      onTabChange={{ videoPause: true }}
      heatMap={{
        show: true,
        color: "#8884d8",
        height: 48,
        className: "custom-style",
        strokeColor: "#8884d8",
        gradientId: "colorUv",
      }}
      uniqueTimeWatch={true}
      volumeRestore={true}
      subtitleRestore={true}
    />
  );
}
```

## 🧩 Props Documentation of video component

| Prop                | Type                      | Default     | Description                                         |
| ------------------- | ------------------------- | ----------- | --------------------------------------------------- |
| `video_id`          | `number`                  | `12`        | Unique identifier for the video session             |
| `video_src`         | `string` (required)       | —           | URL to the video file (supports `.m3u8`, MP4, etc.) |
| `watchIntervalTime` | `number`                  | `30`        | Interval in seconds to send watch data to backend   |
| `onTabChange`       | `{ videoPause: boolean }` | `{ false }` | Pause video when tab loses focus                    |
| `seekForward`       | `boolean`                 | `false`     | Prevent skipping ahead unless already watched       |
| `heatMap`           | `object`                  | See below   | Display heatmap of watched video segments           |
| `uniqueTimeWatch`   | `boolean`                 | `false`     | Count only unique watch times (exclude overlaps)    |
| `volumeRestore`     | `boolean`                 | `false`     | Restore previous volume setting on resume           |
| `subtitleRestore`   | `boolean`                 | `false`     | Restore last used subtitle language                 |

🔥 HeatMap Props
| Property | Type | Default | Description |
| ------------- | ------------------ | --------------------- | ------------------------- |
| `show` | `boolean` | `true` | Toggle heatmap visibility |
| `color` | `string` | `"red"` | Fill color for segments |
| `height` | `number \| string` | `100` | Height of the heatmap bar |
| `className` | `string` | `"rounded-lg shadow"` | Custom CSS classes |
| `strokeColor` | `string` | `"darkred"` | Outline color |
| `gradientId` | `string` | `undefined` | Custom SVG gradient ID |

## Heatmap :

First Create Component Heatmap.tsx

```bash
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface HeatmapProps {
  pv: number[];
  show?: boolean;
  color?: string;
  height?: number | string;
  className?: string;
  strokeColor?: string;
  gradientId?: string;
}

export default function Heatmap({
  pv,
  show = true,
  color = "#8884d8",
  height = 48,
  className = "",
  strokeColor = "#8884d8",
  gradientId = "colorUv",
}: HeatmapProps) {
  if (!show) return null;

  const data = pv.map((val, i) => ({ name: i, views: val }));

  return (
    <div
      className={` ${className}`}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="views"
            stroke={strokeColor}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

Now In your Component

```bash
import React, { useState, useRef } from "react";
import Heatmap from "./Heatmap";


interface WatchSegment {
  start: number;
  end: number;
}

export default function VideoWithHeatmap() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [heatMapData, setHeatMapData] = useState<number[]>([]);

  // Example watch data (replace with your actual logic)
  const allWatcherSegments: WatchSegment[] = [
    { start: 1, end: 3 },
    { start: 2, end: 4 },
    // ... more segments
  ];

  const generateHeatmap = (): number[] => {
    const videoDuration = Math.floor(videoRef.current?.duration || 0);
    const freqArray = new Array(videoDuration + 1).fill(0);

    console.log("[Heatmap] Generating heatmap for video duration:", videoDuration);

    allWatcherSegments.forEach(({ start, end }) => {
      const s = Math.floor(start);
      const e = Math.floor(end);
      if (s < e) {
        freqArray[s + 1] += 1;
        freqArray[e + 1] -= 1;
        console.log(`[Heatmap] Segment: ${s + 1} to ${e} => +1 at ${s + 1}, -1 at ${e + 1}`);
      }
    });

    for (let i = 1; i < freqArray.length; i++) {
      freqArray[i] += freqArray[i - 1];
    }
    freqArray.pop(); // remove the last extra element

    console.log("[Heatmap] Final Frequency Array:", freqArray);
    return freqArray;
  };

  const handleLoadedData = () => {
    console.log("[MediaPlayer] Video data loaded");
    const heatmap = generateHeatmap();
    setHeatMapData(heatmap);
  };

  return (
    <>
      <MediaPlayer ref={videoRef} onLoadedData={handleLoadedData} />
      <Heatmap pv={heatMapData} />
    </>
  );
}


```

## Add Segment Function: Instantly Store Current Watch Segment of user to LoaclHost

```bash
const addSegment = () => {
    if (startWatched.current >= lastWatched.current) {
      return; //Skip Invalid segment Like {start: 12s , end: 5s}
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

   //New Segment Start
    lastWatched.current = getCurrentTime();
    startWatched.current = getCurrentTime();

    setDataToLocalStorageFromAddSegment(); //Instantly send data to backend / LocalStorage
  };

```

## User Start with last watched time

For this work i saved the last watch time in local storage for now(lastWatchedTime).

When user back in this video and video component render and video is loaded to (onLoadedData event).
I set player.currentTime=lastWatchedTime.
```
const handleLoadedData=()=>{
  videoRef.current.currentTime = myInfo.current.lastWatchedTime;
}

<MediaPlayer onLoadedData={handleLoadedData}></MediaPlayer>;
```

## Resume Video Quality from Last Watched

```bash
const selectLastVideoQuality = () => {
  const player = videoRef.current;
  const qualitiesArray = player?.qualities?.toArray();

  const lastQuality = qualitiesArray?.find(
    (q) => q.height === myInfo.current.lastVideoQuality
  );

  if (lastQuality) {
    lastQuality.selected = true;
    console.log(`[Quality] Resuming last watched quality: ${lastQuality.height}p`);
  } else {
    console.warn("[Quality] Last watched video quality not found");
  }
};

const handleLoadedData = () => {
  console.log("[Player] Video loaded. Selecting last watched quality...");
  selectLastVideoQuality();
};

const handleQualityChange = (quality: VideoQuality | null) => {
  if (quality) {
    video_Quality.current = quality.height;
    console.log(`[Quality] Changed to: ${quality.height}p`);
  }
};

// Usage in component
<MediaPlayer
  onQualityChange={handleQualityChange}
  onLoadedData={handleLoadedData}
/>

```

## Watcher Active Time on Page

```bash
const activeTimeIntervalRef = useRef<NodeJS.Timeout>();
const [pageStayTime, setPageStayTime] = useState(0);

const startCountingPageStayTime = () => {
  if (activeTimeIntervalRef.current)
    clearInterval(activeTimeIntervalRef.current);

  activeTimeIntervalRef.current = setInterval(() => {
    activeTimeOnPageRef.current += 1;
    setPageStayTime(activeTimeOnPageRef.current);
    localStorage.setItem("stayTime", activeTimeOnPageRef.current.toString());
    console.log(`[Page Stay] Active time on page: ${activeTimeOnPageRef.current}s`);
  }, 1000);
};

  const handleLoadedData = () => {
    console.log("[Player] Video data loaded. Starting active time counter...");
    startCountingPageStayTime();
  };


useEffect(() => {

  const handleFocus = () => {
    console.log("[Window] Focus regained. Resuming active time counter...");
    startCountingPageStayTime();
  };

  const handleBlur = () => {
    console.log("[Window] Focus lost. Pausing active time counter...");
    clearInterval(activeTimeIntervalRef.current);
  };

  window.addEventListener("focus", handleFocus);
  window.addEventListener("blur", handleBlur);


  return () => {
    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("blur", handleBlur);
  };
}, []);

<MediaPlayer onLoadedData={handleLoadedData} />

```

## subtitle change detect and retrive last subtitle enabled in a video

onTextTrackChange is called when subtitle changed.

```bash
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

  const textTrack = videoRef.current?.textTracks || [];
  for (let i = 0; i < textTrack?.length; i++) {
    if (textTrack[i]?.mode === "showing") {
      previousSubtitleModeRef.current = textTrack[i]?.language || "not define";
      return;
    }
  }
  previousSubtitleModeRef.current = "no";
};

```



## Volume change detect and retrive last volume

When volume is changed onVolumeChange is called
For volume change two state need to track volume and mute.
I used lastVolume and muteStatus for this.
Update volume and mute variable when volume change event trigger.
```
const selectLastVolume = () => {
  if (volumeRestore === false) {
    return;
  }
  if (videoRef.current) {
    videoRef.current.muted = myInfo.current.isMuted;
    videoRef.current.volume = myInfo.current.lastVolume;
  }
};

```


## keyboard/ mouse seek

When seeked with video played it was by mouse of keyboard.
If "is video seeked by keyboard" statement true then seeked by keyboard otherwise seeked by mouse.

```
const addSegment = () => {
  ...
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
  ...
};
    
```

## multiaudio change

When audio change onAudioTrackChange is triggered.

```
const handleonAudioTrackChange = () => {
  const audiotrack = videoRef.current?.audioTracks || [];
  for (let i = 0; i < audiotrack?.length; i++) {
    if (audiotrack[i]?.selected) {
      previousAudioModeRef.current = audiotrack[i]?.language || "not define";
      return;
    }
  }
  previousAudioModeRef.current = "no";
};
<MediaPlayer onAudioTrackChange={handleonAudioTrackChange}></MediaPlayer>;


```

## Unique time watched by a user calculation

I wrote a function named getUniqueWatchTime that calculate unique time.
Start and end time is floored and sorted in start in ascending order and end in descending order.
Then for first value a new variable end is set.
Then for next values if item.start > end then full segment is added else segment after end is added in answer

```
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
    (a: { start: number; end: number }, b: { start: number; end: number }) => {
      if (a.start == b.start) {
        return b.end - a.end;
      }
      return a.start - b.start;
    }
  );

  let uniqueWatchTime: number = 0;

  segmentFlooredArray.map((item: { start: number; end: number }) => {
    if (end === -1) {
      uniqueWatchTime += item.end - item.start;
      end = item.end;
    } else {
      if (item.start > end) {
        uniqueWatchTime += item.end - item.start;
        end = item.end;
      } else {
        uniqueWatchTime += Math.max(0, item.end - end);
        end = Math.max(end, item.end);
      }
    }
  });

  return uniqueWatchTime;
};

```

## 🧠 Credits

👨‍💻 Sajid – Heatmap, Seek Control, Quality Persistence, Tab Pause or Network Issue, Page Time, Playback Speed, Screen Mode,

👨‍💻 Rabby – Volume, Subtitles With Last left selection, Keyboard /Mouse Seek, Multi-Audio, Playback Resume,Unique Time
