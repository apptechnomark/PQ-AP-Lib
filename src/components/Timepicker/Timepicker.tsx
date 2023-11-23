import React, { useEffect, useRef, useState } from 'react';
import style from './Timepicker.module.scss';

interface TimepickerProps {
    getValue: (value: string) => void;
    value: string;
}

const Timepicker: React.FC<TimepickerProps> = ({ value, getValue }) => {

    const selectRef = useRef<HTMLDivElement>(null);
    const hourDigits: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const minuteDigits: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    const inputHourDigits: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const [selectedHourDigit, setSelectedHourDigit] = useState<number>(value ? Number(value.split(":")[0]) : 12);
    const [selectedMinuteDigit, setSelectedMinuteDigit] = useState<number>(value ? Number(value.split(":")[1].split(" ")[0]) : 0);
    const [isAM, setIsAM] = useState<boolean>(value ? value.split(":")[1].split(" ")[1] == "AM" ? true : false : true);
    const [showHourDigits, setShowHourDigits] = useState<boolean>(true);
    const [showMinuteDigits, setShowMinuteDigits] = useState<boolean>(false);
    const [animateHour, setAnimateHour] = useState<String>('');
    const [animateMinute, setAnimateMinute] = useState<String>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleHourSelectDigit = (digit: number) => {
        setSelectedHourDigit(digit);
        digit ? setAnimateHour(style.textAnimation) : setAnimateHour('');
        setTimeout(() => {
            setAnimateHour('');
        }, 300);

        const timer = setTimeout(() => {
            setShowMinuteDigits(true);
            setShowHourDigits(false);
        }, 100);
        return () => {
            clearTimeout(timer);
        };
    };

    const handleMinuteSelectDigit = (digit: number) => {
        setSelectedMinuteDigit(digit);
        digit ? setAnimateMinute(style.textAnimation) : setAnimateMinute('');
        setTimeout(() => {
            setAnimateMinute('');
        }, 300);
    };

    const toggleSetAM = () => {
        setIsAM(!isAM);
    };

    const showHourClock = () => {
        setIsOpen(true);
        if (showHourDigits) {
            setShowHourDigits(true);
            setShowMinuteDigits(false);
        } else {
            setShowMinuteDigits(false);
            setShowHourDigits(true);
        }
    };

    const showMinuteClock = () => {
        setIsOpen(true);
        if (showMinuteDigits) {
            setShowMinuteDigits(true);
            setShowHourDigits(false);
        } else {
            setShowMinuteDigits(true);
            setShowHourDigits(false);
        }
    };

    const renderHourDigits = hourDigits.map((digit, index) => (
        <div
            key={digit}
            className={`absolute top-1/2 left-1/2 z-10 text-sm ${digit === selectedHourDigit ? "pointer-events-none" : "cursor-pointer"}  transform -translate-x-1/2 -translate-y-1/2 w-5 flex items-center justify-center ${digit === selectedHourDigit ? 'text-white' : 'text-black'
                }`}
            style={{
                transform: `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)`,
                top: '46%',
                left: '47%'
            }}
            onClick={() => handleHourSelectDigit(digit)}
        >
            {digit}
        </div>
    ));

    const renderMinuteDigits = minuteDigits.map((digit, index) => {
        const formattedDigit = digit < 10 ? `0${digit}` : digit;
        return (
            <div
                key={digit}
                className={`absolute top-1/2 left-1/2 z-10 text-sm  transform -translate-x-1/2 -translate-y-1/2 w-5 flex items-center justify-center ${digit === selectedMinuteDigit ? "pointer-events-none" : "cursor-pointer"} ${digit === selectedMinuteDigit ? 'text-white' : 'text-black'
                    }`}
                style={{
                    transform: `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)`,
                    top: '46%',
                    left: '47%'
                }}
                onClick={() => handleMinuteSelectDigit(digit)}
            >
                {formattedDigit}
            </div>
        );
    });


    const renderInputHourDigit = inputHourDigits
        .slice(0, selectedHourDigit + 1)
        .reverse()
        .map((digit, index) => {
            return (digit < 10 ? `0${digit}` : digit) + " ";
        }).join('');

    const renderInputMinuteDigit = minuteDigits
        .filter(digit => digit <= selectedMinuteDigit)
        .reverse()
        .map((digit, index) => {
            return (digit < 10 ? `0${digit}` : digit) + " ";
        }).join('');

    useEffect(() => {
        let fullTime = selectedHourDigit + ':' + selectedMinuteDigit + ' ' + (isAM ? 'AM' : 'PM');
        getValue(fullTime);
    }, [selectedHourDigit, selectedMinuteDigit, isAM]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!selectRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        window.addEventListener("click", handleOutsideClick);
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <>
            <div className={`flex flex-col items-center justify-center  `} ref={selectRef}>
                <div className='flex items-center my-3'>
                    <div className='flex items-center space-x-1'>
                        <div className={`border w-9 h-8 border-gray-300 rounded bg-secondaryPrimary overflow-hidden inline-block`} onClick={showHourClock}>
                            <div className={`${animateHour} font-semibold text-lg border border-none rounded text-center cursor-pointer ${showHourDigits === true ? 'bg-secondaryPrimary text-primary' : 'bg-lightGray'}`} >
                                {renderInputHourDigit}
                            </div>
                        </div>
                        <span className='text-gray-600'>:</span>
                        <div className={`border w-9 h-8 border-gray-300 rounded bg-secondaryPrimary overflow-hidden inline-block`} onClick={showMinuteClock}>
                            <div className={`${animateMinute} h-full font-semibold  text-lg border border-none rounded text-center cursor-pointer ${showMinuteDigits === true ? 'bg-secondaryPrimary text-primary' : 'bg-lightGray'}`} >
                                {renderInputMinuteDigit}
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 ml-10 border border-gray-300 rounded-md'>
                        <div
                            className={`w-10 h-8 ${isAM && 'bg-secondaryPrimary text-primary'} ${isAM === true ? "pointer-events-none" : "cursor-pointer"} transition-all rounded-l-md font-medium text-sm duration-200 flex items-center justify-center py-1 px-2 `}
                            onClick={toggleSetAM}
                        >
                            AM
                        </div>
                        <div
                            className={`w-10 h-8 ${!isAM && 'bg-secondaryPrimary text-primary'} ${!isAM === true ? "pointer-events-none" : "cursor-pointer"} transition-all rounded-r-md font-medium text-sm duration-200 flex items-center justify-center py-1 px-2`}
                            onClick={toggleSetAM}
                        >
                            PM
                        </div>
                    </div>
                </div>
                <div className={`transition-height duration-300 ease-out ${isOpen ? "h-56" : "h-0"}`}>
                    {isOpen && !showMinuteDigits && showHourDigits && (
                        <div className='w-56 h-56 bg-lightGray rounded-full relative flex items-center justify-center '>
                            <div className={`w-full h-full relative -left-1`}>
                                {renderHourDigits}
                                {hourDigits.map((digit, index) =>
                                    digit === selectedHourDigit && (
                                        <React.Fragment key={digit}>
                                            <div
                                                className={`absolute w-10 h-10 bg-primary rounded-full transform -translate-x-1/2 translate-y-16 pointer-events-none`}
                                                style={{
                                                    top: '41%',
                                                    left: '42.6%',
                                                    transform: `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)`,
                                                }}
                                                onClick={() => handleHourSelectDigit(selectedHourDigit === 12 ? 1 : selectedHourDigit + 1)}
                                            >
                                            </div>
                                            <div
                                                className='absolute w-0.5 h-[90px] bg-primary transform -translate-x-1/2 -translate-y-1/2'
                                                style={{
                                                    top: '51%',
                                                    left: '52%',
                                                    transformOrigin: 'center top',
                                                    transform: `translateX(-50%) rotate(${index * 30}deg) translateY(-90px)`,
                                                }}
                                            ></div>
                                        </React.Fragment>
                                    )
                                )}
                                <div className='absolute w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-4' style={{ top: '56.3%', left: '52%' }}></div>
                            </div>
                        </div>
                    )}
                    {isOpen && showMinuteDigits && (
                        <div className='w-56 h-56 bg-lightGray rounded-full relative flex items-center justify-center'>
                            <div className={`w-full h-full relative -left-1 ${style.scaleUpAnimation}`}>
                                {renderMinuteDigits}
                                {minuteDigits.map((digit, index) =>
                                    digit === selectedMinuteDigit && (
                                        <React.Fragment key={digit}>
                                            <div
                                                className={`absolute w-10 h-10 bg-primary rounded-full transform -translate-x-1/2 translate-y-16 pointer-events-none`}
                                                style={{ top: '41%', left: '42.6%', transform: `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)` }}
                                                onClick={() => handleMinuteSelectDigit(selectedMinuteDigit === 0 ? 1 : selectedMinuteDigit + 1)}
                                            ></div>
                                            <div
                                                className='absolute w-0.5 h-[90px] bg-primary transform -translate-x-1/2 -translate-y-1/2'
                                                style={{
                                                    top: '51%',
                                                    left: '52%',
                                                    transformOrigin: 'center top',
                                                    transform: `translateX(-50%) rotate(${index * 30}deg) translateY(-90px)`
                                                }}
                                            ></div>
                                        </React.Fragment>
                                    )
                                )}
                                <div className='absolute w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-4' style={{ top: '56.3%', left: '52%' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export { Timepicker };
