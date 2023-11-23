import React, { InputHTMLAttributes } from "react";
import style from "./checkbox.module.scss";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  variant?: string;
  invalid?: boolean;
  className?: string;
  intermediate?: boolean;
}

const CheckBox = ({
  id,
  label,
  variant,
  invalid,
  className,
  intermediate,
  ...props
}: CheckBoxProps) => {
  return (
    <div
      className={`h-5 m-0 p-0 w-fit relative flex justify-start items-center ${className}`}
    >
      {!intermediate ? (
        <>
          <input
            className={`${
              variant === "small" ? style.sm_checkBox : style.checkBox
            }
          ${invalid && style.invalidcheckBox} absolute left-3`}
            type="checkbox"
            id={id}
            {...props}
          />
          <label
            className={`${style.checkBoxLabel} flex items-center`}
            htmlFor={id}
          >
            <span className={`${style.checkBoxSpan}`}></span>
            {label}
          </label>
        </>
      ) : (
        <>
          <input
            className={`${
              variant === "small" ? style.sm_i__checkBox : style.i__checkBox
            } ${invalid && style.i__invalidcheckBox} absolute left-3`}
            type="checkbox"
            id={id}
            {...props}
          />
          <label
            className={`${style.i__checkBoxLabel} h-6 w-full flex items-center`}
            htmlFor={id}
          >
            <span className={`${style.i__checkBoxSpan}`}></span>
            {label}
          </label>
        </>
      )}
    </div>
  );
};

export default CheckBox;