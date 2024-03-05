import React, { useEffect, useRef, useState } from "react";
import Typography from "../Typography/Typography";
import style from "./Datepicker.module.scss";
import CalendarIcon from "./icons/CalendarIcon.js";
import ChevronLeftIcon from "./icons/ChevronLeft.js";
import { generateDate, months } from "./utils/datepickerUtility";

interface DatepickerDate {
    date: Date;
    currentMonth: boolean;
    today: boolean;
}

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
    format?: "dd/mm/yyyy" | "mm/dd/yyyy";
    hideIcon?: boolean;
}

const Datepicker: React.FC<DatepickerProps> = ({
    value,
    startYear,
    endYear,
    label,
    validate,
    disabled,
    hasError,
    errorMessage = "This is required field!",
    format = "mm/dd/yyyy",
    hideIcon,
    getValue,
    getError,
    ...props }) => {
    const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate: Date = new Date();
    const inputRef = useRef(null);
    const valueDate = new Date(value ? value : "");

    const [today, setToday] = useState<Date>(value ? valueDate : currentDate);
    const [showMonthList, setShowMonthList] = useState<boolean>(false);
    const [showYearList, setShowYearList] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(value ? valueDate : currentDate);
    const [fullDate, setFullDate] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [toggleOpen, setToggleOpen] = useState<boolean>(false);
    const [animate, setAnimate] = useState<string>("");
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

    useEffect(() => {
        const newValueDate = new Date(value ? value : "");
        setSelectedDate(value ? newValueDate : currentDate)
        setFullDate(value)
        let month = value ? newValueDate.getMonth() : currentMonth
        selectMonth(month)
        setSelectedYear(value ? newValueDate.getFullYear() : currentYear)
    }, [value])

    const toggleMonthList = () => {
        setAnimate("");
        setShowMonthList(!showMonthList);
    };
    const selectMonth = (month: number) => {
        setAnimate(style.slideRightAnimation)
        const newDate = new Date(today);
        newDate.setMonth(month);
        setToday(newDate);
        setShowMonthList(false);
        setSelectedMonth(month);
        selectedMonth ? setAnimate(style.slideRightAnimation) : setAnimate("");
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
            setShowMonthList(true);
            setAnimate("");
        }, 0);
    };

    const handleDateClick = (date: Date) => {
        const newDate = new Date(date);
        setToday(newDate);
        setSelectedDate(date);
        newDate.setDate(date.getDate() + 1);
        const formattedDate = newDate.toISOString().slice(0, 10).split("-");
        const updatedDate = format === "mm/dd/yyyy"
            ? `${formattedDate[1]}/${formattedDate[2]}/${formattedDate[0]}`
            : `${formattedDate[2]}/${formattedDate[1]}/${formattedDate[0]}`;
        setFullDate(updatedDate);
        setToggleOpen(false);
        if (date.getMonth() < selectedMonth) {
            handleIconClick(false);
        }
        if (date.getMonth() > selectedMonth) {
            handleIconClick(true);
        }
        setAnimate("");
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

    const goToNextPage = () => {
        currentPage < totalPages ? setCurrentPage(currentPage + 1) : currentPage;
    };

    const goToPreviousPage = () => {
        currentPage > 1 ? setCurrentPage(currentPage - 1) : currentPage;
    };

    const calendarShow = () => {
        setToggleOpen(true);
        setToday(selectedDate)
    };

    const handleIconClick = (isNextMonth: boolean) => {
        const newDate = new Date(today);
        let year = newDate.getFullYear();
        if (isNextMonth) {
            const month = (selectedDate.getMonth() + 1) % 12;
            newDate.setMonth(newDate.getMonth() + 1);
            setSelectedMonth(month);
            if (month === 0) {
                year++;
            }
        } else {
            const month = (selectedDate.getMonth() - 1 + 12) % 12;
            newDate.setMonth(newDate.getMonth() - 1);
            setSelectedMonth(month);
            if (month === 11) {
                year--;
            }
        }
        setSelectedYear(year);
        setToday(newDate);
        setAnimate(
            isNextMonth ? style.slideRightAnimation : style.slideLeftAnimation
        );
        setTimeout(() => {
            setAnimate("");
        }, 100);
    };

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            const target = event.target;
            const isInputClick = inputRef.current && inputRef.current.contains(target);
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
            const formattedDate = inputDate.toISOString().slice(0, 10);
            setToggleOpen(true);
            setToday(inputDate);
            setSelectedDate(inputDate);
            setSelectedMonth(inputDate.getMonth());
            setSelectedYear(inputDate.getFullYear());
            setFullDate(formattedDate);
        } else {
            setToggleOpen(false);
        }
    };

    useEffect(() => {
        if (validate) {
            setFocus(hasError);
            setErrorMsg(errorMessage);
            setErr(hasError);
            getError(false);
        } else {
            getError(true);
            setFocus(hasError);
        }
    }, [validate, errorMessage, hasError]);

    useEffect(() => {
        getValue(fullDate);
    }, [fullDate]);

    const handleInputBlur = () => {
        if (validate && fullDate === "") {
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
                    <Typography
                        type="h6"
                        className={` ${err
                            ? "text-defaultRed"
                            : focus
                                ? "text-primary !font-normal"
                                : "text-slatyGrey !font-normal"
                            }`}
                    >
                        {label}
                    </Typography>
                    {validate && (
                        <span
                            className={` w-3 h-4 ${disabled ? "text-slatyGrey" : "text-defaultRed"}`}
                        >
                            &nbsp;*
                        </span>
                    )}
                </span>
            )}
            <div
                className={`relative`}
                ref={inputRef}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && calendarShow()}
            >
                <input
                    type="text"
                    placeholder={format}
                    className={`text-[14px] py-[1px] w-full tracking-wider placeholder:tracking-wider font-proxima border-b placeholder:text-[14px] bg-transparent
                    ${disabled
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
                    tabIndex={-1}
                    {...props}
                />
                {!hideIcon &&
                    <span className={`absolute right-1 bottom-1 cursor-pointer`} onClick={calendarShow}>
                        <CalendarIcon bgColor={err ? "#DC3545" : focus ? "#02B89D" : "#333333"} />
                    </span>}
            </div>
            {toggleOpen && (
                <div className="relative">
                    <div className={`bottomAnimation absolute z-10  bg-pureWhite ${toggleOpen ? style.bottomAnimation : ""}`}
                    >
                        <div className="flex mx-auto  items-center">
                            <div className="shadow-md overflow-hidden">
                                <div className="flex justify-between border-b-2 border-lightSilver py-[12px] px-[12px]">
                                    <div
                                        className={`flex flex-row  ${showYearList ? "" : animate}`}
                                    >
                                        {showMonthList === true ? (
                                            ""
                                        ) : showYearList === true ? (
                                            ""
                                        ) : (
                                            <h1
                                                className="font-proxima text-sm font-semibold cursor-pointer text-slatyBlue"
                                                onClick={toggleMonthList}
                                            >
                                                {months[currentMonth]}
                                            </h1>
                                        )}
                                        {showYearList === true && showMonthList === false ? (
                                            <h1 className="font-proxima text-sm font-semibold ml-1 text-slatyBlue">
                                                {displayedYears[0] + " - " + displayedYears[displayedYears.length - 1]}
                                            </h1>
                                        ) : (
                                            <h1
                                                className={`font-proxima text-sm font-semibold ml-1 cursor-pointer text-slatyBlue`}
                                                onClick={toggleYearList}
                                            >
                                                {currentYear}
                                            </h1>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-5`}>
                                        {showYearList === false ? (
                                            <>
                                                <div
                                                    className={`w-5 h-5 cursor-pointer hover:scale-105 transition-all text-darkGray
                                                    ${(currentYear > startYear || (currentMonth > 0))
                                                            ? ""
                                                            : "opacity-40 pointer-events-none"
                                                        }
                                                        ${showMonthList ? "hidden" : ""
                                                        } text-[20px]`}
                                                    onClick={() => handleIconClick(false)}
                                                >
                                                    <ChevronLeftIcon />
                                                </div>
                                                <div
                                                    className={`w-5 h-5 cursor-pointer hover:scale-105 transition-all text-darkGray
                                                    ${(currentYear + 1) <= endYear || (currentMonth < 11)
                                                            ? ""
                                                            : "opacity-40 pointer-events-none"
                                                        }
                                                    ${showMonthList ? "hidden" : ""
                                                        } rotate-180 text-[20px]`}
                                                    onClick={() => handleIconClick(true)}
                                                >
                                                    <ChevronLeftIcon />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {currentPage <= totalPages && (
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
                                                            className={`w-5 h-5 cursor-pointer hover:scale-105 transition-all text-darkGray
                                                             ${currentPage === totalPages
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
                                        )}
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
                                                        onClick={() => selectMonth(index)}
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
                                ) : showYearList === true ? (
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
                                ) : (
                                    <>
                                        <div
                                            className={`w-full grid grid-cols-7 font-proxima  ${animate}`}
                                        >
                                            {days.map((day, index) => (
                                                <h1
                                                    key={index}
                                                    className="h-14 grid place-content-center text-[12px]"
                                                >
                                                    {day}
                                                </h1>
                                            ))}
                                        </div>
                                        <div
                                            className={`w-full h-full grid grid-cols-7 ${animate}`}
                                        >
                                            {generateDate(today.getMonth(), today.getFullYear()).map(
                                                (
                                                    { date, currentMonth }: DatepickerDate,
                                                    index: number
                                                ) => {
                                                    const currentDate = new Date(date);
                                                    const isSameDay =
                                                        currentDate.getDate() === selectedDate.getDate() &&
                                                        currentDate.getMonth() ===
                                                        selectedDate.getMonth() &&
                                                        currentDate.getFullYear() ===
                                                        selectedDate.getFullYear();
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="h-full w-full grid place-content-center text-sm text-textColor font-proxima relative "
                                                            onClick={() => handleDateClick(currentDate)}
                                                        >
                                                            <h1
                                                                className={`h-[40px] w-[40px] grid place-content-center rounded-full cursor-pointer z-10
                                                                ${currentMonth ? "" : "text-[#cbd5e0] "}
                                                                     ${isSameDay&&currentMonth
                                                                        ? " bg-primary text-white"
                                                                        : "hover:bg-whiteSmoke"
                                                                    }`}>
                                                                {currentDate.getDate()}
                                                            </h1>
                                                            {(isSameDay&&currentMonth) && (
                                                                <>
                                                                    <span className="absolute flex inset-0 rounded-full overflow-visible">
                                                                        <span
                                                                            className={`${style.rippleAnimation} absolute rounded-full bg-primary opacity-50`}
                                                                        ></span>
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {err && (
                <span className="text-defaultRed text-[12px] sm:text-sm">
                    {errorMsg}
                </span>
            )}
        </>
    );
};
export { Datepicker };