import React, { useState } from "react";
import  Typography  from "../Typography/Typography";
import { successIcon, errorIcon, warningIcon, infoIcon } from "./icons/icons";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  message: string;
}

const Alert: React.FC<AlertProps> = ({ variant, message }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  let alertClass = "";

  switch (variant) {
    case "success":
      alertClass = "!bg-primary !text-pureWhite";
      break;
    case "error":
      alertClass = "!bg-errorColor !text-defaultRed";
      break;
    case "warning":
      alertClass = "!bg-warningColor !text-defaultOrange";
      break;
    case "info":
      alertClass = "!bg-infoColor !text-defaultBlue";
      break;
    default:
      alertClass = "!bg-primary !text-pureWhite";
      break;
  }

  return (
    <>
      {visible && (
        <div
          className={`flex flex-col m-[6px] p-[12px] px-[16px] rounded-md text-primary min-w-15rem relative z-[999] ${alertClass}`}
          role="alert"
        >
          <div className="flex">
            <span>
              {variant === "error"
                ? errorIcon
                : variant === "warning"
                ? warningIcon
                : variant === "info"
                ? infoIcon
                : successIcon}
            </span>
            <Typography
              type="sub-title"
              className="ml-2 mr-6 text-xs sm:text-base !font-bold"
            >
              {message}
            </Typography>
          </div>
          <button
            type="button"
            className="absolute top-[50%] -translate-y-[50%] right-[20px] w-15 h-15 bg-transparent border-none cursor-pointer pl-10 text-xs sm:text-base"
            onClick={handleClose}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="-0.000732422"
                y="12"
                width="17"
                height="2"
                rx="1"
                transform="rotate(-45 -0.000732422 12)"
                fill={`${
                  variant === "error"
                    ? "#DC3545"
                    : variant === "warning"
                    ? "#664D03"
                    : variant === "info"
                    ? "#0A58CA"
                    : "#fff"
                }`}
              />
              <rect
                x="1.41357"
                width="17"
                height="2"
                rx="1"
                transform="rotate(45 1.41357 0)"
                fill={`${
                  variant === "error"
                    ? "#DC3545"
                    : variant === "warning"
                    ? "#664D03"
                    : variant === "info"
                    ? "#0A58CA"
                    : "#fff"
                }`}
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export { Alert };