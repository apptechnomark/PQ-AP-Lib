import React, { useState } from "react";
import { CrossIcon } from "./icons/icons";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./Speeddial.module.scss";

interface ListProps {
  icon: React.ReactNode;
  action: () => void;
  hoverText: string;
}

interface Props {
  open?: boolean;
  large?: boolean;
  listItems: ListProps[];
}

const SpeedDial: React.FC<Props> = ({ open, large, listItems }) => {
  const [isListVisible, setListVisible] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);
  const [hide, setHide] = useState(false);

  const toggleList = () => {
    setListVisible(!isListVisible);
    setHide(!hide);
  };

  const handleItemHover = (index: number) => {
    setHoveredItemIndex(index);
  };

  const handleItemLeave = () => {
    setHoveredItemIndex(-1);
  };

  return (
    <div className="relative">
      <span
        className={`absolute flex items-center justify-center z-20 ${
          large
            ? "w-fit h-fit text-xl p-[15px]"
            : "w-fit h-fit text-base p-[10px]"
        } ${open ? "ml-2" : "mt-2"} ${
          isListVisible
            ? `${styles.crossAnimation} bg-slatyGrey`
            : `${styles.plusAnimation} bg-[#00B0AE]`
        } text-white border-none outline-none rounded-full`}
        onClick={toggleList}
      >
        <CrossIcon icon={large} />
      </span>

      {!open && (
        <div
          className={`absolute bottom-0 flex-col  gap-2 flex z-10 ${
            isListVisible
              ? `${styles.showAnimation}`
              : `${styles.hideAnimation} ${hide && "hidden"}`
          }`}
        >
          {listItems.map((item, index) => (
            <span
              key={index}
              className={`flex items-center justify-center ${
                large
                  ? "w-fit h-fit text-xl p-[15px]"
                  : "w-fit h-fit text-base p-[10px]"
              } bg-lightSilver hover:bg-slatyGrey text-darkCharcoal hover:text-pureWhite border-none outline-none ${
                hoveredItemIndex === index && !open
                  ? `${styles.hide}`
                  : "rounded-full"
              }`}
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={handleItemLeave}
              onClick={item.action}
            >
              {hoveredItemIndex === index && !open && (
                <span
                  className={`absolute ${
                    styles.left
                  } flex w-max bg-slatyGrey text-pureWhite pl-3 pr-2 ${
                    large ? "py-[11px] right-[40px]" : "py-[6px] right-[30px]"
                  }`}
                >
                  {item.hoverText}
                </span>
              )}
              <span
                className={`${
                  large ? "w-[20px] h-[20px]" : "w-[16px] h-[16px]"
                }`}
              >
                {item.icon}
              </span>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div
          className={`absolute right-0 -top-2 gap-1 flex ${
            isListVisible
              ? `${styles.showLeftAnimation}`
              : `${styles.hideLeftAnimation} ${hide && "hidden"}`
          }`}
        >
          {listItems.map((item, index) => (
            <Tooltip position="top" content={item.hoverText} key={index}>
              <span
                className={`flex items-center justify-center ${
                  large
                    ? "w-fit h-fit text-xl p-[15px]"
                    : "w-fit h-fit text-base p-[10px]"
                } bg-lightSilver text-darkCharcoal border-none outline-none ${
                  hoveredItemIndex === index && !open
                    ? "rounded-r-full"
                    : "rounded-full"
                }`}
                onMouseEnter={() => handleItemHover(index)}
                onMouseLeave={handleItemLeave}
                onClick={item.action}
              >
                {item.icon}
              </span>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};

export { SpeedDial };