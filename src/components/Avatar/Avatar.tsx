import React, { FC, ReactNode, SyntheticEvent } from "react";
import styles from "./Avatar.module.scss";
import Badge from "../Badge/Badge";

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  className?: string;
  type?: string;
  badge?: boolean;
  badgeText?: string;
  variant?: string;
}

const Avatar: FC<AvatarProps> = ({
  imageUrl,
  name,
  className,
  type,
  badge,
  badgeText,
  variant,
}) => {
  const avatarTypeClass = type === "square" ? "rounded-none" : "rounded-full";

  const handleOnError = (e: SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.src =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/20625/avatar-bg.png";
  };

  const Name = name?.toUpperCase();

  const Red = ["A", "F", "K", "P", "U", "Z"];
  const Blue = ["B", "G", "L", "Q", "V"];
  const Green = ["C", "H", "M", "R", "W"];
  const SkyBlue = ["D", "I", "N", "S", "X"];
  const Yellow = ["E", "J", "O", "T", "Y"];

  return (
    <div className={`${styles.avatar} relative w-fit`}>
      {imageUrl ? (
        <img
          className={`${
            variant === "large"
              ? "w-[64px] h-[64px]"
              : variant === "small"
              ? "w-[32px] h-[32px]"
              : variant === "x-small"
              ? "w-[24px] h-[24px]"
              : "w-[40px] h-[40px]"
          } display-block object-fit-cover border-2 border-pureWhite ${avatarTypeClass} ${className}`}
          src={imageUrl}
          alt={Name}
          onError={handleOnError}
        />
      ) : Name ? (
        <span
          className={`${
            variant === "large"
              ? "w-[64px] h-[64px] text-2xl"
              : variant === "small"
              ? "w-[32px] h-[32px] text-sm"
              : variant === "x-small"
              ? "w-[24px] h-[24px] text-xs"
              : "w-[40px] h-[40px] text-base"
          } text-pureWhite border-2 border-pureWhite flex justify-center items-center ${avatarTypeClass} ${
            Red.includes(Name.charAt(0))
              ? "bg-defaultRed"
              : Blue.includes(Name.charAt(0))
              ? "bg-defaultBlue"
              : Green.includes(Name.charAt(0))
              ? "bg-primary"
              : SkyBlue.includes(Name.charAt(0))
              ? "bg-infoColor"
              : "bg-defaultOrange"
          } ${className}`}
        >
          {Name.length <= 2
            ? Name.slice(0, 2)
            : Name.match(/\s/)
            ? Name.split(" ")
                .map((word) => word.charAt(0))
                .join("")
            : Name.charAt(0)}
        </span>
      ) : (
        <span
          className={`${
            variant === "large"
              ? "w-[64px] h-[64px]"
              : variant === "small"
              ? "w-[32px] h-[32px]"
              : variant === "x-small"
              ? "w-[24px] h-[24px]"
              : "w-[40px] h-[40px]"
          } border-2 bg-pureWhite border-pureWhite rounded-full flex justify-center items-center`}
        >
          <svg
            width={`${
              variant === "large"
                ? "35"
                : variant === "small"
                ? "35"
                : variant === "x-small"
                ? "35"
                : "35"
            }`}
            height={`${
              variant === "large"
                ? "35"
                : variant === "small"
                ? "35"
                : variant === "x-small"
                ? "35"
                : "35"
            }`}
            viewBox="0 0 107 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M53.6139 73.2177C67.5276 73.2177 78.8069 57.5951 78.8069 38.3237C78.8069 19.0523 67.5276 3.42969 53.6139 3.42969C39.7002 3.42969 28.4209 19.0523 28.4209 38.3237C28.4209 57.5951 39.7002 73.2177 53.6139 73.2177Z"
              fill="#ADB5BD"
            />
            <path
              d="M53.2163 70.9844C32.1283 70.9844 13.2763 76.0384 0.738281 83.9774C12.4683 100.543 31.7713 111.368 53.6143 111.368C75.3033 111.368 94.4873 100.696 106.241 84.3284C93.7073 76.1874 74.6133 70.9844 53.2163 70.9844Z"
              fill="#ADB5BD"
            />
            <path
              d="M57.4503 87.7374H49.7773C44.4833 87.7374 40.1523 83.4064 40.1523 78.1124V56.2344C40.1523 50.9404 44.4833 46.6094 49.7773 46.6094H57.4503C62.7443 46.6094 67.0753 50.9404 67.0753 56.2344V78.1124C67.0753 83.4064 62.7443 87.7374 57.4503 87.7374Z"
              fill="#ADB5BD"
            />
            <path
              d="M32.3989 40.3092C33.1529 45.9032 31.911 50.7542 29.625 51.1432C27.339 51.5322 24.8739 47.3122 24.1189 41.7182C23.3649 36.1242 24.607 31.2732 26.893 30.8842C29.179 30.4952 31.6449 34.7152 32.3989 40.3092Z"
              fill="#ADB5BD"
            />
            <path
              d="M74.8289 40.3092C74.0749 45.9032 75.3169 50.7542 77.6029 51.1432C79.8889 51.5322 82.3539 47.3122 83.1089 41.7182C83.8629 36.1242 82.6209 31.2732 80.3349 30.8842C78.0489 30.4952 75.5829 34.7152 74.8289 40.3092Z"
              fill="#ADB5BD"
            />
            <path
              d="M29.3013 36.9526C28.4543 31.3666 27.6073 25.7806 26.7593 20.1956C26.4513 18.1676 26.1543 16.0306 26.8953 14.1176C27.6353 12.2046 29.8073 10.6816 31.7283 11.3996C30.9593 7.51364 35.2583 4.64365 39.0043 3.35465C45.2813 1.19365 52.0123 0.0936451 58.5953 0.944645C65.1793 1.79565 71.6073 4.70764 76.0453 9.64464C77.4503 11.2076 78.6603 12.9826 79.3293 14.9736C80.6173 18.8066 79.7973 22.9896 78.9673 26.9466C78.3073 30.0906 77.6483 33.2346 76.9883 36.3786C76.8383 37.0966 76.6693 37.8496 76.1793 38.3956C75.3983 39.2656 74.0813 39.3306 72.9123 39.3326C60.4203 39.3596 47.9273 39.3866 35.4353 39.4136C33.0863 39.4186 30.0203 38.8396 29.7103 36.5116"
              fill="#ADB5BD"
            />
          </svg>
        </span>
      )}
      {badge && (
        <span
          className={`absolute ${
            type === "square" ? "-top-1 -right-2" : (badgeText && badgeText.length > 1) ? "-top-1 -right-3":`-top-1 ${variant === "small" ? "-right-1": variant === "medium" ? "-right-0" : variant === "large" && "right-0"}`
          }`}
        >
          <Badge
            badgetype="primary"
            width={badgeText && badgeText.length > 1 ? 30:undefined}
            variant="dot"
            text={badgeText}
          />
        </span>
      )}
    </div>
  );
};

interface AvatarGroupProps {
  children: ReactNode[];
  type?: string;
  show?: number;
  className?: string;
  variant?: string;
}

const AvatarGroup: FC<AvatarGroupProps> = ({
  children,
  type = "circle",
  show = 5,
  className = "",
  variant,
}) => {
  if (React.Children.count(children) > show) {
    const remainingCount = React.Children.count(children) - show;
    const visibleChildren = React.Children.toArray(children).slice(0, show);
    const finalCount = remainingCount
      .toString()
      .split("")
      .toString()
      .replace(/,/g, " ");

    return (
      <div className={`${styles.avatarGroup} flex items-center justify-center`}>
        {visibleChildren.map((child, index) => (
          <Avatar
            key={index}
            imageUrl={(child as React.ReactElement<AvatarProps>).props.imageUrl}
            name={(child as React.ReactElement<AvatarProps>).props.name}
            type={type}
            className={className}
            variant={variant}
          />
        ))}
        <Avatar
          className={`!text-[#CA6510] !bg-[#FECBA1] ${className}`}
          name={`+ ${finalCount}`}
          type={type}
          variant={variant}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.avatarGroup} avatar-group flex items-center justify-center`}
    >
      {children}
    </div>
  );
};

export { Avatar, AvatarGroup };