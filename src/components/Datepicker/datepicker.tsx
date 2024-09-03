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
  isMaxMinRequired?: boolean;
  minDate?: Date;
  maxDate?: Date;
  value?: string;
  id: string;
  label?: string;
  className?: string;
  hasError?: boolean;
  errorMessage?: string;
  getValue: (value: any) => void;
  getError: (arg1: boolean) => void;
  validate?: boolean;
  disabled?: boolean;
  format?: "DD/MM/YYYY" | "MM/DD/YYYY";
  hideIcon?: boolean;
}

const TODAY = new Date();

const Datepicker: React.FC<DatepickerProps> = ({
  value,
  isMaxMinRequired = false,
  minDate = new Date("01/01/1900"),
  maxDate = new Date(
    TODAY.getFullYear() + 100,
    TODAY.getMonth(),
    TODAY.getDate()
  ),
  startYear,
  endYear,
  label,
  validate,
  disabled,
  hasError,
  errorMessage = "This is required field!",
  format = "MM/DD/YYYY",
  hideIcon,
  getValue,
  getError,
  ...props
}) => {
  const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate: Date = new Date();
  const inputRef = useRef(null);
  const valueDate = new Date(value ? value : "");

  const [today, setToday] = useState<Date>(value ? valueDate : currentDate);
  const [showMonthList, setShowMonthList] = useState<boolean>(false);
  const [showYearList, setShowYearList] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? valueDate : currentDate
  );
  const [fullDate, setFullDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toggleOpen, setToggleOpen] = useState<boolean>(false);
  const [animate, setAnimate] = useState<string>("");
  const [err, setErr] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [dateFocusedIndex, setDateFocusedIndex] = useState<number>(0);
  const [rightIconFocusedIndex, setRightIconFocusedIndex] = useState<number>(0);
  const [leftIconFocusedIndex, setLeftIconFocusedIndex] = useState<number>(0);

  const currentMonth = today.getMonth();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    value ? valueDate.getMonth() : currentMonth
  );

  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(
    value ? valueDate.getFullYear() : currentYear
  );

  const yearsPerPage: number = 16;
  const totalPages: number = Math.ceil(
    ((isMaxMinRequired ? maxDate.getFullYear() : endYear) -
      (isMaxMinRequired ? minDate.getFullYear() : startYear) +
      1) /
    yearsPerPage
  );
  const startIndex: number = (currentPage - 1) * yearsPerPage;
  const displayedYears: number[] = Array.from(
    { length: yearsPerPage },
    (_, index) => {
      const year =
        (isMaxMinRequired ? minDate.getFullYear() : startYear) +
        startIndex +
        index;
      return year <= (isMaxMinRequired ? maxDate.getFullYear() : endYear)
        ? year
        : null;
    }
  ).filter((year) => year !== null);

  useEffect(() => {
    const newValueDate = new Date(value ? value : "");
    setSelectedDate(value ? newValueDate : currentDate);
    setFullDate(value);
    let month = value ? newValueDate.getMonth() : currentMonth;
    selectMonth(month);
    setSelectedYear(value ? newValueDate.getFullYear() : currentYear);
  }, [value]);

  const toggleMonthList = () => {
    setAnimate("");
    setShowMonthList(!showMonthList);
    setFocusedIndex(selectedMonth)
  };

  const selectMonth = (month: number) => {
    setAnimate(style.slideRightAnimation);
    const newDate = new Date(today);
    newDate.setMonth(month);
    setToday(newDate);
    setShowMonthList(false);
    setSelectedMonth(month);
    selectedMonth ? setAnimate(style.slideRightAnimation) : setAnimate("");
    setFocusedIndex(0);
  };

  const toggleYearList = () => {
    setShowYearList(true);
    setAnimate("");
    if (!showYearList && !showMonthList) {
      setFocusedIndex(selectedYear)
      setCurrentPage(
        Math.ceil(
          (selectedYear -
            (isMaxMinRequired ? minDate.getFullYear() : startYear) +
            1) /
          yearsPerPage
        )
      );
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
    const updatedDate =
      format === "MM/DD/YYYY"
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
    if (disabled) {
      return;
    }
    setToggleOpen(true);
    setToday(selectedDate);
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
      const isInputClick =
        inputRef.current && inputRef.current.contains(target);
      const isCalendarClick = target.closest(".bottomAnimation");
      if (!isInputClick && !isCalendarClick) {
        setToggleOpen(false);
        setShowMonthList(false);
        setShowYearList(false);
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

  const updateFromInput1 = (inputValue: string) => {
    const inputDate = new Date(inputValue);
    if (
      !isNaN(inputDate.getTime()) &&
      inputDate.getFullYear().toString().length == 4
    ) {
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

  const updateFromInput = (inputValue: string) => {
    const inputParts = inputValue.split("/");

    // Check if the input matches the MM/DD/YYYY format
    if (inputParts.length === 3) {
      const month = parseInt(inputParts[0]) - 1; // MM is at index 0
      const day = parseInt(inputParts[1]); // DD is at index 1
      const year = parseInt(inputParts[2]); // YYYY is at index 2

      // Validate the year
      if (isNaN(year) || year.toString().length !== 4 || year < 1000) {
        setErr(true);
        getError(true);
        setErrorMsg("Invalid year format. Please enter a four-digit year.");
        setToggleOpen(false);
        return;
      }

      // Validate the month
      if (isNaN(month) || month < 0 || month > 11) {
        setErr(true);
        getError(true);
        setErrorMsg("Invalid month format. Please enter a month between 01 and 12.");
        setToggleOpen(false);
        return;
      }

      // Validate the day
      const maxDays = new Date(year, month + 1, 0).getDate(); // Get the number of days in the given month/year
      if (isNaN(day) || day < 1 || day > maxDays) {
        setErr(true);
        getError(true);
        setErrorMsg(`Invalid day. The selected month has a maximum of ${maxDays} days.`);
        setToggleOpen(false);
        return;
      }

      const inputDate = new Date(year, month, day);

      // Check if the constructed date is valid
      if (
        !isNaN(inputDate.getTime()) &&
        inputDate.getFullYear() === year &&
        inputDate.getMonth() === month &&
        inputDate.getDate() === day
      ) {
        setToday(inputDate);
        setSelectedDate(inputDate);
        setSelectedMonth(month);
        setSelectedYear(year);
        setFullDate(inputValue);
        setErr(false);
        getError(false);
        setErrorMsg("");
      } else {
        setErr(true);
        getError(true);
        setErrorMsg("Invalid date input.");
        setToggleOpen(false);
      }
    } else {
      setErr(true);
      getError(true);
      setErrorMsg("Invalid date format. Please use MM/DD/YYYY.");
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
    if (!toggleOpen && validate && fullDate === "") {
      setErr(true);
      setErrorMsg("Please select a date.");
      getError(true);
    }
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const minDateInMilliSeconds = new Date(minDate).getTime();
  const maxDateInMilliSeconds = new Date(maxDate).getTime();

  const handleKeyEnter = (e: any) => {
    if (disabled) return;

    const rowSize = 7;
    const totalItems = 42;
    switch (e.key) {
      case "Enter":
        calendarShow()
        break;
      // case "ArrowUp":
      //   e.preventDefault();
      //   setDateFocusedIndex((prev) => (prev - rowSize + totalItems) % totalItems);
      //   break;
      // case "ArrowDown":
      //   e.preventDefault();
      //   setDateFocusedIndex((prev) => (prev + rowSize) % totalItems);
      //   break;
      // case "ArrowLeft":
      //   e.preventDefault();
      //   setDateFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      //   break;
      // case "ArrowRight":
      //   e.preventDefault();
      //   setDateFocusedIndex((prev) => (prev + 1) % totalItems);
      //   break;
      default:
        break;
    }
  }

  const handleMonthKeyNavigation = (e: any, index: number) => {
    switch (e.key) {
      case "Enter":
        selectMonth(index);
        setDateFocusedIndex(1)
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 4 + 12) % 12);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 4) % 12);
        break;
      case "ArrowLeft":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + 12) % 12);
        break;
      case "ArrowRight":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % 12);
        break;
      default:
        break;
    }
  };

  const handleYearKeyNavigation = (e: any, year: any) => {
    const rowSize = 4;
    const totalItems = displayedYears.length;
    switch (e.key) {
      case "Enter":
        selectYear(year);
        setDateFocusedIndex(0)
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - rowSize + totalItems) % totalItems);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + rowSize) % totalItems);
        break;
      case "ArrowLeft":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case "ArrowRight":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % totalItems);
        break;
      default:
        break;
    }
  };

  const handleDateKeyNavigation = (e: any, date: any) => {
    const rowSize = 7;
    const totalItems = 42;
    switch (e.key) {
      case "Shift":
        setRightIconFocusedIndex(0)
        setDateFocusedIndex(-1)
        break;
      case "Tab":
        setDateFocusedIndex(-1)
        break;
      case "Escape":
        setFocusedIndex(0);
        setToggleOpen(false);
        setToday(date);
        break;
      case "Enter":
        handleDateClick(date)
        break;
      case "ArrowUp":
        e.preventDefault();
        setDateFocusedIndex((prev) => (prev - rowSize + totalItems) % totalItems);
        break;
      case "ArrowDown":
        e.preventDefault();
        setDateFocusedIndex((prev) => (prev + rowSize) % totalItems);
        break;
      case "ArrowLeft":
        e.preventDefault();
        setDateFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case "ArrowRight":
        e.preventDefault();
        setDateFocusedIndex((prev) => (prev + 1) % totalItems);
        break;
      default:
        break;
    }
  };

  const handleIconKeyNavigation = (e: any) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        handleIconClick(true)
        setDateFocusedIndex(-1)
        break;
      case "Tab":
        if (e.shiftKey) {
          setLeftIconFocusedIndex(0);
        }
        else {
          e.preventDefault();
          setDateFocusedIndex(1);
        }
        break;
      case "Shift":
        // e.preventDefault();
        setLeftIconFocusedIndex(0);
        break;
      default:
        break;
    }
  }

  return (
    <>
      {label && (
        <span className="flex">
          <label
            className={`text-[12px] py-1 ${toggleOpen
              ? "text-primary"
              : focus && !err
                ? "text-primary"
                : err
                  ? "text-defaultRed"
                  : "text-slatyGrey"
              } ${(!toggleOpen && err) && "text-defaultRed"}`}
          >
            {label}
          </label>
          {validate && (
            <span
              className={` w-3 h-4 ${disabled ? "text-slatyGrey" : "text-defaultRed"
                }`}
            >
              &nbsp;*
            </span>
          )}
        </span>
      )}
      <div
        className={`relative mt-1 outline-none`}
        ref={inputRef}
        tabIndex={-1}
      >
        <input
          key={fullDate}
          type="text"
          placeholder={format}
          className={`outline-none text-[14px] py-[1px] hover:cursor-pointer w-full tracking-wider border-b placeholder:font-proxima
                    ${disabled
              ? "border-lightSilver pointer-events-none"
              : toggleOpen && !err
                ? "border-primary placeholder:text-primary"
                : fullDate
                  ? "border-lightSilver hover:border-primary"
                  : err
                    ? "border-defaultRed text-defaultRed placeholder:text-defaultRed"
                    : "text-darkCharcoal focus:border-primary border-lightSilver hover:border-primary  transition-colors duration-300 ease-in-out"
            } outline-none`}
          style={{ background: "transparent" }}
          // onClick={calendarShow}
          // readOnly
          defaultValue={fullDate}
          onChange={(e: any) => updateFromInput(e.target.value)}
          onBlur={handleInputBlur}
          onFocus={handleFocus}
          tabIndex={0}
          {...props}
        />
        {!hideIcon && (
          <span
            className={`absolute right-0 bottom-0.5 ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            tabIndex={0}
            onClick={calendarShow}
            onKeyDown={handleKeyEnter}
          >
            <CalendarIcon
              bgColor={
                toggleOpen && !err ? "#02B89D" : err ? "#DC3545" : "#333333"
              }
            />
          </span>
        )}
      </div>
      {toggleOpen && (
        <div className="relative">
          <div
            className={`bottomAnimation absolute z-10 bg-pureWhite ${toggleOpen ? style.bottomAnimation : ""
              }`}
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
                        tabIndex={toggleOpen ? 0 : -1}
                        className="font-proxima text-sm font-semibold cursor-pointer text-slatyBlue"
                        onClick={toggleMonthList}
                        onKeyDown={(e) => e.key === "Enter" && toggleMonthList()}
                      >
                        {months[currentMonth]}
                      </h1>
                    )}
                    {showYearList === true && showMonthList === false ? (
                      <h1 className="font-proxima text-sm font-semibold ml-1 text-slatyBlue">
                        {displayedYears[0] +
                          " - " +
                          displayedYears[displayedYears.length - 1]}
                      </h1>
                    ) : (
                      <h1
                        className={`font-proxima text-sm font-semibold ml-1 cursor-pointer text-slatyBlue`}
                        onClick={toggleYearList}
                        onKeyDown={(e) => e.key === "Enter" && toggleYearList()}
                        tabIndex={toggleOpen ? 0 : -1}
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
                            ${currentYear >
                              (isMaxMinRequired
                                ? minDate.getFullYear()
                                : startYear) ||
                              currentMonth >
                              minDate.getMonth()
                              ? ""
                              : "opacity-40 pointer-events-none"
                            } ${showMonthList
                              ? "hidden"
                              : ""
                            } text-[20px]`}
                          tabIndex={toggleOpen ? leftIconFocusedIndex : -1}
                          onKeyDown={(e) => e.key === "Enter" && handleIconClick(false)}
                          onClick={() => handleIconClick(false)}
                        >
                          <ChevronLeftIcon />
                        </div>
                        <div
                          className={`w-5 h-5 cursor-pointer hover:scale-105 transition-all text-darkGray
                            ${currentYear + 1 <=
                              (isMaxMinRequired
                                ? maxDate.getFullYear()
                                : endYear) ||
                              currentMonth <
                              maxDate.getMonth()
                              ? ""
                              : "opacity-40 pointer-events-none"
                            }
                            ${showMonthList
                              ? "hidden"
                              : ""
                            } rotate-180 text-[20px]`}
                          tabIndex={toggleOpen ? rightIconFocusedIndex : -1}
                          onKeyDown={handleIconKeyNavigation}
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
                              tabIndex={toggleOpen ? 0 : -1}
                              onKeyDown={(e) => e.key === "Enter" && goToPreviousPage()}
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
                              tabIndex={toggleOpen ? 0 : -1}
                              onKeyDown={(e) => e.key === "Enter" && goToNextPage()}
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
                            className={` ${(index < minDate.getMonth() &&
                              selectedYear === minDate.getFullYear()) ||
                              (index > maxDate.getMonth() &&
                                selectedYear === maxDate.getFullYear())
                              ? "opacity-40 pointer-events-none"
                              : ""
                              } py-[19.4px] w-[70px] outline-none grid place-content-center text-sm text-textColor font-proxima relative cursor-pointer `}
                            onClick={() => selectMonth(index)}
                            tabIndex={-1}
                          >
                            <div
                              className={`py-[20px] focus:bg-lightGreen focus:text-primary outline-none px-5 text-sm hover:bg-lightGreen hover:text-primary transition-all duration-200 flex items-center justify-center rounded-md ${index === selectedMonth
                                ? "bg-lightGreen text-primary"
                                : ""
                                }`}
                              tabIndex={showMonthList ? 0 : -1}
                              onKeyDown={(e) =>
                                handleMonthKeyNavigation(e, index)
                              }
                              ref={(el) => {
                                if (index === focusedIndex) {
                                  el?.focus();
                                }
                              }}
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
                        {displayedYears.map((year, index) => (
                          <div
                            key={year}
                            className={`py-[9px] outline-none w-[70px] grid place-content-center text-sm text-textColor font-proxima relative cursor-pointer`}
                            onClick={() => selectYear(year)}
                            tabIndex={-1}
                          >
                            <div
                              className={`py-[18px] outline-none focus:bg-lightGreen focus:text-primary px-5 text-sm hover:bg-lightGreen hover:text-primary transition-all duration-200 flex items-center justify-center rounded-md ${year === selectedYear
                                ? "bg-lightGreen text-primary"
                                : ""
                                }`}
                              tabIndex={showYearList ? 0 : -1}
                              onKeyDown={(e) =>
                                handleYearKeyNavigation(e, year)
                              }
                              ref={(el) => {
                                if (index === focusedIndex) {
                                  el?.focus();
                                }
                              }}
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
                          const currentDateInMilliSeconds = new Date(
                            date
                          ).getTime();

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
                              className={` outline-none h-full w-full grid place-content-center text-sm text-textColor font-proxima relative  ${currentDateInMilliSeconds <
                                minDateInMilliSeconds
                                ? "opacity-40 pointer-events-none"
                                : ""
                                }
                              ${currentDateInMilliSeconds >
                                  maxDateInMilliSeconds
                                  ? "opacity-40 pointer-events-none"
                                  : ""
                                }`}
                              onClick={() => handleDateClick(currentDate)}
                              tabIndex={-1}
                            >
                              <h1
                                className={` h-[40px] w-[40px] grid place-content-center rounded-full cursor-pointer z-10
                                ${currentMonth
                                    ? ""
                                    : "text-[#cbd5e0] "
                                  }
                                    ${isSameDay &&
                                    currentMonth
                                    ? " bg-primary text-white"
                                    : "hover:bg-whiteSmoke"
                                  }`}
                                onKeyDown={(e) =>
                                  handleDateKeyNavigation(e, currentDate)
                                }
                                ref={(el) => {
                                  if (index === dateFocusedIndex) {
                                    el?.focus();
                                  }
                                }}
                                tabIndex={toggleOpen ? dateFocusedIndex : -1}
                              >
                                {currentDate.getDate()}
                              </h1>
                              {isSameDay && currentMonth && (
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