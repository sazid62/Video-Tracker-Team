# 🎥 Video Component

A customizable and feature-rich video player component using [`@vidstack/react`](https://www.vidstack.io/). This component supports various functionalities like heatmaps, tab-switch pause, playback tracking, and volume/subtitle restoration.

---

## 🚀 Example Usage

```jsx
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

---

## 🧩 Props Documentation

### `video_id` (optional)
- **Type:** `number`
- **Default:** `12`
- Unique identifier for the video session.

---

### `video_src` (required)
- **Type:** `string`
- Video file or streaming playlist (e.g., HLS `.m3u8`).

---

### `watchIntervalTime` (optional)
- **Type:** `number`
- **Default:** `30`
- Time interval (in seconds) for logging watch progress or analytics.

---

### `onTabChange` (optional)
- **Type:** `{ videoPause: boolean }`
- **Default:** `{ videoPause: false }`
- If `videoPause` is `true`, the video pauses when the tab/window loses focus.

---

### `seekForward` (optional)
- **Type:** `boolean`
- **Default:** `false`
- Set to `false` to prevent users from skipping ahead.

---

### `heatMap` (optional)
Customize the heatmap that shows watched segments of the video.

#### Example:
```jsx
heatMap={{
  show: true,
  color: "#8884d8",
  height: 48,
  className: "custom-style",
  strokeColor: "#8884d8",
  gradientId: "colorUv",
}}
```

#### Properties:
| Property       | Type             | Default          | Description                                |
|----------------|------------------|------------------|--------------------------------------------|
| `show`         | `boolean`        | `true`           | Enable/disable the heatmap bar             |
| `color`        | `string`         | `"red"`          | Fill color of segments                     |
| `height`       | `number|string`  | `100`            | Height of the heatmap bar                  |
| `className`    | `string`         | `"rounded-lg shadow"` | Additional class styling              |
| `strokeColor`  | `string`         | `"darkred"`      | Outline color for segments                 |
| `gradientId`   | `string`         | `undefined`      | SVG gradient ID                            |

---

### `uniqueTimeWatch` (optional)
- **Type:** `boolean`
- **Default:** `false`
- If `true`, only unique watched times are counted (no duplication).

---

### `volumeRestore` (optional)
- **Type:** `boolean`
- **Default:** `false`
- Remembers and restores the last volume level on reload.

---

### `subtitleRestore` (optional)
- **Type:** `boolean`
- **Default:** `false`
- Remembers and restores the last selected subtitle language.

---

## 📦 Installation

Install dependencies:
```bash
npm install @vidstack/react
```

Make sure you include the default styles:
```jsx
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
```

---

## 🛠 Development Note

This player is designed with flexibility and reusability in mind. All features are **optional and toggled via props**, making integration easy and declarative.

---

## 📄 License

MIT
