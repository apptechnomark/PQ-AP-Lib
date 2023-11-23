import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./navigation.module.scss";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  className?: string;
  variant: string;
  disabled?: boolean;
  filled?: boolean;
  tabs: Tab[];
  getValue: (arg: string) => void;
}

const Navigation: React.FC<NavigationProps> = React.memo(
  ({ className, disabled, getValue, tabs, variant, filled, ...props }) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [tab, setTab] = useState<string>(tabs[0].id);
    const [animationStyle, setAnimationStyle] = useState({
      left: "0",
      width: "106px",
    });

    const tabRef = useRef<HTMLDivElement | null>(null);

    const handleTabClick = useCallback(
      (tabId: string, index: number) => {
        if (tab !== tabId) {
          setTab(tabId);
          setSelectedTabIndex(index);
        }
      },
      [tab]
    );

    useEffect(() => {
      const selectedTab = tabRef.current;
      if (selectedTab) {
        const { offsetLeft, offsetWidth } = selectedTab;
        const newAnimationStyle = {
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        };
        setAnimationStyle(newAnimationStyle);
      }

      getValue(tab);
    }, [selectedTabIndex, getValue, tab]);

    return (
      <>
        {variant === "vertical" && (
          <div className="flex h-[60px] justify-between max-w-full items-center">
            {tabs.map((tab: any, index: number) => (
              <div
                className={`px-5`}
                onClick={() => handleTabClick(tab.id, index)}
                key={tab.id + index}
              >
                <span
                  className={`flex justify-center items-center cursor-pointer`}
                >
                  {tab.icon}
                </span>
                <label
                  className={`flex justify-center items-center cursor-pointer ${selectedTabIndex === index
                    ? "text-primary text-sm font-medium transition-color duration-[600ms]"
                    : "text-darkCharcoal font-medium text-sm"
                    }`}
                >
                  {tab.label}
                </label>
              </div>
            ))}
          </div>
        )}
        {variant === "horizontal" && (
          <>
            <div
              className={`flex relative  ${styles.navbar} h-[60px] justify-between max-w-full items-center`}
            >
              {tabs.map((tab: any, index: number) => (
                <div
                  ref={selectedTabIndex === index ? tabRef : null}
                  className={` py-[7px] px-2.5 z-[1] flex  overflow-hidden justify-center items-center ${selectedTabIndex === index && `rounded`
                    }`}
                  onClick={() => handleTabClick(tab.id, index)}
                  key={tab.id + index}
                >
                  <span className={`cursor-pointer ${selectedTabIndex === index && "pr-4"}`}>{tab.icon}</span>
                  <label
                    className={`${selectedTabIndex === index
                      ? "text-primary -ml-5  px-2.5 font-semibold"
                      : "text-slatyGrey font-medium w-[0] overflow-hidden"
                      }`} style={{ 'transition': 'all 0.4s' }}
                  >
                    {tab.label}
                  </label>
                </div>
              ))}
              <div
                className={`${styles.animation} absolute  rounded z-0 ${filled ? "bg-secondaryPrimary" : " bg-white"
                  }  h-[40px] my-2`}
                style={animationStyle}
              ></div>
            </div>
          </>
        )}
        {variant === "mobile" && (
          <>
            <div className=" flex relative h-[60px] justify-between max-w-full items-center">
              {tabs.map((tab: any, index: number) => (
                <div
                  ref={selectedTabIndex === index ? tabRef : null}
                  className={`py-[7px] px-2.5 z-[1] flex  justify-center items-center  ${selectedTabIndex === index && `rounded`
                    }`}
                  onClick={() => handleTabClick(tab.id, index)}
                  key={tab.id + index}
                >
                  <span className={`cursor-pointer`}>{tab.icon}</span>
                  <label
                    className={`ml-[7px] ${selectedTabIndex === index
                      ? "text-primary text-sm font-semibold"
                      : "text-slatyGrey font-medium text-[0] overflow-hidden"
                      }`} style={{ 'transition': 'all 0.4s' }}
                  >
                    {tab.label}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
  }
);

export { Navigation };
