import React, { useState } from "react";
import style from "./Tab.module.scss";
import Typography from "../Typography/Typography";

interface TabBarProps {
  tabs: any[];
  className?: string;
  getValue: (arg1: string) => void;
  alignIcon?: "left" | "right";
}

const TabBar = ({ tabs, getValue, className, alignIcon }: TabBarProps) => {
  const [tabId, setTabId] = useState(tabs[0].id);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: any) => {
    // if (e.target.closest('label')) {
    setTabId(e.target.id);
    getValue(e.target.id);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 700);
    // }
  };

  return (
    <div className={`h-12  flex ${style.customScrollbar}  ${className} overflow-visible`}>
      {tabs.map((tab, index: any) => (
        <div
          key={index + 1}
          id={tab.id}
          className={`max-[425px]:min-w-full dark:text-pureWhite w-full whitespace-nowrap relative flex select-none ${tab.disabled == true ? "text-slatyGrey hover:pointer-events-none" : "cursor-pointer hover:text-primary hover:border-b-2 hover:border-primary hover:bg-[#E1F7F3]"} ${tab.jsxElement ? " !m-0 !p-0" : "px-5"} justify-center items-center border-b-2  text-center  ${tabId === tab.id ? " border-primary text-primary" : "border-lightSilver"}`}
          onClick={handleClick}
        >
          {tab.alignIcon === "left" && tab.icon}
          {tab.label}
          {tab.alignIcon === "right" && tab.icon}
          <span className="">
            {tab.jsxElement}
          </span>
          <span className={` absolute ${isClicked && tabId === tab.id && `${style.tab__ripple} w-full opacity-0 h-12 rounded-[30px]`}`}></span>
        </div>
      ))
      }
    </div>
  );
};

export { TabBar };