import { useState, useRef, useEffect } from 'react';

export default function VideoPlayerWithSeekTracking() {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeBeforeSeeking, setTimeBeforeSeeking] = useState(null);
  const [timeAfterSeeking, setTimeAfterSeeking] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekHistory, setSeekHistory] = useState([]);


  const handleSeeking = () => {
    // If we're not already seeking, store the time before seeking began
    
      setTimeBeforeSeeking(currentTime);
      
    
  };

  const handleSeeked = () => {
    setTimeAfterSeeking(currentTime);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  // Track seeking events and store before/after positions
  

  return (
    <div className="flex flex-col items-center p-4">
      <video
        ref={videoRef}
        onSeeked={handleSeeked}
        onSeeking={handleSeeking}
        onTimeUpdate={handleTimeUpdate}
        width="620"
        controls
        poster="https://upload.wikimedia.org/wikipedia/commons/e/e8/Elephants_Dream_s5_both.jpg"
      >
        <source
          src="https://archive.org/download/ElephantsDream/ed_hd.avi"
          type="video/avi"
        />
        <source
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
          type="video/mp4"
        />
        Sorry, your browser doesn't support embedded videos, but don't worry,
        you can
        <a
          href="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
          download="ed_1024_512kb.mp4"
        >
          download the MP4
        </a>
        and watch it with your favorite video player!
      </video>
      <br />
      <br />
      
      <br />
      <br />
      
      
      
    </div>
  );
}