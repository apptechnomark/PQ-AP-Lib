import React, { ReactNode, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
  content?: ReactNode;
  position: "top" | "bottom" | "left" | "right";
  children?: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position,
  children,
  className,
  align = "center",
}) => {
  const [visible, setVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [childrenWidth, setChildrenWidth] = useState(0);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (triggerRef.current) {
      // Get the width of the children element
      const width = triggerRef.current.getBoundingClientRect().width;
      setChildrenWidth(width);
    }
  }, [children]);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      let style = {};
      let left: number;

      switch (align) {
        case "left":
          left = scrollX + triggerRect.left;
          break;
        case "right":
          left = scrollX + triggerRect.left - (triggerRect.width / 2) + (childrenWidth / 2)
          break;
        case "center":
          left = scrollX + triggerRect.left + (triggerRect.width / 2)
          break
        default:
          left = scrollX + triggerRect.left + (triggerRect.width / 2)
          break;
      }

      switch (position) {
        case "top":
          style = {
            left,
            top: scrollY + triggerRect.top - tooltipRect.height,
          };
          break;
        case "bottom":
          style = {
            left,
            top: scrollY + triggerRect.bottom,
          };
          break;
        case "left":
          style = {
            left: scrollX + triggerRect.left - tooltipRect.width,
            top: scrollY + triggerRect.top + (triggerRect.height / 2),
          };
          break;
        case "right":
          style = {
            left: scrollX + triggerRect.right,
            top: scrollY + triggerRect.top + (triggerRect.height / 2),
          };
          break;
        default:
          break;
      }
      setTooltipStyle(style);
    }
  }, [visible, position, align]);

  return (
    <div
      className={`${styles.tooltip} relative cursor-pointer p-2 text-sm sm:text-base max-w-fit ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      <span>{children}</span>
      {visible &&
        ReactDOM.createPortal(
          <span
            className={`${position} z-[10] tooltipText absolute bg-[#92EADC] max-w-[300px] text-darkCharcoal  whitespace-nowrap p-[10px] border border-primary rounded-md ${styles[position]} ${styles[`align-${align}`]}`}
            style={{ ...tooltipStyle }}
            ref={tooltipRef}
          >
            {content}
          </span>,
          document.body
        )}
    </div>
  );
};

export { Tooltip };