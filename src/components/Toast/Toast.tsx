import React, { ReactNode } from "react";

interface ToastProps {
  position?:
    | "top_right"
    | "bottom_right"
    | "top_left"
    | "bottom_left"
    | "top_center"
    | "bottom_center";
}

interface ToastState {
  text?: string;
}

class Toast extends React.Component<ToastProps, ToastState> {
  static containerId = "fixed z-9999";

  static showToast(
    type: "success" | "error" | "warning" | "info",
    message: string,
    text?: string,
    duration?: number
  ) {
    const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-4 h-4 sm:w-6 sm:h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  `;
    const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-4 h-4 sm:w-6 sm:h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
  `;
    const warningIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-4 h-4 sm:w-6 sm:h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
  `;
    const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-4 h-4 sm:w-6 sm:h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
</svg>
`;

    const toastElement = document.createElement("div");
    toastElement.className = `flex flex-col text-xs sm:text-base m-[6px] p-[12px] px-[16px] rounded-md text-white font-semibold min-w-15rem relative ${
      type === "error"
        ? "bg-errorColor !text-defaultRed"
        : type === "warning"
        ? "bg-warningColor !text-defaultOrange"
        : type === "info"
        ? "bg-infoColor !text-defaultBlue"
        : "bg-primary !text-pureWhite"
    }`;

    const closeButton = document.createElement("span");
    closeButton.className =
      "absolute top-[18px] right-[20px] w-15 h-15 bg-transparent border-none text-base cursor-pointer pl-10 text-xs sm:text-base";
    closeButton.innerHTML = `
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
        fill=${
          type === "error"
            ? "#DC3545"
            : type === "warning"
            ? "#664D03"
            : type === "info"
            ? "#0A58CA"
            : "#fff"
        }
      />
      <rect
        x="1.41357"
        width="17"
        height="2"
        rx="1"
        transform="rotate(45 1.41357 0)"
        fill=${
          type === "error"
            ? "#DC3545"
            : type === "warning"
            ? "#664D03"
            : type === "info"
            ? "#0A58CA"
            : "#fff"
        }
      />
    </svg>`;
    closeButton.addEventListener("click", () => {
      Toast.removeToast(toastElement);
    });

    const messageElement = document.createElement("span");
    messageElement.className = "flex flex-start items-center mr-20";
    messageElement.innerHTML = `
     <span style="padding-right:5px">${
       type === "error"
         ? errorIcon
         : type === "warning"
         ? warningIcon
         : type === "info"
         ? infoIcon
         : successIcon
     }</span>
     <Typography type="h6">${message}</Typography>`;

    toastElement.appendChild(messageElement);
    toastElement.appendChild(closeButton);

    const textElement = document.createElement("span");
    textElement.className =
      "flex flex-start items-center ml-[22px] sm:ml-[30px] font-normal";
    textElement.innerHTML = `
    <Typography type="label">${text}</Typography>`;
    {
      text && toastElement.appendChild(textElement);
    }

    const container = document.getElementById(Toast.containerId);
    if (container) {
      container.appendChild(toastElement);

      setTimeout(() => {
        Toast.removeToast(toastElement);
      }, duration || 5000);
    }
  }

  static success(message: string, text?: string, duration?: number) {
    Toast.showToast("success", message, text, duration);
  }

  static error(message: string, text?: string, duration?: number) {
    Toast.showToast("error", message, text, duration);
  }

  static warning(message: string, text?: string, duration?: number) {
    Toast.showToast("warning", message, text, duration);
  }

  static info(message: string, text?: string, duration?: number) {
    Toast.showToast("info", message, text, duration);
  }

  static removeToast(toastElement: HTMLElement) {
    if (toastElement && toastElement.parentNode) {
      toastElement.parentNode.removeChild(toastElement);
    }
  }

  render(): ReactNode {
    const { position = "top_right" } = this.props;
    const { text } = this.state || {};

    return (
      <div
        id={Toast.containerId}
        className={`flex flex-col fixed select-none animate-slideDown z-[999] ${
          position === "top_right" && "top-2 right-5"
        } ${position === "bottom_right" && "bottom-2 right-5"} ${
          position === "top_left" && "top-2 left-5"
        } ${position === "bottom_left" && "bottom-2 left-5"} ${
          position === "top_center" &&
          "left-1/2 transform -translate-x-1/2 top-2"
        } ${
          position === "bottom_center" &&
          "left-1/2 transform -translate-x-1/2 bottom-2"
        }`}
      >
        {/* Toast container */}
      </div>
    );
  }
}

export { Toast };