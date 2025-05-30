
import type { myInfoType } from "@/components/vid_player/Video";
import type { RefObject } from "react";
export const setDataToLocalStorageFromAddSegment = (myInfo:RefObject<myInfoType>,video_id:number) => {
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


  export const getUniqueWatchTime = (uniqueTimeWatch:boolean,myInfo:RefObject<myInfoType>) => {
    if (uniqueTimeWatch === false) {
      return -1;
    }
    let end: number = -1;
    const segmentFlooredArray = myInfo?.current?.array.map(
      (item: { start: number; end: number }) => {
        return {
          start: Math.floor(item.start),
          end: Math.floor(item.end),
        };
      }
    );
    segmentFlooredArray?.sort(
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

    segmentFlooredArray?.map((item: { start: number; end: number }) => {
      if (end === -1) {
        
        uniqueWatchTime += item.end - item.start;
        end = item.end;
      } else {
        if (item.start > end) {
          uniqueWatchTime += item.end - item.start;
          end = item.end ;
        } else {
          uniqueWatchTime += Math.max(0, item.end - end);
          end = Math.max(end, item.end);
        }
      }
    });

    return uniqueWatchTime;
  };