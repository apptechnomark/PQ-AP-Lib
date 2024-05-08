import { generateDate, months } from "./utils/datepickerUtility";
import React, { useEffect, useState, useRef } from "react";
import style from "./Datepicker.module.scss";

import ChevronLeftIcon from "./icons/ChevronLeft.js";
import CalendarIcon from "./icons/CalendarIcon.js";
import Typography from "../Typography/Typography";

interface DatepickerProps {
    startYear: number;
    endYear: number;
    value?: string;
    id: string;
    label?: string,
    className?: string,
    hasError?: boolean,
    errorMessage?: string;
    getValue: (value: any) => void;
    getError: (arg1: boolean) => void;
    validate?: boolean;
    disabled?: boolean;
    hideIcon?: boolean;
}
const DatepickerYear: React.FC<DatepickerProps> = ({
    value,
    startYear,
    endYear,
    label,
    validate,
    disabled,
    hasError,
    errorMessage = "This is required field!",
    getValue,
    getError,
    hideIcon,
    ...props }) => {
    const currentDate: Date = new Date();
    const inputRef = useRef(null);
    const valueDate = new Date(value ? value : "");

    const [today, setToday] = useState<Date>(value ? valueDate : currentDate);
    const [showMonthList, setShowMonthList] = useState<boolean>(false);
    const [showYearList, setShowYearList] = useState<boolean>(false);
    const [fullDate, setFullDate] = useState<string>(value ? value : "");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [toggleOpen, setToggleOpen] = useState<boolean>(false);
    const [animate, setAnimate] = useState<String>("");
    const [err, setErr] = useState<boolean>(false);
    const [focus, setFocus] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const currentMonth = today.getMonth();
    const [selectedMonth, setSelectedMonth] = useState<number>(value ? valueDate.getMonth() : currentMonth);

    const currentYear = today.getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(value ? valueDate.getFullYear() : currentYear);

    const yearsPerPage: number = 16;

    const totalPages: number = Math.ceil(
        (endYear - startYear + 1) / yearsPerPage
    );
    const startIndex: number = (currentPage - 1) * yearsPerPage;
    const displayedYears: number[] = Array.from(
        { length: yearsPerPage },
        (_, index) => {
            const year = startYear + startIndex + index;
            return year <= endYear ? year : null;
        }
    ).filter((year) => year !== null);

    const selectMonth = (month: number) => {
        const newDate = new Date(today);
        newDate.setMonth(month);
        setToday(newDate);
        setShowMonthList(false);
        setSelectedMonth(month);
        selectedMonth ? setAnimate(style.slideRightAnimation) : setAnimate("");
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        const formattedYear = selectedYear.toString();
        const updatedDate = `${formattedMonth}/${formattedYear}`;
        setFullDate(updatedDate);
        setToggleOpen(false);
        if (validate) {
            if (!newDate) {
                setErr(true);
                setErrorMsg("Please select a date.");
                getError(false);
            } else {
                setErr(false);
                setErrorMsg("");
                getError(true);
            }
        }
    };

    const toggleYearList = () => {
        setShowYearList(true);
        setAnimate("");
        if (!showYearList && !showMonthList) {
            setCurrentPage(Math.ceil((selectedYear - startYear + 1) / yearsPerPage));
        } else {
            setShowMonthList(false);
        }
    };

    const selectYear = (year: number) => {
        const newDate = new Date(today);
        newDate.setFullYear(year);
        setToday(newDate);
        setShowYearList(false);
        setSelectedYear(year);
        setTimeout(() => {
            setAnimate("");
            setShowMonthList(true);
        }, 0);
    };

    const goToNextPage = () => {
        currentPage < totalPages ? setCurrentPage(currentPage + 1) : currentPage;
    };
    const goToPreviousPage = () => {
        currentPage > 1 ? setCurrentPage(currentPage - 1) : currentPage;
    };

    const calendarShow = () => {
        setToggleOpen(true);
        setShowYearList(true);
    };

    useEffect(() => {
        setFullDate(value)
    }, [value])

    useEffect(() => {
        getValue(fullDate);
    }, [fullDate]);

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            const target = event.target;
            const isInputClick =
                inputRef.current && inputRef.current.contains(target);
            const isCalendarClick = target.closest(".bottomAnimation");
            if (!isInputClick && !isCalendarClick) {
                setToggleOpen(false);
            }
        };
        const handleMouseDown = (event: any) => {
            setTimeout(() => {
                handleOutsideClick(event);
            }, 0);
        };
        document.addEventListener("mousedown", handleMouseDown);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    const updateFromInput = (inputValue: string) => {
        const inputDate = new Date(inputValue);

        if (!isNaN(inputDate.getTime()) && inputDate.getFullYear().toString().length == 4) {
            setToday(inputDate);
            setToggleOpen(true);
            setShowYearList(true);
            setSelectedMonth(inputDate.getMonth());
            setSelectedYear(inputDate.getFullYear());
            const selectedYearPageIndex = Math.ceil((inputDate.getFullYear() - startYear + 1) / yearsPerPage);
            setCurrentPage(selectedYearPageIndex);
        } else {
            setToggleOpen(false);
        }
    };

    useEffect(() => {
        if (validate) {
            setFocus(hasError);
            setErrorMsg(errorMessage);
            setErr(hasError);
            hasError && getError(false);
        } else {
            getError(true);
            setFocus(hasError);
        }
    }, [validate, errorMessage, hasError]);


    const handleInputBlur = () => {
        if (fullDate === "" && validate) {
            setErr(true);
            setErrorMsg("Please select a date.");
            getError(true);
        }
    };

    const handleFocus = () => {
        setFocus(true);
    };

    return (
        <>
            {label && (
                <span className="flex">
                    <label
                        className={`text-[12px] py-1 ${err
                            ? "text-defaultRed"
                            : focus
                                ? "text-primary !font-normal"
                                : "text-slatyGrey !font-normal"
                            }`}
                    >
                        {label}
                    </label>
                    {validate && (
                        <span
                            className={` w-3 h-4 ${disabled ? "text-slatyGrey" : "text-defaultRed"}`}
                        >
                            &nbsp;*
                        </span>
                    )}
                </span>
            )}
            <div className={`relative flex`} ref={inputRef}>

                <input
                    type="text"
                    placeholder="mm/yyyy"
                    className={`text-[14px] py-[0.5px] w-full tracking-wider placeholder:tracking-wider font-proxima border-b placeholder:text-[14px] bg-transparent ${disabled
                        ? "border-lightSilver pointer-events-none"
                        : (toggleOpen && !err)
                            ? "border-primary placeholder:text-primary"
                            : fullDate
                                ? "border-primary"
                                : err
                                    ? "border-defaultRed text-defaultRed placeholder:text-defaultRed"
                                    : "text-darkCharcoal border-lightSilver hover:border-primary  transition-colors duration-300 ease-in-out"
                        } outline-none`}
                    onClick={calendarShow}
                    readOnly
                    defaultValue={fullDate}
                    onChange={(e: any) => updateFromInput(e.target.value)}
                    onBlur={handleInputBlur}
                    onFocus={handleFocus}
                    {...props}
                />
                {!hideIcon &&
                    <span  className="absolute right-0 bottom-0.5 cursor-pointer" onClick={calendarShow}>
                        <CalendarIcon bgColor={(toggleOpen && !err) ? "#02B89D" : err ? "#DC3545" : "#333333"} />
                    </span>}
            </div>

            {toggleOpen && (
                <div className="relative">
                    <div
                        className={`bottomAnimation absolute z-20  bg-white ${toggleOpen && style.bottomAnimation}`}>
                        <div className="flex mx-auto  items-center">
                            <div className="shadow-md overflow-hidden">
                                <div className="flex justify-between border-b-2 border-lightSilver py-[12px] px-[12px]">
                                    <div
                                        className={`flex flex-row  ${!showYearList && animate}`}>
                                        {showMonthList === true ? (
                                            <h1
                                                className={`font-proxima text-[14px] font-semibold ml-1 cursor-pointer text-slatyBlue`}
                                                onClick={toggleYearList}
                                            >
                                                {currentYear}
                                            </h1>
                                        ) : showYearList === true ? (
                                            <h1 className="font-proxima text-[14px] font-semibold ml-1 text-slatyBlue">
                                                {displayedYears[0] + " - " + displayedYears[displayedYears.length - 1]}
                                            </h1>
                                        ) : ""}
                                    </div>
                                    <div className={`flex items-center gap-5`}>
                                        <>
                                            {showYearList === true && currentPage <= totalPages && (
                                                <>
                                                    <div
                                                        className={`w-5 h-5 cursor-pointer hover:scale-105 transition-all text-darkGray ${currentPage === 1
                                                            ? "opacity-40 pointer-events-none"
                                                            : ""
                                                            } text-[20px]`}
                                                        onClick={() => {
                                                            if (currentPage === 1) {
                                                                return;
                                                            }
                                                            goToPreviousPage();
                                                        }}
                                                    >
                                                        <ChevronLeftIcon />
                                                    </div>
                                                    <div
                                                        className={`w-5 h-5 cursor-pointer hover:scale-105 transition-all text-darkGray ${currentPage === totalPages
                                                            ? "opacity-40 pointer-events-none"
                                                            : ""
                                                            } rotate-180 text-[20px]`}
                                                        onClick={() => {
                                                            if (currentPage === totalPages) {
                                                                return;
                                                            }
                                                            goToNextPage();
                                                        }}
                                                    >
                                                        <ChevronLeftIcon />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    </div>
                                </div>
                                {showMonthList === true ? (
                                    <div className="overflow-hidden">
                                        <div className={`${style.topAnimation}  w-full h-full`}>
                                            <div className="grid grid-cols-4 place-content-center overflow-hidden font-proxima">
                                                {months.map((month, index) => (
                                                    <div
                                                        key={index}
                                                        className={`py-[19.4px] w-[70px]  grid place-content-center text-sm text-textColor font-proxima relative cursor-pointer `}
                                                        onClick={() => selectMonth(index + 1)}
                                                    >
                                                        <div
                                                            className={`py-[20px]  px-5 text-sm hover:bg-lightGreen hover:text-primary transition-all duration-200 flex items-center justify-center rounded-md ${index === selectedMonth
                                                                ? "bg-lightGreen text-primary"
                                                                : ""
                                                                }`}
                                                        >
                                                            {month.length > 5 ? month.slice(0, 3) : month}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : showYearList === true && (
                                    <div className="overflow-hidden">
                                        <div className={`${animate} ${style.topAnimation}  w-full`}>
                                            <div className="grid grid-cols-4 grid-rows-4 place-content-center overflow-hidden font-proxima">
                                                {displayedYears.map((year) => (
                                                    <div
                                                        key={year}
                                                        className={`py-[9px] w-[70px] grid place-content-center text-sm text-textColor font-proxima relative cursor-pointer`}
                                                        onClick={() => selectYear(year)}
                                                    >
                                                        <div
                                                            className={`py-[18px] px-5 text-sm hover:bg-lightGreen hover:text-primary transition-all duration-200 flex items-center justify-center rounded-md ${year === selectedYear
                                                                ? "bg-lightGreen text-primary"
                                                                : ""
                                                                }`}
                                                        >
                                                            {year}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {err && (
                <span className="text-defaultRed text-[12px] sm:text-[14px]">
                    {errorMsg}
                </span>
            )}
        </>
    );
};
export { DatepickerYear };