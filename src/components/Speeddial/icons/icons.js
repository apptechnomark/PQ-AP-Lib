import React from "react";

const CrossIcon = ({ icon }) => {
    return (
        <svg
            width={icon ? "20" : "16"}
            height={icon ? "20" : "16"}
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="0.970703"
                y="7.97021"
                width="16"
                height="2"
                rx="1"
                fill="white"
            />
            <rect
                x="7.9707"
                y="16.9702"
                width="16"
                height="2"
                rx="1"
                transform="rotate(-90 7.9707 16.9702)"
                fill="white"
            />
        </svg>
    );
};

export { CrossIcon };