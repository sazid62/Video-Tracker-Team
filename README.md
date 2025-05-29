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

🧠 Credits
👨‍💻 Sajid – Heatmap, Seek Control, Quality Persistence, Tab Pause, Page Time, Playback Resume

👨‍💻 Rabby – Volume, Subtitles, Keyboard/Mouse, Multi-Audio, VidStack Setup

