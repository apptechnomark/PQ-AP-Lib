import React, { ReactNode } from "react";

interface ModalActionProps {
  children: ReactNode;
  position?: "start" | "center" | "end";
  className?: string;

}

const ModalAction: React.FC<ModalActionProps> = ({ children, position,className }) => {
  let justifyClasses = "";

  if (position === "start") {
    justifyClasses = "justify-start";
  } else if (position === "center") {
    justifyClasses = "justify-center";
  } else {
    justifyClasses = "justify-end";
  }
  return (
    <div className={`${className} flex flex-wrap items-center border-t border-solid border-lightSilver rounded-b ${justifyClasses}`}>
      {children || "Modal Action"}
    </div>
  );
};

export default ModalAction;