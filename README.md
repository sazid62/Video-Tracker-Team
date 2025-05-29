# 🎥 Video Analytics


## 🧩 Overview

**Video Analytics** is a feature-rich React-based video component powered by **VidStack** that enables developers to deeply track and analyze user behavior during video playback.


## 🚀 Features

| Feature                        | Description                                                                                                                                           | Status     |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| 🔥 Heatmap                    | Displays view heatmap per segment. Color-coded versions supported. Toggle ON/OFF via props.                                                          | ✅ Done     |
| ▶️ Resume Capabilities        | Resumes video from the last watched position.                                                                                                         | ✅ Done     |
| ⏱️ Unique Watch Time          | Tracks total unique time watched per user.                                                                                                            | ✅ Done     |
| 🕒 Total Watch Time           | Aggregates total watch time across sessions.                                                                                                          | ⏳ In Progress |
| ⏮️ Seek Control              | Prevents forward seeking. Rewind allowed. Configurable via props.                                                                                     | ✅ Done     |
| 🪟 Tab Visibility Control     | Pauses or continues video on tab switch. Fully configurable.                                                                                          | ✅ Done     |
| 📶 Network & Buffer Handling  | Sends real-time network/buffering data to backend.                                                                                                    | ✅ Done     |
| 🖥️ Watch Time by Mode        | Logs time spent in normal, fullscreen, and PiP modes.                                                                                                 | ✅ Done     |
| 🖱️ Keyboard & Mouse Events   | Captures user inputs like key presses and mouse movements.                                                                                            | ✅ Done     |
| 🔊 Volume Tracking            | Stores and restores volume per segment.                                                                                                               | ✅ Done     |
| 📝 Subtitle Segment Analysis  | Analyzes subtitle segments and phrase usage (no resume supported).                                                                                    | ✅ Done     |
| 🌐 Subtitle Toggle & Language | Tracks subtitle ON/OFF and selected language.                                                                                                         | ✅ Done     |
| 🎧 Multi-Audio Support        | Logs start/end times of each audio track.                                                                                                             | ✅ Done     |
| ⏩ Playback Speed Resume      | Resumes video with previously selected speed.                                                                                                         | ✅ Done     |
| 💡 VidStack Integration       | Fully integrated with the powerful VidStack framework.                                                                                                | ✅ Done     |
| 🧍 Page Stay Duration         | Measures how long users stay on the video page (active/idle).                                                                                          | ✅ Done     |
| 📺 Quality Persistence        | Remembers selected video quality (480p, 720p, 1080p) across sessions.                                                                                 | ✅ Done     |
| ⚙️ Feature Toggles            | All major features are toggleable by developer props or UI (WIP).                                                                                      | ⏳ In Progress |

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
| Property      | Type               | Default               | Description               |
| ------------- | ------------------ | --------------------- | ------------------------- |
| `show`        | `boolean`          | `true`                | Toggle heatmap visibility |
| `color`       | `string`           | `"red"`               | Fill color for segments   |
| `height`      | `number \| string` | `100`                 | Height of the heatmap bar |
| `className`   | `string`           | `"rounded-lg shadow"` | Custom CSS classes        |
| `strokeColor` | `string`           | `"darkred"`           | Outline color             |
| `gradientId`  | `string`           | `undefined`           | Custom SVG gradient ID    |


##🧠 Credits
👨‍💻 Sajid – Heatmap, Seek Control, Quality Persistence, Tab Pause, Page Time, Playback Resume

👨‍💻 Rabby – Volume, Subtitles, Keyboard/Mouse, Multi-Audio, VidStack Setup

