import React from "react";

import style from "./Badge.module.scss";

interface BadgeProps {
  text?: string;
  badgetype:
    | "dark"
    | "secondary"
    | "graph"
    | "success"
    | "warning"
    | "error"
    | "primary";
  variant: "pill" | "dot";
  effect?: boolean;
  classname?: string;
  width?: number;
  height?: number;
}

const Badge = ({
  text,
  badgetype,
  variant,
  effect,
  classname,
  width,
  height,
}: BadgeProps) => {

  const getColor = (type: string) => {
    switch (type) {
      case "dark":
        return "#333333";
        break;
      case "secondary":
        return "#069CDE";
        break;
      case "graph":
        return "#EA6A47";
        break;
      case "success":
        return "#198754";
        break;
      case "warning":
        return "#FFC107";
        break;
      case "error":
        return "#DC3545";
        break;
      default:
        return "#02B89D";
        break;
    }
  };
  return (
    <div
      style={
        variant === "pill"
          ? {
              borderColor: `${getColor(badgetype)}`,
              color: `${effect ? getColor(badgetype) : ""}`,
              background: `${getColor(badgetype)}0D`,
            }
          : {
              backgroundColor: `${getColor(badgetype)}`,
              width: width ? width : "18px",
              height: height ? height : "18px",
            }
      }
      className={`${
        variant === "pill"
          ? `px-5 py-[10px] h-[27px] w-[82px] border rounded-[33px] text-[14px] font-normal leading-[16.8px] tracking-[0.28px]`
          : `h-[18px] w-[18px] border-none rounded-full text-white text-[10px] font-semibold leading-[9px] tracking-[0.8px]`
      } flex items-center justify-center`}
    >
      {variant === "dot" ? (
        <>
          <span
            style={
              variant === "dot" && effect
                ? {
                    borderColor: `${getColor(badgetype)}`,
                    boxShadow: `0 0 0 0 ${getColor(badgetype)}`,
                  }
                : {
                    animation: "none",
                  }
            }
            className={style.indicate}
          >
            {parseInt(text) > 99 ? "99+" : text}
            {effect && <span className={`${style.indicateBorder}`}></span>}
          </span>
        </>
      ) : (
        text
      )}
    </div>
  );
};

export default Badge;