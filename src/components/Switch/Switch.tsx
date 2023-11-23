import React, { useState, useEffect } from "react";

interface SwitchProps {
    checked?: boolean;
    disabled?: boolean;
    variant?: "primary" | "invalid";
}

const Switch: React.FC<SwitchProps> = ({ checked, disabled, variant }) => {

    const [isChecked, setIsChecked] = useState(checked || false);

    const handleClick = () => {
        if (!disabled) {
            setIsChecked((prevChecked) => !prevChecked);
        }
    };

    useEffect(() => {
        setIsChecked(checked || false);
    }, [checked]);

    const getColorClasses = () => {
        switch (variant) {
            case "invalid":
                return "bg-defaultRed";
            default:
            case "primary":
                return "bg-primary";
        }
    };

    return (
        <>
            <button
                className={`group relative border-[1.5px] border-lightSilver ${variant === "invalid"
                        ? "hover:border-defaultRed"
                        : "hover:border-primary"
                    } focus:outline-none bg-lightGray rounded-full shadow-sm h-[22px] overflow-hidden w-[40px] relative ${disabled ? "cursor-not-allowed opacity-60 pointer-events-none" : ""
                    }`}
                id="btn"
                onClick={handleClick}
                disabled={disabled}
            >
                <div
                    className={`rounded-full ${getColorClasses()} absolute top-[3.5px] h-[13px] w-[13px] left-[4.5px] transition-transform duration-[800ms] linear`}
                    style={{
                        transform: isChecked ? "scale(4.5)" : "scale(1)",
                    }}
                ></div>
                <div
                    className="rounded-full bg-pureWhite absolute top-[3px] h-[13px] w-[13px] right-[4px] transition-transform duration-[800ms] linear"
                    style={{
                        transform: isChecked ? "scale(1)" : "scale(1)",
                    }}
                ></div>
                <div
                    className={`absolute rounded-full ${variant === "invalid"
                            ? "group-hover:delay-0 group-hover:bg-defaultRed"
                            : " group-hover:delay-0 group-hover:bg-primary"
                        } absolute top-[15%] h-[14px] w-[14px] left-[4px] ${isChecked ? { getColorClasses } : "delay-[450ms] bg-pinkSwan"
                        }`}
                ></div>
                <div
                    className={`rounded-full bg-lightGray absolute top-[3px] h-[13px] w-[13px] right-[4px]`}
                ></div>
            </button>
        </>
    );
};

export { Switch };