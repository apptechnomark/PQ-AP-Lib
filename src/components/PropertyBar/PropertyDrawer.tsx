import { Button } from "../Button/Button";
import { Close } from "../Closebutton/Close";
import Typography from "../Typography/Typography";
import React, { useEffect, useState } from "react";
import NegativeSignIcon from "./icons/NegativeSignIcon";
import RightArrowIcon from "./icons/RightArrow";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: string[];
    icons: React.ReactNode[];
    counts?: number;
    onOpenModal?: () => void;
}

const PropertyDrawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    items,
    icons,
    counts,
    onOpenModal,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    return (
        <div
            className={`fixed bottom-0 w-full h-auto bg-slate-400 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
                } bg-white z-10`}
        >
            <div className="flex justify-between items-center w-full h-[72px] py-2 px-5 border-b-[1px] border-[#D8D8D8]">
                <div className="flex flex-row justify-center items-center">
                    <div className="mr-5">
                        <NegativeSignIcon />
                    </div>
                    <div className="flex flex-col">
                        <Typography type="h5">{counts} task Selected</Typography>
                        <Typography className="italic text-[#6E6D7A]">
                            click on - button to select more
                        </Typography>
                    </div>
                </div>
                <div onClick={onClose}>
                    <Close variant="small" />
                </div>
            </div>
            <div className="p-4">
                <ul className="">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`flex w-full justify-between items-center ${index === items.length - 1
                                ? ""
                                : "border-b-[1px] border-[#D8D8D8]"
                                }`}
                        >
                            <div className="flex py-4 flex-grow ">
                                <span className=" flex items-center justify-center">
                                    {icons[index]}
                                </span>
                                <Typography type="h6" className="ml-5">
                                    {item}
                                </Typography>
                            </div>
                            <span className="flex ">
                                <RightArrowIcon onClick={onOpenModal} />
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="pt-5 border-t-[1px] border-[#D8D8D8]">
                    <Button
                        className="rounded-md btn-md !w-full"
                        variant="btn-outline-primary"
                        onClick={onClose}
                    >
                        Submit Task
                    </Button>
                </div>
            </div>
        </div>
    );
};

export { PropertyDrawer };
