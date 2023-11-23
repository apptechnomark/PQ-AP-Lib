import React, { useState, useEffect } from "react";
import  Typography  from "../Typography/Typography";
import Style from "./Progressbar.module.scss"


interface ProgressBarProps {
  progress?: number;
  label: string;
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  striped?: boolean;
  progressDigit?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 100,
  label,
  variant,
  striped = false,
  progressDigit = true,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgress((prevProgress) => {
        const increment = Math.ceil(progress / 100);
        const nextProgress = prevProgress + increment;
        return nextProgress > progress ? progress : nextProgress;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [progress]);

  const fillStyle: React.CSSProperties = {
    ["--progress-width" as any]: `${currentProgress}%`,
    width: `var(--progress-width)`,
  };

  function getBackgroundColor(variant: ProgressBarProps["variant"]): string {
    switch (variant) {
      case "primary":
        return "bg-primary";
      case "success":
        return "bg-successColor";
      case "danger":
        return "bg-defaultRed";
      case "warning":
        return "bg-lightYellow";
      case "info":
        return "bg-skyBlue";
      case "secondary":
      default:
        return "bg-blueColor";
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <Typography type="label" className="text-sm text-slatyGrey">
          {label ? label : ""}
        </Typography>
        <div className="flex items-center">
          <div className="w-full h-2 bg-lightSilver rounded">
            {striped ? (
              <div
                className={`h-full rounded ${Style.progress_fill} ${getBackgroundColor(
                  variant
                )}`}
                style={fillStyle}
              >
                <div className={Style.striped_progress_bar}></div>
              </div>
            ) : (
              <div
                className={`h-full rounded ${Style.progress_fill} ${getBackgroundColor(
                  variant
                )}`}
                style={fillStyle}
              ></div>
            )}
          </div>
          {progressDigit && (
            <Typography type="body" className="ml-2 text-sm text-pureBlack">
              {currentProgress}%
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProgressBar };