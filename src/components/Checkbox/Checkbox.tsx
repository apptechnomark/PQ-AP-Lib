import React, { InputHTMLAttributes, useState, useEffect } from "react";
import style from "./checkbox.module.scss";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  variant?: string;
  invalid?: boolean;
  className?: string;
  intermediate?: boolean;
  required?: boolean;
  getError?: (arg1: boolean) => void;
  hasError?: boolean;
}

const CheckBox = ({
  id,
  label,
  variant,
  invalid,
  className,
  intermediate,
  required,
  getError,
  hasError = false,
  ...props
}: CheckBoxProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    setIsTouched(hasError);
  }, [hasError]);

  useEffect(() => {
    if (required && !isChecked) {
      getError && getError(true);
    } else {
      getError && getError(false);
    }
  }, [isChecked, isTouched, required]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setIsTouched(true);
  };

  return (
    <div
      className={`h-5 m-0 p-0 w-fit relative flex justify-start items-center ${className}`}
    >
      {!intermediate ? (
        <>
          <input
            className={`${
              variant === "small" ? style.sm_checkBox : style.checkBox
            } ${invalid && style.invalidcheckBox} absolute left-3`}
            type="checkbox"
            id={id}
            required={required}
            onChange={handleChange}
            {...props}
          />
          <label
            className={`${style.checkBoxLabel} flex items-center ${required && !isChecked && isTouched ? 'requiredError' : ''}`}
            htmlFor={id}
          >
            <span className={`${style.checkBoxSpan}`}></span>
            <span className={`${className}-checkbox`}>{label}</span>
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
            required={required}
            onChange={handleChange}
            {...props}
          />
          <label
            className={`${style.i__checkBoxLabel} h-6 w-full flex items-center ${required && !isChecked && isTouched ? 'requiredError' : ''}`}
            htmlFor={id}
          >
            <span className={`${style.i__checkBoxSpan}`}></span>
            <span className={`${className}-checkbox`}>{label}</span>
          </label>
        </>
      )}
      {required && !isChecked && isTouched && (
        <p className={`${style.errorMessage} ml-0`}>This field is required</p>
      )}
    </div>
  );
};

export default CheckBox;