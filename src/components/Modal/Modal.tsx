import React, { ReactNode, useEffect, useRef } from "react";
import Style from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "extra-lg" | "full";
  closeIcon?: boolean;
  width?: string;
  Height?: string;
  className?: string;
  noneOutSideClicked?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size,
  width,
  Height,
  className,
  noneOutSideClicked
}) => {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-[300px]";
      case "lg":
        return "w-[800px]";
      case "extra-lg":
        return "w-[1140px]";
      case "full":
        return "w-full";
      default:
      case "md":
        return "w-[500px]";
    }
  };

  const modalStyles = {
    width: width,
    height: Height
  };

  const modalRef = useRef(null);
  const isDragging = useRef(false);


  const handleMouseDown = (e) => {
    
    if (!isDragging.current) {
      isDragging.current = true;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;

  };

  const handleModalClick = (event: any) => {
    event.stopPropagation();
    if (!isDragging.current && !modalRef.current.contains(event.target) && !noneOutSideClicked) {
      onClose();
    }
  };


  const handleClickOutside = (event:any) => {
    if (!noneOutSideClicked && modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-[1px] z-50`}
        >
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${Style.modal}`}
          >
            <div
              className={`${className} my-6 mx-auto ${getSizeClasses()} `}
              style={modalStyles}
              ref={modalRef}
              onClick={handleModalClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <div className={`${className} border-[1px] border-lightSilver rounded-lg flex flex-col bg-pureWhite outline-none focus:outline-none`}>
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;