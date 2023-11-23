import React, { useEffect, useRef, useState } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
  validate?: boolean;
  errorMessage?: string;
  supportingText?: string;
  disabled?: boolean;
  getValue: (arg1: string) => void;
  getError: (arg1: boolean) => void;
  hasError?: boolean;
  minChar?: number;
  maxChar?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  className,
  id,
  name,
  value,
  rows = "1",
  validate,
  onBlur,
  onChange,
  supportingText,
  disabled,
  getValue,
  getError,
  hasError,
  minChar,
  maxChar,
  errorMessage = "This is a required field!",
  ...props
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [err, setErr] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState("false");

  useEffect(() => {
    setErr(hasError);
    setErrMsg(errorMessage);
  }, [hasError, errorMessage]);

  const validateInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.trim() === "") {
      setErr(true);
      getError(false);
      setErrMsg("This is a required field!");
    } else if (e.target.value.trim().length <= minChar) {
      setErr(true);
      getError(false);
      setErrMsg(`Please enter minimum ${minChar} characters.`);
    } else if (e.target.value.trim().length >= maxChar) {
      setErr(true);
      getError(false);
      setErrMsg(`You can enter maximum ${maxChar} characters.`);
    } else {
      setErr(false);
      getError(true);
      setErrMsg("");
    }
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const focusHandler = () => {
    setFocus(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    getValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
    if (err) {
      setErr(false);
    }
  };

  const parsedRows = rows as unknown as number;

  return (
    <div className="flex flex-col w-full text-[14px]">
      {label && (
        <span className="flex">
          <label
            className={`${
              err
                ? "text-defaultRed"
                : focus
                ? "text-primary"
                : "text-slatyGrey"
            }`}
          >
            {label}
          </label>
          {validate && (
            <span
              className={`${disabled ? "text-slatyGrey" : "text-defaultRed"}`}
            >
              &nbsp;*
            </span>
          )}
        </span>
      )}

      <div
        className={`${
          !err
            ? "flex w-full relative before:absolute before:bottom-0 before:left-0 before:block before:w-0 before:h-px before:bg-primary before:transition-width before:duration-[800ms] before:ease-in hover:before:w-full"
            : "w-full"
        }`}
      >
        <textarea
          className={`${className} py-1 border-b outline-none transition duration-600 w-full h-full text-darkCharcoal ${
            err
              ? "border-b-defaultRed"
              : focus
              ? "border-b-primary"
              : "border-b-lightSilver"
          }`}
          ref={textAreaRef}
          rows={parsedRows}
          id={id}
          name={name}
          value={value}
          onBlur={
            onBlur
              ? onBlur
              : validate
              ? validateInput
              : validate
              ? focusHandler
              : undefined
          }
          onChange={handleInputChange}
          onFocus={handleFocus}
          {...props}
        />
      </div>
      {!err && supportingText && (
        <span className="text-slatyGrey text-[12px] sm:text-[14px]">
          {supportingText}
        </span>
      )}
      {err && (
        <span className="text-defaultRed text-[12px] sm:text-[14px]">
          {errMsg}
        </span>
      )}
    </div>
  );
};

export { Textarea };
