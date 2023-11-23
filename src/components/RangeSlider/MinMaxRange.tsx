import React, { useEffect, useRef, useState, ChangeEvent, MouseEvent } from "react";
import styles from "./MinMaxRange.module.scss";

interface MinMaxRangeProps {
  variant?: string;
  minValue: number;
  maxValue: number;
  minRange: number;
  maxRange: number;
  Numbers?: boolean;
  gap: number;
  noRangeBetween?: boolean;
  getValue: (arg1: number, arg2: number) => void;
}

const MinMaxRange: React.FC<MinMaxRangeProps> = ({
  variant = "dot",
  minValue = 0,
  maxValue = 10,
  minRange,
  maxRange,
  Numbers,
  getValue,
  gap = 10,
  noRangeBetween = false,
}) => {
  const gapValue = (maxRange - minRange) / gap;

  const parentDivRef = useRef<HTMLDivElement>(null);
  const [minValueRange, setMinValueRange] = useState<number>(minRange);
  const [maxValueRange, setMaxValueRange] = useState<number>(maxRange);
  const [tooltipVisibleMin, setTooltipVisibleMin] = useState(false);
  const [tooltipVisibleMax, setTooltipVisibleMax] = useState(false);
  const [width, setWidth] = useState<number | null>(null); // Add this line


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const intValue = Number(value);

    if (name === "min") {
      setMinValueRange(intValue);
    } else {
      setMaxValueRange(intValue);
    }
  };

  const handleLineClick = (e: MouseEvent<HTMLDivElement>) => {
    // Calculate the click position relative to the range line
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const totalWidth = rect.width;

    // Calculate the corresponding value based on the click position
    const newValue = (clickX / totalWidth) * (maxValue - minValue) + minValue;

    // Update the position of the minimum or maximum circle based on click position
    if (
      noRangeBetween ||
      Math.abs(newValue - minValueRange) < Math.abs(newValue - maxValueRange)
    ) {
      setMinValueRange(newValue);
    } else {
      setMaxValueRange(newValue);
    }
  };
  if (minValueRange < minValue) {
    setMinValueRange(minValue);
  } else if (minValueRange > maxValueRange - gapValue) {
    setMinValueRange(maxValueRange - gapValue);
  }
  if (maxValueRange > maxValue) {
    setMaxValueRange(maxValue);
  } else if (maxValueRange < minValueRange + gapValue) {
    setMaxValueRange(minValueRange + gapValue);
  }

  getValue(Math.round(minValueRange), Math.round(maxValueRange));

  const minProgressStyle = {
    left: `${Math.max(
      0,
      ((minValueRange - minValue) / (maxValue - minValue)) * 100
    )}%`,
    right: `${Math.max(
      0,
      100 - ((maxValueRange - minValue) / (maxValue - minValue)) * 100
    )}%`,
  };

  useEffect(() => {
    if (parentDivRef.current) {
      setWidth(parentDivRef.current.offsetWidth);
    }
  }, [parentDivRef]);

  const left =
    ((minValueRange - minValue) / (maxValue - minValue)) * (width - 10);

  const right =
    ((maxValueRange - minValue) / (maxValue - minValue)) * (width - 10);

  const numbers = Math.ceil((maxValue - minValue) / gap);
  let totalSteps = Array.apply(null, new Array(gap + 1)).map(function (_el, i) {
    return i++;
  });

  return (
    <div id="parentDiv" className={`relative ${styles.container}`} ref={parentDivRef}>
      <div className={`${styles.range_slider}`} onClick={handleLineClick}>
        <div
          className={`flex items-center px-[7.5px] justify-between w-full absolute ${variant === "dot" && "top-[1.5px]"
            }`}
        >
          {totalSteps.map((index) => (
            <div
              className={` flex justify-center items-center ${variant === "line" ? `${styles.line}` : `${styles.dot}`
                }`}
              key={index}
            >
              {Numbers && (
                <div className="absolute -ml-1.5 top-2 text-[#6E6D7A]">
                  {minValue + index * numbers}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.progress} style={minProgressStyle}></div>
        {tooltipVisibleMin && (
          <div
            className={`${styles.tooltip} ${styles.top}`}
            style={{
              left: left + 5,
            }}
          >
            <span className={`${styles.tooltiptext}`}>
              {Math.round(minValueRange)}
            </span>
          </div>
        )}
        <input
          type="range"
          name="min"
          min={minValue}
          max={maxValue}
          value={minValueRange}
          onChange={handleInputChange}
          onMouseOver={() => setTooltipVisibleMin(true)}
          onMouseOut={() => setTooltipVisibleMin(false)}
        />
        {tooltipVisibleMax && (
          <div
            className={`${styles.tooltip} ${styles.top}`}
            style={{
              left: right + 5,
            }}
          >
            <span className={`${styles.tooltiptext}`}>
              {Math.round(maxValueRange)}
            </span>
          </div>
        )}
        <input
          type="range"
          name="max"
          min={minValue}
          max={maxValue}
          value={maxValueRange}
          onChange={handleInputChange}
          onMouseOver={() => setTooltipVisibleMax(true)}
          onMouseOut={() => setTooltipVisibleMax(false)}
        />
      </div>
    </div>
  );
};

export { MinMaxRange };