import React, { InputHTMLAttributes } from "react";

import styles from "./Radio.module.scss";

interface RadioPropsTypes extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  variant?: string;
}

const Radio = ({ id, label, variant, ...props }: RadioPropsTypes) => {
  return (
    <div className={`${styles.container} relative min-w-fit w-full flex`}>
      <input
        className={`${styles.__radio} absolute left-5`}
        type="radio"
        id={id}
        {...props}
      />
      <label
        htmlFor={id}
        className={variant === "invalid" ? styles.invalidLabel : ""}
      >
        <svg
          className={`${styles.check} ${
            variant === "invalid" ? styles.invalidCheck : ""
          }`}
          viewBox="0 0 40 40"
        >
          <circle id={styles.border} r="18px" cx="20px" cy="20px"></circle>
          <circle id={styles.dot} r="8px" cx="20px" cy="20px"></circle>
        </svg>
        {label?.split(" ")}
        {/* <Typography type="label">{label}</Typography> */}
      </label>
    </div>
  );
};

export default Radio;