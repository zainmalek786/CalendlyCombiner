import { useMemo } from "react";
import Lottie from "lottie-react";
import calendarAnimation from "../assets/animation.json";

function LeftSideIllustration() {
  const animationConfig = useMemo(() => ({ animationData: calendarAnimation, loop: true, autoplay: true }), []);

  return (
    <div className="w-full md:w-5/12  justify-center items-center md:flex hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <Lottie {...animationConfig} className="w-60 h-60 md:w-72 md:h-72" />
    </div>
  );
}

export default LeftSideIllustration;
