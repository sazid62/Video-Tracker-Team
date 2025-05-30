import { TimeSlider } from "@vidstack/react";

export default function TimeSliderComponent() {
  return (
    <TimeSlider.Root className="group relative inline-flex w-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden m-0 p-0">
      <TimeSlider.Track className="relative z-0 h-[5px] w-full rounded-sm bg-white/30 group-data-[focus]:ring-[3px] ring-sky-400 m-0 p-0">
        {/* Fill before the thumb — YouTube style reddish-pink */}
        <TimeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded-sm bg-gradient-to-r   from-red-600  to-pink-600 will-change-[width] m-0 p-0" />

        {/* Played progress line — Bright Red */}
        <TimeSlider.Progress className="absolute z-10 h-full w-[var(--slider-progress)] rounded-sm bg-white/20 will-change-[width] m-0 p-0" />
        {/* <TimeSlider.Progress className="absolute z-10 h-full w-[var(--slider-progress)] rounded-sm bg-white/50 will-change-[width] m-0 p-0" /> */}
      </TimeSlider.Track>

      {/* Thumb — Red circle like YouTube */}
      <TimeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500 bg-red-600 opacity-0 ring-red-400 transition-opacity group-data-[active]:opacity-100 group-data-[dragging]:ring-4 will-change-[left] m-0 p-0" />
    </TimeSlider.Root>
  );
}
