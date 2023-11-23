import React, { useRef, useEffect, useState } from "react";
import { Avatar, AvatarGroup } from "../Avatar/Avatar.js";
import CheckBox from "../Checkbox/Checkbox.js";
import ChevronDown from "./icons/ChevronDown.js";
import Search from "./icons/Search.js";
import Typography from "../Typography/Typography.js";
import styles from "./CompanyList.module.scss";

interface CompanyListProps {
    id: string;
    options: { value: string; label: string; imageUrl?: string }[];
    label?: string;
    className?: string;
    required?: boolean;
    defaultValue?: string;
    errorMessage?: string;
    hasError?: boolean;
    getValue: (value: any) => void;
    getError: (arg1: boolean) => void;
    validate?: boolean;
    placeholder?: any;
    noborder?: boolean;
    showAvatar?: number;
    disabled?: boolean;
    type?:"avatar"|"text";
    checkbox?: boolean;
    variant?: "user"|"company";
    values?: any;
}
const CompanyList: React.FC<CompanyListProps> = ({
    id,
    options,
    values,
    label,
    className,
    required,
    defaultValue,
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
    type="avatar",
    checkbox = true,
    ...props
}) => {
    const selectRef = useRef<HTMLDivElement>(null);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
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
        if (values && values.length > 0) {
            setSelectedValues(values);
        }
    }, [values]);
    
    const handleSelect = (value: string) => {
        const updatedValues = [...selectedValues];
        const index = updatedValues.indexOf(value);
        if (index > -1) {
            updatedValues.splice(index, 1);
        } else {
            updatedValues.push(value);
        }
        if (validate) {
            if (updatedValues.length === 0) {
                setErr(true);
                setErrorMsg("Please select at least one option.");
                getError(false);
            } else {
                setErr(false);
                setErrorMsg("");
                getError(true);
            }
        }
        setInputValue("");
        setSelectedValues(updatedValues);
        setFocusedIndex(-1);
        getValue(updatedValues);
    };

    const handleCheckboxChange = (value: string) => {
        setSelectedValues((prevSelected) => {
            if (prevSelected.includes(value)) {
                return prevSelected.filter((item) => item !== value);
            } else {
                return [...prevSelected, value];
            }
        });
    };

    const updatedAvatars = selectedValues.map((value, index) => {
        const option = options.find((item) => item.value == value);
        return (
            <Avatar
                key={index}
                name={option ? option.label : ''}
                variant="small"
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

    return (
        <>
            <div
                className={`relative font-medium ${noborder ? "" : "border-b"
                    } ${className} ${styles.customScrollbar}
            ${disabled
                        ? "border-lightSilver"
                        : isOpen
                            ? "border-primary"
                            : inputValue
                                ? "border-primary"
                                : err
                                    ? "border-defaultRed"
                                    : "border-lightSilver hover:border-primary transition-colors duration-300"
                    }`}
                ref={selectRef}
            >
                {label && (
                    <span className="flex">
                        <Typography
                            type="h6"
                            className={`${err
                                ? "text-defaultRed"
                                : focus
                                    ? "text-primary"
                                    : "text-slatyGrey dark:text-pureWhite"
                                }`}
                        >
                            {label}
                        </Typography>
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
                    className={`flex items-center transition-height duration-200 ease-out cursor-pointer ${disabled && "pointer-events-none"
                        } ${selectedValues.length > 0 &&type=="avatar" ? "h-[42px]" : "h-[25px]"}`}
                    onClick={handleToggleOpen}
                >
                    {selectedValues.length > 0 ? (
                        <>
                        {type=="avatar"&&<AvatarGroup variant="small" show={showAvatar}>
                            {updatedAvatars}
                        </AvatarGroup>}
                        {type=="text"&&<Typography type="h6">  {selectedValues.length > 0
                        && `${selectedValues.length} selected.`} </Typography>}
                        </>
                    ) : (
                        <Typography
                            type="h6"
                            className={`!font-normal dark:text-pureWhite ${err && "text-defaultRed"} ${disabled && "text-slatyGrey dark:text-pureWhite"
                                } select-none`}
                        >
                            {isOpen ? "" :defaultValue?defaultValue: "Please Select"}
                        </Typography>
                    )}
                    <div
                        onClick={handleToggleOpen}
                        className={`ml-1 text-[1.5rem]  absolute right-0 transition-transform ${err
                            ? "text-defaultRed"
                            : disabled
                                ? "text-slatyGrey"
                                : "text-darkCharcoal dark:text-pureWhite"
                            }  cursor-pointer   ${isOpen ? "rotate-180 text-primary duration-400" : "duration-200"
                            }}`}
                    >
                        <ChevronDown />
                    </div>
                </div>
                <div>
                    <ul
                        className={`absolute z-10 w-full bg-pureWhite dark:bg-[#1f2937] mt-[1px] overflow-y-auto shadow-md transition-transform ${isOpen
                            ? "max-h-60 translate-y-0 transition-opacity opacity-100 duration-500"
                            : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
                            } ${isOpen ? "ease-out" : ""}`}
                    >
                        <li
                            className={`sticky top-0 z-[3] bg-pureWhite outline-none focus:bg-whiteSmoke p-[10px] text-sm font-normal cursor-pointer flex items-center`}
                        >
                            <div className={`flex absolute  ${variant === "user" ? "left-3" : "left-2"}`}>
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
                                className={`dark:placeholder:text-pureWhite text-sm placeholder:text-sm  w-full pl-6 py-1 ${variant === "user" ? "border rounded" : "border-b"} border-lightSilver flex-grow outline-none font-normal ${isOpen ? "text-primary" : ""
                                    } ${!isOpen ? "cursor-pointer" : "cursor-default"} ${!isOpen ? "placeholder-darkCharcoal" : "placeholder-primary"
                                    }`}
                                style={{ background: "transparent" }}
                            />
                        </li>
                        {options.length > 0 &&
                            options.some((option) =>
                                option.label.toLowerCase().startsWith(inputValue)
                            ) ? (
                            options.map((option, index) => (
                                <li
                                    key={option.value + index}
                                    className={`outline-none focus:bg-whiteSmoke dark:focus:bg-secondaryGray dark:hover:bg-secondaryGray p-[10px] text-sm hover:bg-whiteSmoke font-normal cursor-pointer flex items-center ${selectedValues.includes(option.value)
                                        && ""}
                                        ${!option.label.toLowerCase().startsWith(inputValue)
                                            ? "hidden"
                                            : ""
                                        }`}
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
                                    {checkbox &&
                                        <CheckBox
                                            id={option.value}
                                            checked={selectedValues.includes(option.value)}
                                            onChange={() => {
                                                handleCheckboxChange(option.value);
                                            }}
                                        />}
                                    <div className="mx-2 flex-shrink-0 items-center text-[1.5rem] text-darkCharcoal">
                                        <Avatar
                                            variant="small"
                                            name={option.label}
                                            imageUrl={option.imageUrl}
                                        />
                                    </div>
                                    <Typography type="h6" className="dark:text-pureWhite">{option.label}</Typography>
                                </li>
                            ))
                        ) : (
                            <span className="p-[10px] focus:bg-whiteSmoke dark:focus:bg-secondaryGray dark:text-pureWhite text-[15px] hover:bg-whiteSmoke dark:hover:bg-secondaryGray font-medium cursor-pointer flex flex-row items-center space-x-2 ">
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

export { CompanyList };