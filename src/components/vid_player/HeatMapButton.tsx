import { PIPButton } from "@vidstack/react";
// See "Icons" component page for setup before importing the following:
import {
  PictureInPictureExitIcon,
  PictureInPictureIcon,
} from "@vidstack/react/icons";

function HeatMapButton() {
  return (
    <PIPButton className="group ring-sky-400 relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden">
      <PictureInPictureIcon className="w-8 h-8 group-data-[active]:hidden" />
      <PictureInPictureExitIcon className="w-8 h-8 hidden group-data-[active]:block" />
    </PIPButton>
  );
}

export default HeatMapButton;
