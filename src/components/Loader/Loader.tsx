import React from "react";
import Typography from "../Typography/Typography";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  helperText?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ size, helperText }) => {
  let container = "";
  let svgSize = 88;

  switch (size) {
    case "sm":
      container = "loader-container sm";
      svgSize = 48;
      break;
    case "lg":
      container = "loader-container lg";
      svgSize = 132;
      break;
    default:
      container = "loader-container md";
      break;
  }

  return (
    <div className={`${container} flex flex-col items-center justify-center`}>
      <svg
        className="animate-spin"
        width={svgSize}
        height={svgSize}
        viewBox="0 0 133 132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5047_872358)">
          <rect
            width="132"
            height="132"
            transform="translate(0.5)"
            fill="url(#pattern0)"
          />
          <g clipPath="url(#clip1_5047_872358)">
            <path
              opacity="0.05"
              d="M109.5 66C109.5 57.8403 107.178 49.849 102.806 42.9595C98.4339 36.07 92.1917 30.5667 84.8085 27.0924"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.1"
              d="M109.5 66C109.5 55.0631 105.332 44.5372 97.8457 36.5645"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.3"
              d="M109.5 66C109.5 60.5804 108.475 55.2097 106.48 50.1707"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M105.5 66C105.5 65.9183 105.5 65.8367 105.499 65.755"
              stroke="#02B89D"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </g>
          <g clipPath="url(#clip2_5047_872358)">
            <path
              opacity="0.05"
              d="M45.0001 28.761C37.9336 32.8409 32.1737 38.8472 28.3934 46.0784C24.613 53.3096 22.9681 61.4671 23.6509 69.5982"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.1"
              d="M45.0001 28.761C35.5285 34.2295 28.4965 43.1016 25.3354 53.5717"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.3"
              d="M45.0001 28.761C40.3066 31.4708 36.1677 35.0434 32.8013 39.2907"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M47.0001 32.2251C46.9294 32.266 46.8588 32.307 46.7883 32.3483"
              stroke="#02B89D"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </g>
          <g clipPath="url(#clip3_5047_872358)">
            <path
              opacity="0.05"
              d="M44.9999 103.239C52.0664 107.319 60.1479 109.304 68.3005 108.962C76.4531 108.62 84.3402 105.966 91.0405 101.309"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.1"
              d="M44.9999 103.239C54.4715 108.707 65.671 110.361 76.319 107.864"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.3"
              d="M44.9999 103.239C49.6934 105.949 54.8568 107.747 60.2183 108.539"
              stroke="#02B89D"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M46.9999 99.7749C47.0706 99.8157 47.1415 99.8563 47.2125 99.8967"
              stroke="#02B89D"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </g>
        </g>
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_5047_872358" />
          </pattern>
          <clipPath id="clip0_5047_872358">
            <rect
              width="132"
              height="132"
              fill="white"
              transform="translate(0.5)"
            />
          </clipPath>
          <clipPath id="clip1_5047_872358">
            <rect
              width="96"
              height="96"
              fill="white"
              transform="translate(18.5 18)"
            />
          </clipPath>
          <clipPath id="clip2_5047_872358">
            <rect
              width="96"
              height="96"
              fill="white"
              transform="translate(48.9307 131.569) rotate(-120)"
            />
          </clipPath>
          <clipPath id="clip3_5047_872358">
            <rect
              width="96"
              height="96"
              fill="white"
              transform="translate(132.069 48.4307) rotate(120)"
            />
          </clipPath>
          <image
            id="image0_5047_872358"
            width="1"
            height="1"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAAAAAFAAFkeJU4AAAAAElFTkSuQmCC"
          />
        </defs>
      </svg>
      {helperText && (
        <Typography
          type="h5"
          className={`text-primary ${size === "sm" ? "!text-[10px]" : ""}`}
        >
          Please wait...
        </Typography>
      )}
    </div>
  );
};

export { Loader };
