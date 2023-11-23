import React from "react";
import styles from "./Close.module.scss";

interface Props {
  variant?: string;
}

const Close: React.FC<Props> = ({ variant }) => {
  return (
    <>
      <div
        className={`${styles.main} ${
          variant === "small" && styles.smallTooltip
        } ${variant === "medium" && styles.mediumTooltip}`}
      >
        <button
          className={`${styles.fromMiddle} ${styles.circle} ${
            variant === "small"
              ? styles.small
              : variant === "medium"
              ? styles.medium
              : styles.large
          } ${styles.scaleUp}`}
          data-animation="minimize"
        >
          <span></span>
        </button>
      </div>
    </>
  );
};

export { Close };