import React, { ReactNode } from "react";
import styles from "./Tooltip.module.scss";


interface TooltipProps {
  content?: ReactNode;
  position: "top" | "bottom" | "left" | "right";
  children?: ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position,
  children,
  className,
}) => {
  return (
    <div
      className={`${styles.tooltip} relative cursor-pointer p-2 text-sm sm:text-base max-w-fit ${className}`}
    >
      <span
        className={`flex justify-center items-center tooltipText absolute bg-[#84C9E3] w-max max-w-[300px] text-darkCharcoal whitespace-nowrap p-[10px] border border-primary rounded-md opacity-0 before:absolute before:w-3 before:h-3 before:bg-[#84C9E3] before:border-t before:border-primary before:border-r ${
          position === "top" &&
          `${styles.top} hidden left-1/2 transform -translate-x-1/2 before:left-1/2 before:-translate-x-1/2 before:bottom-[-7px] before:transform before:rotate-[135deg]`
        } 
        ${
          position === "bottom" &&
          `${styles.bottom} hidden left-1/2 transform -translate-x-1/2 before:left-1/2 before:-translate-x-1/2 before:top-[-7px] before:transform before:rotate-[-45deg]`
        } 
        ${
          position === "left" &&
          `${styles.left} hidden top-1/2 transform -translate-y-1/2 before:top-1/2 before:-translate-y-1/2 before:right-[-7px] before:transform before:rotate-[45deg]`
        } 
        ${
          position === "right" &&
          `${styles.right} hidden top-1/2 transform -translate-y-1/2 before:top-1/2 before:-translate-y-1/2 before:left-[-7px] before:transform before:rotate-[-135deg]`
        }`}
        style={{
          wordWrap: "break-word",
          whiteSpace: "unset",
        }}
      >
        {content}
      </span>
      <span>{children}</span>
    </div>
  );
};

export { Tooltip };