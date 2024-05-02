import React, { useEffect, useRef, useState } from 'react';
import CalendarIcon from "./icons/CalendarIcon.js";
import ChevronLeftIcon from "./icons/ChevronLeft.js";
import style from "./scss/StaticDatepickerRange.module.scss";
import { days, generateDaysArray, getFirstDayOfMonth, getFirstDayOfNextMonth, visibleOption } from './utils/StaticDatepickerUtility.js';

interface DatePickerProps {
    initialDate?: Date;
    onDateChange?: (date: Date) => void;
}

const StaticDatepickerRange: React.FC<DatePickerProps> = ({ initialDate, onDateChange }) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(true);
    const [selectedListOption, setSelectedListOption] = useState<string>('Custom');

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [rangeDates, setRangeDates] = useState<number[]>([]);

    const daysInMonth = generateDaysArray(currentDate);

    const calendarShow = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        onDateChange?.(date);
    };

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonthFirstDay = getFirstDayOfNextMonth(currentDate);
        setCurrentDate(nextMonthFirstDay);
    };

    const getNextMonthDate = () => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    };

    // Helper function to generate an array of days for the next month
    const getNextMonthDays = () => {
        const nextMonthDate = getNextMonthDate();
        const daysInNextMonth = generateDaysArray(nextMonthDate);
        return daysInNextMonth;
    };

    const handleDateHover = (date: any) => {
        // if (rangeDates.length === 0) {
        //     setRangeDates([date]);
        // } else {
        //     const lastDate = rangeDates[rangeDates.length - 1];
        //     const startDate = rangeDates[0];
        //     const endDate = date;
        //     const newRange = Array.from({ length: endDate - startDate + 1 }, (_, i) => startDate + i);
        //     setRangeDates(newRange);
        // }
        const rangeDates = [];
        let current = new Date(date);
        while (current < date) {
            current.setDate(current.getDate() + 1);
            rangeDates.push(new Date(current));
        }
        // while (current > date) {
        //     current.setDate(current.getDate() - 1);
        //     rangeDates.push(new Date(current));
        // }
        setRangeDates(rangeDates);
    };

    const handleMouseOut = () => {
        // setRangeDates([]);
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

    return (<>
        {/* <span className="flex ">
            <label className='text-[12px] font-proxima pt-1.5 pb-[12px]'>
                DatePicker
            </label>
        </span> */}
        <div className="w-full relative" ref={inputRef}>

            <div className="flex w-full relative ">
                <input
                    className='w-full text-[14px] py-1 outline-none cursor-pointer font-proxima border-b border-lightSilver hover:border-primary'
                    type="text"
                    style={{ background: "transparent" }}
                    placeholder="dd/mm/yyyy to dd/mm/yyyy"
                    onClick={calendarShow}
                    readOnly
                />
                <span
                    tabIndex={-1}
                    className="absolute right-2 bottom-1.5 cursor-pointer"
                    onClick={calendarShow}
                >
                    <CalendarIcon bgColor={false ? "#DC3545" : "#333333"} />
                </span>
            </div>

            <div className={`absolute ${selectedListOption == "Custom" ? "min-w-full" : "w-auto"} bg-pureWhite flex  top-10 z-[5] ${isCalendarOpen ? "visible" : "hidden"}`} style={{ boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <div className='w-[181px] py-3'>
                    {visibleOption.map((option: string, index) => (
                        <label key={option + index} className={`py-[12px] block cursor-pointer tracking-wide ${option == selectedListOption ? "bg-whiteSmoke" : "bg-pureWhite"} hover:bg-whiteSmoke px-5 text-[14px] font-proxima`} onClick={() => setSelectedListOption(option)}>{option}</label>
                    ))}
                </div>
                <div className={`w-full flex z-[5] py-[31px] ${selectedListOption == "Custom" ? "visible" : "hidden"}`}>
                    <div className='w-[344px] h-fit px-1 border-r border-b border-lightSilver'>
                        <div className='flex w-full mb-[14px]'>
                            <span className='w-5 h-5 mx-2 cursor-pointer hover:scale-105 transition-all text-darkGray text-[20px]' onClick={handlePrevMonth}><ChevronLeftIcon /></span>
                            <label className="select-none font-proxima w-full text-center text-sm font-semibold  text-slatyBlue">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</label>
                        </div>
                        <div className="grid w-full grid-cols-7 grid-rows-6 gap-[5px]">
                            {days.map((day, index) => (
                                <label key={index} className="select-none w-[38px] text-center place-content-center text-[12px] font-proxima">
                                    {day}
                                </label>
                            ))}
                            {daysInMonth.map((day) => {
                                const isCurrentMonthDays = day.getMonth() === currentDate.getMonth() && day.getFullYear() === currentDate.getFullYear();
                                const today = new Date();
                                const isCurrentDate = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear() && isCurrentMonthDays;

                                return <label key={day.toISOString()}
                                    className={`relative select-none ${isCurrentMonthDays ? "" : "opacity-0 pointer-events-none"}
                                     ${isCurrentDate ? "bg-primary font-semibold text-white border-none" : "hover:bg-whiteSmoke"}
                                      cursor-pointer h-[38px] w-[38px] rounded-full text-center place-content-center text-[14px] font-proxima`}
                                    onClick={() => handleDateClick(day)}
                                    onMouseEnter={() => handleDateHover(day)}
                                    onMouseLeave={handleMouseOut}
                                >
                                    {day.getDate()}
                                    {isCurrentDate && <span className={`${style.rippleAnimation} absolute rounded-full w-5 h-5 top-[9px] left-[9px] bg-primary opacity-50`} />}
                                </label>
                            })}
                        </div>
                    </div>
                    <div className='w-[344px] h-fit px-1 border-b border-lightSilver'>
                        <div className='flex w-full mb-[14px]'>
                            <label className="select-none font-proxima w-full text-center text-sm font-semibold  text-slatyBlue">{getNextMonthDate().toLocaleString('default', { month: 'long', year: 'numeric' })}</label>
                            <span className='w-5 h-5 mx-2 cursor-pointer hover:scale-105 transition-all text-darkGray rotate-180 text-[20px]' onClick={handleNextMonth}><ChevronLeftIcon /></span>
                        </div>
                        <div className="grid w-full grid-cols-7 grid-rows-6 gap-[5px]">
                            {days.map((day, index) => (
                                <label key={index} className="select-none w-[38px] text-center place-content-center text-[12px] font-proxima">
                                    {day}
                                </label>
                            ))}
                            {getNextMonthDays().map((day) => {
                                const isNextMonthDays = day.getMonth() === getNextMonthDate().getMonth() && day.getFullYear() === getNextMonthDate().getFullYear();
                                return <label key={day.toISOString()}
                                    className={`relative select-none ${isNextMonthDays ? "" : "opacity-0 pointer-events-none"} hover:bg-whiteSmoke cursor-pointer h-[38px] w-[38px] rounded-full text-center place-content-center text-[14px] font-proxima`}
                                    onClick={() => handleDateClick(day)} >
                                    {day.getDate()}
                                </label>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export { StaticDatepickerRange };