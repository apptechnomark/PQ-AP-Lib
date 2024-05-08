import React, { useEffect, useRef, useState } from 'react';
import CalendarIcon from "./icons/CalendarIcon.js";
import ChevronLeftIcon from "./icons/ChevronLeft.js";
import style from "./scss/Datepicker.module.scss";
import { days, generateDaysArray } from './utils/datepickerUtility.js';

interface DatePickerProps {
    startYear?: number;
    endYear?: number;
    value?: string;
    id: string;
    label?: string,
    inputClass?: string,
    calendarClass?: string,
    hasError?: boolean,
    errorMessage?: string;
    validate?: boolean;
    disabled?: boolean;
    hideIcon?: boolean;
    format?: "dd/mm/yyyy" | "mm/dd/yyyy";
    getValue: (date: string) => void;
    getError: (arg1: boolean) => void;
}

const DatepickerRangeExpanded: React.FC<DatePickerProps> = ({
    id,
    startYear,
    endYear,
    value,
    label,
    validate,
    disabled,
    hasError,
    errorMessage = "This is required field!",
    hideIcon,
    format = "mm/dd/yyyy",
    inputClass,
    calendarClass,
    getValue,
    getError,
    ...props }) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const [animate, setAnimate] = useState<string>("");

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [hoveredDates, setHoveredDates] = useState<Date[]>([]);
    const [datesInRange, setDatesInRange] = useState<Date[]>([]);
    const [displayDates, setDisplayDates] = useState<string>('');

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [errMessage, setErrMessage] = useState<string>("");

    const daysInMonth = generateDaysArray(currentDate);

    useEffect(() => {
        if (validate) {
            setErrMessage(errorMessage);
            setError(hasError);
        }
    }, [validate, errorMessage, hasError]);

    const handleInputBlur = () => {
        if (displayDates == "" && validate) {
            setError(true);
            setErrMessage("Please select a date.");
        }
    };

    useEffect(() => {
        if (error) {
            getError(true);
        } else {
            getError(false);
        }
    }, [error])

    const parseDateRange = (dateRangeString) => {
        const [startDateString, endDateString] = dateRangeString.split(" to ");

        const parseDateString = (dateString: string) => {
            if (format === "dd/mm/yyyy") {
                const [startDay, startMonth, startYear] = dateString.split("/");
                return new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
            } else {
                const [startMonth, startDay, startYear] = dateString.split("/");
                return new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
            }
        };

        const startDate = parseDateString(startDateString);
        const endDate = parseDateString(endDateString);

        return { startDate, endDate };
    };

    const setCurrentDateFromStartDate = () => {
        if (startDate) {
            setCurrentDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
        }
    };

    const formattedDisplayDates = (startDate: Date | null, endDate: Date | null, format: "dd/mm/yyyy" | "mm/dd/yyyy" = "dd/mm/yyyy") => {
        if (startDate && endDate) {
            setDisplayDates(`${formatDate(startDate, format)} to ${formatDate(endDate, format)}`);
        } else {
            setDisplayDates("");
        }
    };

    useEffect(() => {
        if (value) {
            const { startDate, endDate } = parseDateRange(value);
            setStartDate(startDate);
            setEndDate(endDate);
            formattedDisplayDates(startDate, endDate, format);
            // setDisplayDates(`${startDate.toLocaleDateString('en-GB')} to ${endDate.toLocaleDateString('en-GB')}`)
            setCurrentDateFromStartDate();
        }
    }, [value]);

    const calendarShow = () => {
        setIsCalendarOpen(!isCalendarOpen);
        if (!isCalendarOpen) {
            setCurrentDateFromStartDate();
        }
    };

    const handlePrevMonth = () => {
        setAnimate(style.slideLeftAnimation);
        setTimeout(() => {
            setAnimate("");
        }, 100);
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
    };

    const handleNextMonth = () => {
        setAnimate(style.slideRightAnimation);
        setTimeout(() => {
            setAnimate("");
        }, 100);
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        setCurrentDate(nextMonth);
    };

    const getNextMonthDate = () => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    };

    const getNextMonthDays = () => {
        const nextMonthDate = getNextMonthDate();
        const daysInNextMonth = generateDaysArray(nextMonthDate);
        return daysInNextMonth;
    };

    const handleDateHover = (date: Date) => {
        if (startDate && !endDate) {
            const hoveredDates = [];
            let currentDate = new Date(startDate);
            while (currentDate <= date) {
                hoveredDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            setHoveredDates(hoveredDates);
        }
    };

    const handleMouseOut = () => {
        if (!endDate) {
            setHoveredDates([]);
        }
    };

    const handleDateClick = (date: Date) => {
        if (!startDate) {
            setStartDate(date);
            setError(false)
        } else if (!endDate) {
            if (date >= startDate) {
                setEndDate(date);

                const datesInRange = [];
                let currentDate = new Date(startDate);
                while (currentDate <= date) {
                    datesInRange.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                setDatesInRange(datesInRange);
                setHoveredDates([])
                formattedDisplayDates(startDate, date, format);
                setIsCalendarOpen(false);
                setError(false)
            } else {
                setStartDate(date);
                setEndDate(null);
                setDatesInRange([]);
            }
        } else {
            setStartDate(date);
            setEndDate(null);
            setDatesInRange([]);
            setHoveredDates([])
        }
    };

    const isDateSelected = (date: Date) => {
        return (
            (startDate && date.toDateString() === startDate.toDateString()) ||
            (endDate && date.toDateString() === endDate.toDateString())
        );
    };

    // Handle Outside Click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    useEffect(() => {
        getValue(displayDates);
    }, [displayDates])

    const formatDate = (date: Date, format: "dd/mm/yyyy" | "mm/dd/yyyy" = "dd/mm/yyyy") => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        if (format === "dd/mm/yyyy") {
            return `${day}/${month}/${year}`;
        } else {
            return `${month}/${day}/${year}`;
        }
    };

    return (<>
        {label && (
            <span className="flex">
                <label
                    className={`text-[12px] py-[5px] font-normal ${error
                        ? "text-defaultRed"
                        : isCalendarOpen
                            ? "text-primary"
                            : "text-slatyGrey"
                        }`}
                    tabIndex={-1}
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

        <div id={id} className="w-full relative" ref={inputRef}>
            <div className="flex w-full relative ">
                <input
                    className={` ${inputClass} w-full text-[14px] placeholder:text-[14px] tracking-wider py-1 outline-none cursor-pointer text-darkCharcoal border-b ${disabled
                        ? "border-lightSilver pointer-events-none" : error
                            ? "placeholder:text-defaultRed border-defaultRed"
                            : isCalendarOpen
                                ? "placeholder:text-primary border-primary"
                                : "placeholder:text-slatyGrey border-lightSilver hover:border-primary"
                        }`}
                    type="text"
                    style={{ background: "transparent" }}
                    placeholder={`${format} to ${format}`}
                    onClick={calendarShow}
                    onBlur={handleInputBlur}
                    value={displayDates}
                    readOnly
                    {...props}
                />
                {!hideIcon &&
                    <span
                        tabIndex={-1}
                        className="absolute right-0 bottom-0.5 cursor-pointer"
                        onClick={calendarShow}
                    >
                        <CalendarIcon bgColor={(isCalendarOpen && !error) ? "#02B89D" : error ? "#DC3545" : "#333333"} />
                    </span>}
            </div>

            <div className={`${calendarClass} absolute ${isCalendarOpen ? "min-w-fit visible" : "w-auto hidden"} bg-pureWhite flex top-10 z-[5]`} style={{ boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <div className={`z-[5] ${isCalendarOpen ? "visible" : "hidden"}`}>
                    <div className='w-fit flex overflow-hidden'>
                        <div className={`w-[294px] h-fit border-r border-lightSilver  `}>
                            <div className={`flex w-full mb-[14px] h-10 justify-center items-center border-b-2 border-lightSilver`}>
                                <span className='w-5 h-5 mx-2 cursor-pointer hover:scale-105 transition-all text-darkGray text-[20px]' onClick={handlePrevMonth}><ChevronLeftIcon /></span>
                                <label className={`select-none font-proxima w-full text-center text-sm font-semibold  text-slatyBlue ${animate}`}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</label>
                            </div>
                            <div className={`px-1 pb-1 grid w-full grid-cols-7 grid-rows-6 gap-[5px] gap-y-[5px] ${animate}`}>
                                {days.map((day, index) => (
                                    <label key={index} className="select-none w-[38px] text-center place-content-center text-[14px] font-proxima">
                                        {day}
                                    </label>
                                ))}
                                {daysInMonth.map((day) => {
                                    const isCurrentMonthDays = day.getMonth() === currentDate.getMonth() && day.getFullYear() === currentDate.getFullYear();
                                    const today = new Date();
                                    const isCurrentDate = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear() && isCurrentMonthDays;
                                    const isSelectedDate = isDateSelected(day);
                                    const isHoveredDate = hoveredDates.some(d => d.toDateString() === day.toDateString());
                                    const isDateInRange = datesInRange.some(d => d.toDateString() === day.toDateString());

                                    return <label key={day.toISOString()}
                                        className={`relative select-none ${isCurrentMonthDays ? "" : "opacity-0 pointer-events-none"}
                                    ${isSelectedDate ? "bg-primary font-semibold text-white border-none"
                                                : (!startDate && !endDate && isCurrentDate) ? "bg-primary font-semibold text-white"
                                                    : (startDate && isCurrentDate) ? `border ${isDateInRange ? "bg-[#B6EEE5] border-primary font-semibold" : "bg-whiteSmoke border-lightSilver"} ` : isHoveredDate && !endDate
                                                        ? "border border-dashed border-primary"
                                                        : isDateInRange
                                                            ? "bg-[#B6EEE5] font-semibold"
                                                            : "hover:bg-whiteSmoke"}
                                                        cursor-pointer h-[38px] w-[38px] rounded-full text-center place-content-center text-[14px] font-proxima`}
                                        onClick={() => handleDateClick(day)}
                                        onMouseEnter={() => handleDateHover(day)}
                                        onMouseLeave={handleMouseOut}
                                    >
                                        {day.getDate()}
                                        {(isSelectedDate || (!startDate && !endDate && isCurrentDate)) && <span className={`${style.rippleAnimation} absolute rounded-full w-5 h-5 top-[9px] left-[9px] bg-primary opacity-50`} />}
                                    </label>
                                })}
                            </div>
                        </div>
                        <div className={`w-[294px] h-fit border-r border-lightSilver  `}>
                            <div className={`flex w-full mb-[14px] h-10 justify-center items-center border-b-2 border-lightSilver`}>
                                <label className={`select-none font-proxima w-full text-center text-sm font-semibold  text-slatyBlue ${animate}`}>{getNextMonthDate().toLocaleString('default', { month: 'long', year: 'numeric' })}</label>
                                <span className='w-5 h-5 mx-2 cursor-pointer hover:scale-105 transition-all text-darkGray rotate-180 text-[20px]' onClick={handleNextMonth}><ChevronLeftIcon /></span>
                            </div>
                            <div className={`px-1 pb-1 grid w-full grid-cols-7 grid-rows-6 gap-[5px] gap-y-[5px] ${animate}`}>
                                {days.map((day, index) => (
                                    <label key={index} className="select-none w-[38px] text-center place-content-center text-[14px] font-proxima">
                                        {day}
                                    </label>
                                ))}
                                {getNextMonthDays().map((day) => {
                                    const isNextMonthDays = day.getMonth() === getNextMonthDate().getMonth() && day.getFullYear() === getNextMonthDate().getFullYear();
                                    const today = new Date();
                                    const isCurrentDate = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
                                    const isSelectedDate = isDateSelected(day);
                                    const isHoveredDate = hoveredDates.some(d => d.toDateString() === day.toDateString());
                                    const isDateInRange = datesInRange.some(d => d.toDateString() === day.toDateString());

                                    return <label key={day.toISOString()}
                                        className={`relative select-none ${isNextMonthDays ? "" : "opacity-0 pointer-events-none"}
                                    ${isSelectedDate ? "bg-primary font-semibold text-white border-none"
                                                : (!startDate && !endDate && isCurrentDate) ? "bg-primary font-semibold text-white"
                                                    : (startDate && isCurrentDate) ? `border ${isDateInRange ? "bg-[#B6EEE5] border-primary font-semibold" : "bg-whiteSmoke border-lightSilver"} ` : isHoveredDate && !endDate
                                                        ? "border border-dashed border-primary"
                                                        : isDateInRange
                                                            ? "bg-[#B6EEE5] font-semibold"
                                                            : "hover:bg-whiteSmoke"}
                                                        cursor-pointer h-[38px] w-[38px] rounded-full text-center place-content-center text-[14px] font-proxima`}
                                        onClick={() => handleDateClick(day)}
                                        onMouseEnter={() => handleDateHover(day)}
                                        onMouseLeave={handleMouseOut}
                                    >
                                        {day.getDate()}
                                        {(isSelectedDate || (!startDate && !endDate && isCurrentDate)) && <span className={`${style.rippleAnimation} absolute rounded-full w-5 h-5 top-[9px] left-[9px] bg-primary opacity-50`} />}
                                    </label>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {error && (
            <span tabIndex={-1} className="text-defaultRed text-[12px] sm:text-sm">
                {errMessage}
            </span>
        )}
    </>)
}

export { DatepickerRangeExpanded };
