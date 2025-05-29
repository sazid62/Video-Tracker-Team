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

```
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

## subtitle change detect and retrive last subtitle enabled in a video

onTextTrackChange is called when subtitle changed.

```
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
