import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import Typography from '../Typography/Typography';
import ChevronDown from "./icons/ChevronDown";
import CrossIcon from "./icons/CrossIcon";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import RightIcon from "./icons/RightIcon";
import styles from "./DropdownList.module.scss";

interface SelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    options: { value: any; label: string; }[];
    className?: string;
    validate?: boolean;
    getValue: (value: any) => void;
    onFunctionCall?: any;
    getError: (arg1: boolean) => void;
    disabled?: boolean;
    btnLabel: string;
    value?: any;
    placeholder?: string;
    listPlaceholder?: string;
    maxLength?: number;
    minLength?: number;
    noNumeric?: boolean;
    noborder?: boolean;
    noSpecialChar?: boolean;
    noText?: boolean;
    regexPattern?: any;
    regexMessage?: string;
}

const DropdownList: React.FC<SelectProps> = ({
    id,
    getValue,
    label,
    options,
    className,
    validate,
    getError,
    onFunctionCall,
    disabled,
    btnLabel,
    value,
    placeholder = "Enter Label Name",
    listPlaceholder = "Add new list",
    maxLength,
    minLength,
    noText,
    noNumeric,
    noborder,
    noSpecialChar,
    regexPattern,
    regexMessage,
    ...props
}) => {
    const selectRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const [editList, setEditList] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [selectedOption, setSelectedOption] = useState<any>(value ? value : "");
    const [option, setOptions] = useState<any>([]);

    const [inputError, setInputError] = useState<boolean>(false);
    const [inputErrorMsg, setInputErrorMsg] = useState<string>("");


    useEffect(() => {
        if (options && options.length > 0) {
            setOptions(options);
        }
    }, []);

    const handleToggleOpen = () => {
        // setInputValue("");
        setIsOpen(!isOpen);
    };

    const handleBlur = () => {
        if (validate) {
            if (searchValue.trim() === "" && selectedOption.length === 0) {
                setError(true);
                setErrorMsg("Please select a valid option.");
                getError(false);
            } else {
                setError(false);
                setErrorMsg("");
                getError(true);
            }
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toLowerCase();
        setSearchValue(newValue);
    };

    const handleSelect = (value: any) => {
        if (!selectedOption.includes(value)) {
            setSelectedOption(value);
        }
        setInputValue("");
        setSearchValue("");
        setIsOpen(false);

        if (!value) {
            setError(true);
            getError(false);
            setErrorMsg("Please select a valid option.");
        } else {
            setError(false);
            setErrorMsg("");
            getValue(value);
            getError(true);
        }
        setFocusedIndex(-1);
    };

    const handleAddNewOption = () => {
        const inputValue = document.getElementById("newOptionInput") as HTMLInputElement;
        const newValue = inputValue.value;
        if (newValue.trim() === "") {
            setInputError(true);
            setInputErrorMsg("This is a required field!")
        } else {
            setInputError(false);
            const newOption = { label: newValue, value: newValue };
            setOptions(prevOptions => [...prevOptions, newOption]);
            inputValue.value = "";
        }
    };

    const handleInnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.trim();
        
        const checkRestriction = (regex: RegExp, errorMsg: string) => {
            if (regex.test(newValue)) {
                setInputError(true);
                setInputErrorMsg(errorMsg);
            } else {
                setInputValue(newValue);
                setInputError(false);
            }
        };
    
        if (noNumeric) {
            checkRestriction(/\d/, `Numeric characters not allowed.`);
        } else if (noText) {
            checkRestriction(/[a-zA-Z]/, `Alphabets not allowed.`);
        } else if (noSpecialChar) {
            checkRestriction(/[^a-zA-Z0-9\s]/, `Special characters not allowed.`);
        } else if (regexPattern) {
            checkRestriction(regexPattern, regexMessage);
        } else {
            setInputError(false);
            setInputValue(newValue);
            setInputErrorMsg("");
        }
    };

    const handleEditClick = (e: any, index: number) => {
        e.stopPropagation();
        setEditList(true);
        setActiveIndex(index);
        setInputValue(option.find((option, i) => i === index).label)
    }

    const handleEditChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleSaveEdit = (e: any) => {
        e.stopPropagation();
        setEditList(false)
        if (inputValue !== "" && activeIndex !== -1) {
            setOptions(prevOptions => prevOptions.map((option: any, index: number) => index === activeIndex ? { label: inputValue, value: inputValue } : { ...option }));
        }
    }

    const handleDeleteClick = (e: any, index: number) => {
        e.stopPropagation();
        const deletedValue = option[index].value;
        setOptions(prevOptions => prevOptions.filter((_, i) => i !== index));
        const optionExists = option.some(option => option.value === deletedValue);
        if (optionExists) {
            setSelectedOption("");
        }
        // setSelectedOption(prevSelected => prevSelected.filter(option => option !== deletedValue));
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
        } else if (e.key === "ArrowDown" && index < option.length - 1) {
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
        } else if (value.key === "ArrowDown" && focusedIndex < option.length - 1) {
            value.preventDefault();
            setFocusedIndex(focusedIndex + 1);
        }
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!selectRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchValue("");
            }
        };
        window.addEventListener("click", handleOutsideClick);
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <>
            <div
                className={`${styles.customScrollbar} relative font-medium w-full flex-row ${noborder ? '' : 'border-b'} ${disabled && "pointer-events-none"
                    } ${selectedOption.length > 0
                        ? "border-primary"
                        : error
                            ? "border-defaultRed"
                            : "border-lightSilver hover:border-primary transition-colors duration-300"
                    } ${className}`}
                ref={selectRef}
            >
                {label && (
                    <span className="flex">
                        <Typography
                            type="h6"
                            className={`${isOpen || selectedOption.length > 0 ? "text-primary"
                                : error
                                    ? "text-defaultRed"
                                    : "text-slatyGrey"
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

                <div className="flex -mt-1 flex-row items-center justify-center relative">
                    <input
                        id={id}
                        onBlur={handleBlur}
                        onClick={handleToggleOpen}
                        onChange={handleInputChange}
                        readOnly={!isOpen}
                        placeholder={`${!isOpen ? placeholder : selectedOption.length > 0 ? selectedOption : "Search"}`}
                        value={isOpen ? searchValue : selectedOption}
                        className={`w-full flex-grow bg-white outline-none text-sm placeholder:text-sm font-normal
                        ${isOpen ? "placeholder-primary" : error ? "placeholder-defaultRed" : "placeholder-slatyGrey"}
                        `}
                        style={{ background: "transparent" }}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <div
                        onClick={handleToggleOpen}
                        className={`text-[1.5rem] transition-transform  cursor-pointer  ${isOpen ? "rotate-180 text-primary duration-400" : "duration-200"} ${error ? "text-defaultRed" : "text-slatyGrey"}`}>
                        <ChevronDown />
                    </div>
                </div>

                <ul
                    className={`absolute  z-10 w-full bg-pureWhite mt-[1px] overflow-y-auto shadow-md transition-transform ${isOpen
                        ? "max-h-60 translate-y-0 transition-opacity opacity-100 duration-500 ease-out"
                        : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
                        } `}
                >
                    {option.length > 0 &&
                        option.some((option) =>
                            option.label.toLowerCase().startsWith(searchValue)
                        ) ? (
                        option.map((option, index) => (
                            <li
                                key={index}
                                className={`px-[10px] group outline-none justify-end focus:bg-whiteSmoke text-sm hover:bg-whiteSmoke font-normal cursor-pointer flex flex-row items-center space-x-2  ${!option.label.toLowerCase().startsWith(searchValue)
                                    ? "hidden"
                                    : ""
                                    } ${option.value === selectedOption && "bg-whiteSmoke"
                                    }`}
                                onKeyDown={(e) => {
                                    handleListItemKeyDown(e, option.value, index)
                                }}
                                tabIndex={0}
                                ref={(el) => {
                                    if (index === focusedIndex) {
                                        el?.focus();
                                    }
                                }}
                            >
                                <div className='w-full py-1'>
                                    {editList && index === activeIndex
                                        ? <input
                                            value={inputValue}
                                            onChange={(e) => handleEditChange(e)}
                                            autoFocus={editList}
                                            onFocus={e => e.currentTarget.select()}
                                            className="bg-white cursor-pointer outline-none  p-2 w-full"
                                            style={{ background: "transparent" }}
                                        />
                                        : <div onClick={() => { !editList && handleSelect(option.value) }}>
                                            <Typography type='h5' className='p-2 font-normal' >{option.label}</Typography></div>
                                    }
                                </div>
                                {editList && index === activeIndex ?
                                    <div className={`${index === activeIndex ? "flex" : "hidden"} gap-2.5  group-hover:flex  group-hover:translate-all group-hover:duration-700  group-hover:ease-out `}>
                                        <div className='py-1' onClick={(e) => { handleSaveEdit(e) }}><RightIcon /></div>
                                        <div className='py-1' onClick={() => setEditList(false)}><CrossIcon /></div>
                                    </div>
                                    : <div className='hidden gap-2.5  group-hover:flex  group-hover:translate-all group-hover:duration-700  group-hover:ease-out '>
                                        <div className='py-1' onClick={(e) => { handleEditClick(e, index) }}><EditIcon /></div>
                                        <div className='py-1' onClick={(e) => { handleDeleteClick(e, index) }}><DeleteIcon /></div>
                                    </div>
                                }
                            </li>
                        ))) : (
                        <span className="p-[10px] focus:bg-whiteSmoke text-[15px] hover:bg-whiteSmoke font-normal cursor-pointer flex flex-row items-center space-x-2 ">
                            No data found.
                        </span>
                    )}
                    <li
                        className={`w-full flex sticky bottom-0 shadow-inner bg-pureWhite gap-2 focus:bg-whiteSmoke 
                    text-sm p-2.5 font-normal cursor-pointer`}
                    >
                        <div className='grow '>
                            <input
                                id="newOptionInput"
                                maxLength={maxLength}
                                minLength={minLength}
                                placeholder={listPlaceholder}
                                onChange={handleInnerInputChange}
                                value={inputValue}
                                className={`w-full  border-b h-[38px]  outline-none text-sm placeholder:text-sm font-normal  ${inputError ? "text-defaultRed placeholder-defaultRed border-defaultRed" : "text-darkCharcoal placeholder-darkCharcoal border-lightSilver  placeholder:opacity-50"}`}
                            />
                            {inputError && (
                                <span className="text-defaultRed text-[12px] sm:text-sm">
                                    {inputErrorMsg}
                                </span>
                            )}
                        </div>
                        <div className=''>
                            <Button className="rounded-md outline-none" variant="btn-primary" onClick={() => {
                                handleAddNewOption(),
                                    onFunctionCall && onFunctionCall()
                            }
                            }>
                                {btnLabel}
                            </Button>
                        </div>
                    </li>
                </ul >
            </div>
            {error && (
                <span className="text-defaultRed text-[12px] sm:text-sm">
                    {errorMsg}
                </span>
            )}
        </>
    )
}

export { DropdownList };
