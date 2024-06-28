import React, { ReactNode, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
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
  const [visible, setVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      let style = {};
      switch (position) {
        case "top":
          style = {
            left: scrollX + triggerRect.left + (triggerRect.width / 2),
            top: scrollY + triggerRect.top - tooltipRect.height,
          };
          break;
        case "bottom":
          style = {
            left: scrollX + triggerRect.left + (triggerRect.width / 2),
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
  }, [visible, position]);

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
            className={`${position} z-[10] tooltipText absolute bg-[#92EADC] w-max max-w-[300px] text-darkCharcoal whitespace-nowrap p-[10px] border border-primary rounded-md ${styles[position]}`}
            style={{ ...tooltipStyle, position: 'fixed' }}
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