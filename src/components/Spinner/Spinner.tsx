import React from "react";

import Style from "./Spinner.module.scss";

interface SpinnerProps {
    size?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size }) => {
    const loaderStyle = {
        fontSize: size || "16px",
    };

    return (
        <div className="flex flex-col relative m-2">
            <div
                className={`${Style.upper_half} text-primary indent-[-9999em] overflow-hidden w-[1em] h-[1em] rounded-full transform translate-z-0`}
                style={loaderStyle}
            >
                Loading...
            </div>
            <div
                className={`${Style.lower_half} absolute text-primary indent-[-9999em] overflow-hidden w-[1em] h-[1em] rounded-full transform translate-z-0`}
                style={loaderStyle}
            >
                Loading...
            </div>
        </div>
    );
};

export { Spinner };