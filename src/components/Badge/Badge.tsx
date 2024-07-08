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
        return { bg: "#333333", text: "#333333" };
      case "secondary":
        return { bg: "#069CDE", text: "#069CDE" };
      case "graph":
        return { bg: "#EA6A47", text: "#EA6A47" };
      case "success":
        return { bg: "#198754", text: "#198754" };
      case "warning":
        return { bg: "#FFC107", text: "#664D03" };
      case "error":
        return { bg: "#DC3545", text: "#DC3545" };
      default:
        return { bg: "#02B89D", text: "#02B89D" };
    }
  };

  return (
    <div
      style={
        variant === "pill"
          ? {
              borderColor: `${getColor(badgetype).bg}`,
              color: `${effect ? getColor(badgetype).text : ""}`,
              background: `${getColor(badgetype).bg}0D`,
            }
          : {
              backgroundColor: `${getColor(badgetype).bg}`,
              color: `${getColor(badgetype).text}`,
              width: width ? width : "18px",
              height: height ? height : "18px",
            }
      }
      className={`${
        variant === "pill"
          ? `px-5 py-[10px] h-[27px] w-[82px] border rounded-[33px] text-[14px] font-normal leading-[16.8px] tracking-[0.28px]`
          : `h-[18px] w-[18px] border-none rounded-full text-[10px] font-semibold leading-[9px] tracking-[0.8px]`
      } flex items-center justify-center`}
    >
      {variant === "dot" ? (
        <>
          <span
            style={
              variant === "dot" && effect
                ? {
                    borderColor: `${getColor(badgetype).bg}`,
                    boxShadow: `0 0 0 0 ${getColor(badgetype).bg}`,
                  }
                : {
                    animation: "none",
                  }
            }
            className={`${style.indicate} text-pureWhite`}
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