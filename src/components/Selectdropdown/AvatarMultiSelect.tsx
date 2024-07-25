import React, { useRef, useEffect, useState, useCallback } from "react";
import { Avatar, AvatarGroup } from "../Avatar/Avatar.js";
import CheckBox from "../Checkbox/Checkbox.js";
import ChevronDown from "./icons/ChevronDown.js";
import Search from "./icons/Search.js";
import Typography from "../Typography/Typography.js";
// import styles from "./CompanyList.module.scss";
import { Button } from "../Button/Button.js";

interface CompanyListProps {
  id: string;
  options: {
    value: string;
    label: string;
    imageUrl?: string;
    isEnable?: any;
    isChecked?: any;
  }[];
  multiSelect?: boolean;
  label?: string;
  className?: string;
  required?: boolean;
  defaultValue?: string;
  errorMessage?: string;
  hasError?: boolean;
  getValue: (value: any) => void;
  getError: (arg1: boolean) => void;
  onChange?: (value: any) => void;
  validate?: boolean;
  placeholder?: any;
  noborder?: boolean;
  showAvatar?: number;
  disabled?: boolean;
  type?: "avatar" | "text";
  checkbox?: boolean;
  variant?: "user" | "company";
  values?: string[];
  hideIcon?: boolean;
  avatarSize?: "small" | "large" | "x-small";
  isSearchEnable?: boolean;
}
const AvatarMultiSelect: React.FC<CompanyListProps> = ({
  id,
  options,
  values,
  label,
  className,
  required,
  defaultValue,
  onChange,
  errorMessage = "This is required field!",
  hasError,
  getValue,
  getError,
  validate,
  placeholder,
  noborder,
  showAvatar = 3,
  disabled,
  variant = "company",
  type = "avatar",
  multiSelect = false,
  checkbox = false,
  hideIcon,
  avatarSize = "small",
  isSearchEnable = true,
  ...props
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    values && values.length > 0 ? values : []
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [err, setErr] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (validate) {
      setFocus(hasError);
      setErrorMsg(errorMessage);
      setErr(hasError);
    } else {
      getError(true);
      setFocus(hasError);
    }
  }, [validate, errorMessage, hasError]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    setFocus(!focus);
    // selectedValues.length === 0 && setErr(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setInputValue(inputValue);
  };

  useEffect(() => {
    if (values?.length > 0) {
      setSelectedValues(values);
    } else {
      setSelectedValues([]);
    }
  }, [values?.length]);

  const handleCheckboxChange = (value: string) => {
    setSelectedValues((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  const handleSelect = (value: string) => {
    if (multiSelect) {
      handleCheckboxChange(value);
    } else {
      // Single select logic
      const updatedValues = selectedValues.includes(value) ? [] : [value];

      if (validate) {
        setErr(updatedValues.length === 0);
        setErrorMsg("Please select an option.");
        getError(updatedValues.length !== 0);
      }
      setInputValue("");
      setFocusedIndex(-1);
      setSelectedValues(updatedValues);
      getValue(updatedValues);
      setIsOpen(false);
    }
  };

  const getValueRef = useRef(getValue);

  useEffect(() => {
    getValueRef.current(selectedValues);
  }, [selectedValues]);

  const updatedAvatars = !!selectedValues && selectedValues?.map((value, index) => {
    const option = options?.find((item) => item.value == value);
    return (
      <Avatar
        key={index}
        name={option ? option.label : ""}
        variant={avatarSize}
        imageUrl={option ? option.imageUrl : undefined}
      />
    );
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!selectRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setFocus(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleListItemKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    value: string,
    index: number
  ) => {
    if (e.key === "Enter") {
      handleSelect(value);
    } else if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      setFocusedIndex(index - 1);
    } else if (e.key === "ArrowDown" && index < options.length - 1) {
      e.preventDefault();
      setFocusedIndex(index + 1);
    } else {
      e.preventDefault();
      setFocusedIndex(-1);
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1) {
      const optionsElements = Array.from(
        selectRef.current!.querySelectorAll("li")
      );
      optionsElements[focusedIndex];
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (onChange) {
      onChange(selectedValues); // Convert array to string if needed
    }
  }, [selectedValues, onChange]);

  return (
    <>
      <div id={id}
        className={`relative text-[14px] font-medium w-full ${noborder ? "" : "border-b"
          } ${className}
            ${disabled
            ? "border-lightSilver"
            : isOpen
              ? "border-primary"
              : inputValue
                ? "border-primary"
                : err
                  ? "border-defaultRed"
                  : `${selectedValues.length > 0
                    ? "border-primary"
                    : "border-lightSilver "
                  } ${noborder ? "" : "after:block"} absolute after:border-b after:mb-[-1px] after:border-primary after:scale-x-0 after:origin-left after:transition after:ease-in-out after:duration-1000 hover:after:scale-x-100`
          }`}
        ref={selectRef}
      >
        {label && (
          <span className="flex">
            <label
              className={` text-[12px] font-normal ${err
                ? "text-defaultRed"
                : focus
                  ? "text-primary"
                  : "text-slatyGrey "
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
          id={id}
          className={`flex items-center  transition-height duration-200 ease-out cursor-pointer ${disabled && "pointer-events-none"
            } ${selectedValues.length > 0 &&
              type == "avatar" &&
              avatarSize !== "x-small"
              ? "h-[42px]"
              : "h-[25px]"
            }`}
          onClick={handleToggleOpen}
          {...props}
        >
          {selectedValues.length > 0 ? (
            <>
              {multiSelect && type === "avatar" && (
                // Only show avatars for multi-select
                <AvatarGroup variant={avatarSize} show={showAvatar}>
                  {updatedAvatars}
                </AvatarGroup>
              )}
              {!multiSelect &&
                type === "avatar" &&
                selectedValues.length === 1 && (
                  // Show single selected avatar with label for single-select
                  <div className="flex items-center">
                    <Avatar
                      variant={avatarSize}
                      name={
                        options.find((item) => item.value === selectedValues[0])
                          ?.label || ""
                      }
                      imageUrl={
                        options.find((item) => item.value === selectedValues[0])
                          ?.imageUrl
                      }
                    />
                    <span className="ml-0.5 !w-[53%] !truncate">
                      <label className="font-proxima text-sm">
                        {
                          options.find(
                            (item) => item.value === selectedValues[0]
                          )?.label
                        }
                      </label>
                    </span>
                  </div>
                )}
              {type === "text" && (
                <Typography type="h6">
                  {selectedValues.length > 0 &&
                    `${selectedValues.length} selected.`}
                </Typography>
              )}
            </>
          ) : (
            <Typography
              type="h6"
              className={`!font-normal  ${err && "text-defaultRed"
                } text-slatyGrey opacity-70 ${disabled && "text-slatyGrey"
                } select-none`}
            >
              {isOpen ? "" : defaultValue ? defaultValue : "Please select"}
            </Typography>
          )}
          {!hideIcon && (
            <div
              onClick={handleToggleOpen}
              className={`ml-1 text-[1.5rem]  absolute right-0 transition-transform ${err
                ? "text-defaultRed"
                : disabled
                  ? "text-slatyGrey pointer-events-none"
                  : "text-darkCharcoal "
                }  cursor-pointer   ${isOpen ? "rotate-180 text-primary duration-400" : "duration-200"
                }}`}
            >
              <ChevronDown />
            </div>
          )}
        </div>
        <div>
          <ul
            className={`absolute z-10 w-full bg-pureWhite mt-[1px] overflow-y-auto shadow-md transition-transform  ${isOpen
              ? "max-h-60 translate-y-0 transition-opacity z-[1] opacity-100 duration-500"
              : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
              } ${isOpen ? "ease-out" : ""}`}
          >
            {isSearchEnable && (
              <li
                className={`sticky top-0 z-[3] bg-pureWhite outline-none focus:bg-whiteSmoke p-[10px] text-sm font-normal cursor-pointer flex items-center`}
              >
                <div
                  className={`flex absolute  ${variant === "user" ? "left-3" : "left-2"
                    }`}
                >
                  <Search />
                </div>
                <input
                  id={id}
                  onChange={handleInputChange}
                  placeholder="Search"
                  value={
                    inputValue.length > 25
                      ? `${inputValue.substring(0, 20)}...`
                      : inputValue
                  }
                  className={` text-sm placeholder:text-sm  w-full pl-6 py-1 ${variant === "user" ? "border rounded" : "border-b"
                    } border-lightSilver flex-grow outline-none font-normal ${isOpen ? "text-primary" : ""
                    } ${!isOpen ? "cursor-pointer" : "cursor-default"} ${!isOpen ? "placeholder-darkCharcoal" : "placeholder-primary"
                    }`}
                  style={{ background: "transparent" }}
                />
              </li>
            )}
            {options &&
              options.length > 0 &&
              options.some((option) =>
                option.label.toLowerCase().startsWith(inputValue)
              ) ? (
              options.map((option, index) => (
                <li
                  key={option.value + index}
                  className={`outline-none focus:bg-whiteSmoke p-[10px] text-sm hover:bg-whiteSmoke font-normal cursor-pointer flex items-center ${selectedValues.includes(option.value) && ""
                    }
                    ${!option.label.toLowerCase().startsWith(inputValue)
                      ? "hidden"
                      : ""
                    }
                    ${option && option.isEnable !== false
                      ? ""
                      : "pointer-events-none opacity-60"
                    }
                    `}
                  onClick={() => {
                    if (option.value !== inputValue) {
                      handleSelect(option.value);
                    }
                  }}
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
                  {checkbox && (
                    <div
                      className={
                        option && option.isEnable !== false
                          ? ""
                          : "pointer-events-none opacity-60"
                      }
                    >
                      <CheckBox
                        id={Math.random() + "" + index}
                        checked={selectedValues.includes(option.value)}
                        onChange={() => {
                          handleCheckboxChange(option.value);
                        }}
                        getError={() => {}}
                      />
                    </div>
                  )}
                  <div className="mx-2 flex-shrink-0 items-center text-[1.5rem] text-darkCharcoal">
                    <Avatar
                      variant={avatarSize}
                      name={option.label}
                      imageUrl={option.imageUrl}
                    />
                  </div>
                  <Typography type="h6" className="truncate">
                    {option.label}
                  </Typography>
                </li>
              ))
            ) : (
              <span className="p-[10px] focus:bg-whiteSmoke text-[15px] hover:bg-whiteSmoke font-medium cursor-pointer flex flex-row items-center space-x-2 ">
                No matching data found.
              </span>
            )}
          </ul>
        </div>
      </div>
      {err && (
        <span className="text-defaultRed text-[12px] sm:text-sm">
          {errorMsg}
        </span>
      )}
    </>
  );
};

export { AvatarMultiSelect };