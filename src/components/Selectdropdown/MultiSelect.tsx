import React, { useRef, useEffect, useState } from "react";

// Icons Componnents
import ChevronDown from "./icons/ChevronDown.js";
// Library Components
import { Avatar } from "../Avatar/Avatar.js";
import CheckBox from "../Checkbox/Checkbox.js";

interface MultiSelectProps {
  id: string;
  options: { value: string; label: string }[];
  onSelect: (selectedValues: string[]) => void;
  label?: string;
  type?: string;
  className?: string;
  required?: boolean;
  defaultValue?: string;
  avatar?: boolean;
  avatarName?: string;
  avatarImgUrl?: string;
  errorMessage?: string;
  hasError?: boolean;
  getValue: (value: string) => void;
  getError: (arg1: boolean) => void;
  supportingText?: string;
  errorClass?: string;
  validate?: boolean;
  placeholder?: any;
  noborder?: boolean
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  options,
  onSelect,
  label,
  type,
  className,
  required = false,
  defaultValue,
  avatar,
  avatarName,
  avatarImgUrl,
  errorMessage = "This is a required field.",
  supportingText,
  hasError,
  getError,
  getValue,
  errorClass,
  validate,
  placeholder,
  noborder
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  {
    validate &&
      useEffect(() => {
        setErrMsg(errorMessage);
        setError(hasError);
        hasError && getError(false);
        defaultValue && setInputValue(defaultValue)
      }, [errorMessage, hasError, defaultValue]);
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setInputValue("");
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleToggleOpen = () => {
    setInputValue("");
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();

    if (validate && inputValue.trim() === "") {
      setError(true);
      setErrMsg("Please select a valid option.");
    } else {
      setError(false);
      setErrMsg("");
      getValue(inputValue);
      setInputValue(inputValue);
    }
  };

  const handleSelect = (value: string) => {
    const updatedValues = [...selectedValues];
    const index = updatedValues.indexOf(value);

    if (index > -1) {
      updatedValues.splice(index, 1);
    } else {
      updatedValues.push(value);
    }

    setSelectedValues(updatedValues);
    setInputValue("");
    onSelect(updatedValues);

    if (validate) {
      if (updatedValues.length === 0) {
        setError(true);
        setErrMsg("Please select at least one option.");
        getError(false);
      } else {
        setError(false);
        setErrMsg("");
        getError(true);
      }
    }
    setFocusedIndex(-1);

  };

  const handleBlur = () => {
    if (validate) {
      if (inputValue.trim() === "") {
        setError(true);
        setErrMsg("Please select a valid option.");
        getError(false);
      } else {
        setError(false);
        setErrMsg("");
        getError(true);
      }
    }
  };

  const handleListItemKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    value: string,
    index: number
  ) => {
    if (e.key === "Enter" && e.target instanceof HTMLElement && e.target.tagName == 'LI') {
      handleSelect(value);
    } else if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      setFocusedIndex(index - 1);
    } else if (e.key === "ArrowDown" && index < options.length - 1) {
      e.preventDefault();
      setFocusedIndex(index + 1);
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1) {
      const optionsElements = Array.from(
        selectRef.current!.querySelectorAll("li")
      );
      optionsElements[focusedIndex].focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (value: any) => {
    if (value.key === "ArrowUp" && focusedIndex > 0) {
      value.preventDefault();
      setFocusedIndex(focusedIndex - 1);
    } else if (value.key === "ArrowDown" && focusedIndex < options.length - 1) {
      value.preventDefault();
      setFocusedIndex(focusedIndex + 1);
    }
  }

  return (
    <>
      <div
        className={`relative font-medium w-full ${noborder ? '' : 'border-b'} ${selectedValues.length > 0
          ? "border-primary"
          : error
            ? "border-defaultRed"
            : "border-lightSilver hover:border-primary transition-colors duration-300"
          } ${className}`}
        ref={selectRef}
      >
        {label && (
          <label
            className={`text-[14px] font-normal ${isOpen
              ? "text-primary"
              : selectedValues.length > 0
                ? "text-primary"
                : error
                  ? "text-defaultRed"
                  : "text-slatyGrey"
              }`}
            htmlFor={id}
          >
            {label}
            {required && <span className="text-defaultRed">&nbsp;*</span>}
          </label>
        )}

        <div className="flex flex-row items-center justify-center relative">
          <input
            id={id}
            onBlur={handleBlur}
            onClick={handleToggleOpen}
            onChange={handleInputChange}
            readOnly={!isOpen}
            placeholder={
              selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : isOpen ? placeholder || "Search" : defaultValue || "Please select"
            }
            value={
              inputValue.length > 25
                ? `${inputValue.substring(0, 20)}...`
                : inputValue
            }
            className={`${error&&"placeholder:text-defaultRed text-defaultRed"} w-full  flex-grow bg-white outline-none text-darkCharcoal text-[14px] font-normal ${isOpen ? "text-primary" : ""
              } ${!isOpen ? "placeholder-darkCharcoal cursor-pointer" : "placeholder-primary cursor-default"
              }`} style={{ background: "transparent" }}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <div
            onClick={handleToggleOpen}
            className={`${error&&" text-defaultRed"} text-[1.5rem] transition-transform text-darkCharcoal cursor-pointer  ${isOpen ? "rotate-180 text-primary duration-400" : "duration-200"}
              }`}>
            <ChevronDown />
          </div>
        </div>

        <ul
          className={`absolute z-10 w-full bg-pureWhite ${noborder ? "mt-[13px]" : "mt-[1px]"} overflow-y-auto shadow-md transition-transform ${isOpen
            ? "max-h-60 translate-y-0 transition-opacity opacity-100 duration-500"
            : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
            } ${isOpen ? "ease-out" : ""}`}
        >
          {options.length > 0 &&
            options.some((option) =>
              option.label.toLowerCase().startsWith(inputValue)
            ) ? (
            options.map((option, index) => (
              <li
                key={index}
                className={`outline-none focus:bg-whiteSmoke p-[10px] text-[14px] hover:bg-whiteSmoke font-normal cursor-pointer flex items-center ${selectedValues.includes(option.value) ? "bg-whiteSmoke" : ""
                  } ${!option.label.toLowerCase().startsWith(inputValue)
                    ? "hidden"
                    : ""
                  }`}
                onClick={type !== "checkbox"
                  ? () => {
                    if (option.value !== inputValue) {
                      handleSelect(option.value);
                    }
                  }
                  : undefined
                }
                onKeyDown={(e) =>
                  handleListItemKeyDown(e, option.value, index)
                }
                tabIndex={0}
                ref={(el) => {
                  if (index === focusedIndex) {
                    el?.focus();
                  }
                }}

              >
                {avatar && (
                  <div className="mr-2 flex-shrink-0 items-center text-[1.5rem] text-darkCharcoal">
                    <Avatar
                      variant="x-small"
                      name={avatarName}
                      imageUrl={avatarImgUrl}
                    />
                  </div>
                )}

                {type === "checkbox" && (
                  <CheckBox
                    id={option.value}
                    label={option.label}
                    checked={selectedValues.includes(option.value)}
                    onChange={(e: any) => {
                      e.target.checked
                        ? handleSelect(option.value)
                        : handleSelect(option.value);
                    }}
                  />
                )}
                {/* {option.label} */}
              </li>
            ))) : (
            <span className="p-[10px] focus:bg-whiteSmoke text-[15px] hover:bg-whiteSmoke font-medium cursor-pointer flex flex-row items-center space-x-2 ">
              No matching data found.
            </span>
          )}
        </ul>
      </div>

      {error && (
        <span
          className={`text-defaultRed text-[12px] sm:text-[14px] ${errorClass}`}
        >
          {errMsg}
        </span>
      )}
    </>
  );
};

export { MultiSelect };