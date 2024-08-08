import React, { useEffect, useRef, useState } from "react";

// Icons Componnents
import { Avatar } from "../Avatar/Avatar.js";
import CheckBox from "../Checkbox/Checkbox.js";
import Typography from "../Typography/Typography.js";
import ChevronDown from "./icons/ChevronDown.js";
import CrossIcon from "./icons/CrossIcon.js";
import styles from "./selectdropdown.module.scss";

interface MultiSelectChipProps {
  options: { value: string; label: string }[];
  defaultValue?: any[];
  onSelect: (selected: any[]) => void;
  id?: string;
  label?: string;
  type?: string;
  className?: string;
  required?: boolean;
  avatar?: boolean;
  avatarName?: string;
  avatarImgUrl?: string;
  errorMessage?: string;
  hasError?: boolean;
  getValue: (value: any) => void;
  getError: (arg1: boolean) => void;
  supportingText?: string;
  errorClass?: string;
  validate?: boolean;
  placeholder?: any;
  noborder?: boolean;
  hideIcon?: boolean;
}

const MultiSelectChip: React.FC<MultiSelectChipProps> = ({
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
  hideIcon,
  noborder,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchValue, setSearchInput] = useState<string>("");
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
      }, [errorMessage, hasError]);
  }

  useEffect(() => {
    defaultValue && setSelectedValues(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchInput("");
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleToggleOpen = () => {
    setSearchInput("");
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedValues((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
    getValue(selectedValues)
  };

  const handleSelect = (value: string) => {
    const selectedIndex = selectedValues.indexOf(value);
    let updatedSelected: string[];

    if (selectedIndex === -1) {
      // Value is not selected, add it to the selection
      const selectedOption = options.find((option) => option.value === value);
      updatedSelected = [
        ...selectedValues,
        selectedOption ? selectedOption.value : value,
      ];
    } else {
      // Value is already selected, remove it from the selection
      updatedSelected = [
        ...selectedValues.slice(0, selectedIndex),
        ...selectedValues.slice(selectedIndex + 1),
      ];
    }

    if (updatedSelected.length > 0) {
      setError(false);
      setErrMsg("");
      getError(true);
    }

    setSelectedValues(updatedSelected);
    getValue(updatedSelected);
    setFocusedIndex(-1);
  };


  const allOptionsSelected = options.every((option) =>
    selectedValues.includes(option.value)
  );

  const handleToggleAll = () => {
    if (allOptionsSelected) {
      setSelectedValues([]);
      getValue([]);
      setFocusedIndex(-1);
    } else {
      setError(hasError);
      const allOptionValues = options.map((option) => option.value);
      setSelectedValues(allOptionValues);
      getValue(allOptionValues.map((value) => value.toString()));
      setFocusedIndex(-1);
    }
  };

  const handleBlur = () => {
    if (validate) {
      if (searchValue.trim() === "") {
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
    if (
      e.key === "Enter" &&
      e.target instanceof HTMLElement &&
      e.target.tagName == "LI"
    ) {
      handleSelect(value);
    } else if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      setFocusedIndex(index - 1);
    } else if (e.key === "ArrowDown" && index < options.length - 1) {
      e.preventDefault();
      setFocusedIndex(index + 1);
    }
    else if (e.key === "Escape") {
      setFocusedIndex(-1);
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1 && (focusedIndex < options.length)) {
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
  };

  const selectedDisplay = selectedValues.length > 0 && (
    <div className="flex flex-row justify-center items-center">
      {selectedValues.slice(0, 2).map((selectedValue) => {
        const selectedOption = options.find(
          (option) => option.value === selectedValue
        );
        return (
          <div
            key={selectedValue}
            className={`flex items-center font-normal bg-[#E6E6E6] text-[#212529] border border-[#CED4DA] rounded-sm mr-[3px] ml-[1px] text-[14px] ${selectedOption?.label.length > 8 ? "max-w-[100px]" : ""
              }`}
          >
            <span className="px-0.5" title={selectedOption?.label}>
              {selectedOption?.label.length > 8
                ? selectedOption?.label.substring(0, 5) + "..."
                : selectedOption?.label}
            </span>

            <div
              onClick={() => handleSelect(selectedValue)}
              className="ml-1 text-[19px] pt-[1px] cursor-pointer"
            >
              <CrossIcon />
            </div>
          </div>
        );
      })}
      {selectedValues.length > 2 && (
        <div className="flex items-center h-[23px] bg-[#E6E6E6] text-darkCharcoal border border-[#CED4DA] font-normal rounded-sm px-1 text-[14px]">
          <label className="text-[19px] text-center place-content-center pt-0.5">+</label> <label className="pt-0.5">{selectedValues.length - 2}</label>
        </div>
      )}
    </div>
  );


  const handleKeyPress = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggleAll()
    }
  }

  return (
    <>
      <div className={`${styles.customScrollbar} relative font-medium w-full flex-row outline-none ${noborder ? "" : "border-b"} 
      ${isOpen
        ? "border-primary"
        : selectedValues.length > 0
        ? "border-lightSilver"
        : error
          ? "border-defaultRed"
          : `border-lightSilver`
        } ${noborder ? "" : "after:block"
        } absolute after:border-b after:mb-[-1px] after:border-primary after:scale-x-0 after:origin-left after:transition after:ease-in-out after:duration-1000 hover:after:scale-x-100 ${className}`}
        ref={selectRef}
      >
        {label && (
          <label
            className={`text-[12px] font-normal ${isOpen
              ? "text-primary"
              : selectedValues.length > 0
                ? "text-slatyGrey"
                : error
                  ? "text-defaultRed"
                  : "text-slatyGrey"
              }`}
            tabIndex={-1}
          >
            {label}
            {required && <span className="text-defaultRed">&nbsp;*</span>}
          </label>
        )}

        <div id={id} className={`flex relative flex-row ${label ? "mt-[7px]" : ""} items-center justify-center`}>
          <div className="w-full outline-none flex justify-evenly">
            <div className="min-w-fit flex flex-row pb-[1px]">
              {selectedDisplay}
            </div>
            <div className="w-full" tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter") && handleToggleOpen()
              }
            >
              <input
                tabIndex={-1}
                onBlur={handleBlur}
                onClick={handleToggleOpen}
                onChange={(e) => setSearchInput(e.target.value)}
                readOnly={!isOpen}
                placeholder={
                  isOpen && selectedValues.length === 0
                    ? placeholder
                    : selectedValues.length > 0
                      ? ""
                      : "Please select"
                }
                value={searchValue}
                className={`${isOpen && selectedValues.length > 0 ? "pl-0.5" : "pl-0"} ${error && "placeholder:text-defaultRed text-defaultRed"
                  } w-full  flex-grow bg-white outline-none text-darkCharcoal text-[14px] font-normal ${isOpen ? "text-primary" : ""
                  } ${!isOpen
                    ? "placeholder-darkCharcoal cursor-pointer"
                    : "placeholder-primary cursor-default"
                  }`}
                style={{ background: "transparent" }}
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>
          </div>
          {!hideIcon && (
            <div
              tabIndex={-1}
              onClick={handleToggleOpen}
              className={`${error && " text-defaultRed"
                } text-[1.5rem] transition-transform text-darkCharcoal cursor-pointer ${isOpen ? "rotate-180 text-primary duration-400" : "duration-200"
                }
              }`}
            >
              <ChevronDown />
            </div>
          )}
        </div>

        <ul
          className={`absolute z-10 w-full bg-pureWhite ${noborder ? "mt-[13px]" : "mt-[1px]"
            } overflow-y-auto shadow-md transition-transform ${isOpen
              ? "max-h-60 translate-y-0 transition-opacity opacity-100 duration-500"
              : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
            } ${isOpen ? "ease-out" : ""}`}
        >
          <label
            tabIndex={isOpen ? 0 : -1}
            className={`p-[10px] sticky top-0 z-[5] bg-pureWhite  text-[14px] font-normal text-primary cursor-pointer flex`}
            onClick={handleToggleAll}
            onKeyDown={(e: React.KeyboardEvent<HTMLLabelElement>) => handleKeyPress(e)}
          >
            {allOptionsSelected ? "Clear All" : "Select All"}
          </label>
          {options.length > 0 &&
            options.some((option) =>
              option.label.toLowerCase().startsWith(searchValue)
            ) ? (
            options.map((option, index) => (
              <li
                key={index}
                className={`p-[10px] outline-none focus:bg-whiteSmoke text-[14px] hover:bg-whiteSmoke font-normal cursor-pointer flex items-center ${selectedValues.includes(option.value) ? "bg-whiteSmoke" : ""
                  } ${!option.label.toLowerCase().startsWith(searchValue)
                    ? "hidden"
                    : ""
                  }`}
                onClick={() => {
                  if (option.value !== searchValue) {
                    handleSelect(option.value);
                  }
                }}
                onKeyDown={(e) => handleListItemKeyDown(e, option.value, index)}
                tabIndex={isOpen ? 0 : -1}
                ref={(el) => {
                  if (index === focusedIndex) {
                    el?.focus();
                  }
                }}
              >
                {avatar && (
                  <div tabIndex={-1} className="mr-2 flex-shrink-0 items-center text-[1.5rem] text-darkCharcoal">
                    <Avatar
                      variant="x-small"
                      name={avatarName}
                      imageUrl={avatarImgUrl}
                    />
                  </div>
                )}

                {type === "checkbox" && (
                  <CheckBox
                    tabIndex={-1}
                    id={option.value + Math.random()}
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {
                      handleCheckboxChange(option.value);
                    }}
                  />
                )}
                <label className="font-proxima text-sm cursor-pointer" tabIndex={-1}>{option.label}</label>
              </li>
            ))
          ) : (
            <span className="p-[10px] text-[15px] hover:bg-whiteSmoke font-medium cursor-pointer flex flex-row items-center space-x-2 ">
              No matching data found.
            </span>
          )}
        </ul>
      </div>

      {error && (
        <span
          tabIndex={-1}
          className={`text-defaultRed text-[12px] sm:text-[14px] ${errorClass}`}
        >
          {errMsg}
        </span>
      )}
    </>
  );
};

export { MultiSelectChip };