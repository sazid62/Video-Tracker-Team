

export const setDataToLocalStorageFromAddSegment = (myInfo:any,video_id:number) => {
    const previousPushedData = JSON.parse(
      localStorage.getItem("video-editor") || "[]"
    );

    const index = previousPushedData.findIndex(
      (item: { video_id: number; array: [];lastWatchedTime:number }) => item.video_id === video_id
    );
    if (index !== -1) {
      previousPushedData[index] = myInfo;
    } else {
      previousPushedData.push(myInfo);
    }

    localStorage.setItem("video-editor", JSON.stringify(previousPushedData));
  };