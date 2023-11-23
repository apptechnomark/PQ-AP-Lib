import React, { useEffect, useRef, useState } from 'react';
import style from './Timepicker.module.scss';

interface Timepicker24HrProps {
    getValue: (value: string) => void;
    value: string;
}

const Timepicker24Hr: React.FC<Timepicker24HrProps> = ({ value, getValue }) => {
    const selectRef = useRef<HTMLDivElement>(null);
    const hourDigits12: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const hourDigits24: number[] = [24, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const minuteDigits: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    const inputHourDigits12: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

    const [selectedHourDigit, setSelectedHourDigit] = useState<number>(value ? Number(value.split(":")[0]) : 12) || useState<number>(value ? Number(value.split(":")[0]) : 24);
    const [selectedMinuteDigit, setSelectedMinuteDigit] = useState<number>(value ? Number(value.split(":")[1].split(" ")[0]) : 0);
    const [isAM, setIsAM] = useState<boolean>(false);
    const [showHourDigits, setShowHourDigits] = useState<boolean>(true);
    const [showMinuteDigits, setShowMinuteDigits] = useState<boolean>(false);

    const [isDigit12, setIsDigit12] = useState<boolean>(hourDigits24.includes(Number(value.split(":")[0])) ? false : true || true);
    const [isDigit24, setIsDigit24] = useState<boolean>(hourDigits24.includes(Number(value.split(":")[0])) ? true : false || false);

    const [animateHour, setAnimateHour] = useState<String>('');
    const [animateMinute, setAnimateMinute] = useState<String>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleHourSelectDigit = (digit: number) => {
        setSelectedHourDigit(digit);
        digit ? setAnimateHour(style.textAnimation) : setAnimateHour('');
        if (digit <= 12) {
            setIsDigit12(true);
            setIsDigit24(false);
        } else {
            setIsDigit24(true);
            setIsDigit12(false);
        }
        setTimeout(() => {
            setAnimateHour('');
        }, 300);

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

    const renderHourDigits12 = hourDigits12.map((digit, index) => (
        <div
            key={digit}
            className={`absolute z-10 text-sm transform -translate-x-1/2 -translate-y-1/2 w-5 flex items-center justify-center ${digit === selectedHourDigit ? "pointer-events-none" : "cursor-pointer"}  ${digit === selectedHourDigit ? 'text-white' : 'text-black'} ${isDigit12 ? 'text-black' : 'text-[#9ca3af]'}`}
            style={{
                transform: `${isDigit12 ?
                    `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)` :
                    `rotate(${index * 30}deg) translate(0, -55px) rotate(${-index * 30}deg)`}`,
                top: '46%',
                left: '47%',
                transition: 'transform 0.3s ease-out'
            }}
            onClick={() => {
                handleHourSelectDigit(digit)
            }}
        >
            {digit}
        </div>

    ));

    const renderHourDigits24 = hourDigits24.map((digit, index) => (
        <div
            key={digit}
            className={`absolute z-10 text-sm transform -translate-x-1/2 -translate-y-1/2 w-5 flex items-center justify-center ${digit === selectedHourDigit ? "pointer-events-none" : "cursor-pointer"} ${isDigit24 ? 'text-black' : 'text-[#9ca3af]'}  ${digit === selectedHourDigit ? 'text-white' : 'text-gray'} `}
            style={{
                transform: `${isDigit24 ?
                    `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)` :
                    `rotate(${index * 30}deg) translate(0,-55px) rotate(${-index * 30}deg)`}`,
                top: `46%`,
                left: '47%',
                transition: 'transform 0.3s ease-in'
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
                className={`absolute z-10 text-sm transform -translate-x-1/2 -translate-y-1/2 w-5 flex items-center justify-center ${digit === selectedMinuteDigit ? "pointer-events-none" : "cursor-pointer"} ${digit === selectedMinuteDigit ? 'text-white' : 'text-black'
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

    const renderInputHourDigit = inputHourDigits12
        .slice(0, selectedHourDigit + 1)
        .reverse()
        .map((digit, index) => {
            return (digit < 10 ? `0${digit}` : digit) + ' ';
        }).join('');

    const renderInputMinuteDigit = minuteDigits
        .filter(digit => digit <= selectedMinuteDigit)
        .reverse()
        .map((digit, index) => {
            return (digit < 10 ? `0${digit}` : digit) + ' ';
        }).join('');

    useEffect(() => {
        let fullTime = selectedHourDigit + ':' + selectedMinuteDigit;
        getValue(fullTime);
    }, [selectedHourDigit, selectedMinuteDigit]);

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
            <div className='flex flex-col  items-center justify-center' ref={selectRef}>
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
                    <div className='grid grid-cols-2 ml-10 border border-gray-300 rounded-md opacity-50'>
                        <div
                            className={`w-10 h-8 ${isAM && 'bg-secondaryPrimary text-primary'} transition-all rounded-l-md font-medium text-sm duration-200 flex items-center justify-center py-1 px-2 cursor-pointer pointer-events-none `}
                            onClick={toggleSetAM}
                        >
                            AM
                        </div>
                        <div
                            className={`w-10 h-8 ${!isAM && 'bg-secondaryPrimary text-primary'} transition-all rounded-r-md font-medium text-sm duration-200 flex items-center justify-center py-1 px-2 cursor-pointer pointer-events-none`}
                            onClick={toggleSetAM}
                        >
                            PM
                        </div>
                    </div>
                </div>
                <div className={`transition-height duration-300 ease-out ${isOpen ? "h-56" : "h-0"}`}>
                    {isOpen && !showMinuteDigits && showHourDigits && (
                        <>
                            <div className={`w-56 h-56 bg-lightGray rounded-full overflow-hidden`}>
                                <div className={` w-full h-full relative -left-1`}>
                                    {renderHourDigits12}
                                    {hourDigits12.map((digit, index) =>
                                        digit === selectedHourDigit && (
                                            <React.Fragment key={digit}>
                                                <div
                                                    className={`relative w-10 h-10 bg-primary rounded-full transform -translate-x-1/2 translate-y-16 pointer-events-none`}
                                                    style={{
                                                        top: '41%',
                                                        left: '42.6%',
                                                        transform: `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)`
                                                    }}
                                                    onClick={() => handleHourSelectDigit(selectedHourDigit === 12 ? 1 : selectedHourDigit + 1)}
                                                ></div>
                                                <div
                                                    className='absolute w-0.5 h-[92px] bg-primary transform -translate-x-1/2 -translate-y-1/2'
                                                    style={{
                                                        top: '50.5%',
                                                        left: '52%',
                                                        transformOrigin: 'center top',
                                                        transform: `translateX(-50%) rotate(${index * 30}deg) translateY(-90px)`
                                                    }}
                                                ></div>
                                                <div className='absolute w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-4' style={{ top: '56%', left: '52%' }}></div>
                                            </React.Fragment>
                                        )
                                    )}
                                </div>
                                <div className={`${isDigit24 ? `w-56 h-56 -top-56` : ` w-32  h-32 -top-[181px] left-0 bg-transparent `} bg-lightGray rounded-full relative flex items-center justify-center`} style={{ background: "transparent" }}>
                                    <div
                                        className={`w-full h-full relative ${isDigit24 ? 'right-1' : 'left-[41px]'}`}>
                                        {renderHourDigits24}
                                        {hourDigits24.map((digit, index) =>
                                            digit === selectedHourDigit && (
                                                <React.Fragment key={digit}>
                                                    <div
                                                        className={`relative w-10 h-10 bg-primary rounded-full transform -translate-x-1/2 translate-y-16 pointer-events-none`}
                                                        style={{
                                                            top: '41%',
                                                            left: '42.6%',
                                                            transform: `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)`
                                                        }}
                                                        onClick={() => handleHourSelectDigit(selectedHourDigit === 12 ? 1 : selectedHourDigit + 1)}
                                                    ></div>
                                                    <div
                                                        className='absolute w-0.5 h-[92px] bg-primary transform -translate-x-1/2 -translate-y-1/2'
                                                        style={{
                                                            top: '50.5%',
                                                            left: '52%',
                                                            transformOrigin: 'center top',
                                                            transform: `translateX(-50%) rotate(${index * 30}deg) translateY(-90px)`
                                                        }}
                                                    ></div>
                                                    <div className='absolute w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-4' style={{ top: '56%', left: '52%' }}></div>
                                                </React.Fragment>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {isOpen && showMinuteDigits && (
                        <div className='w-56 h-56 bg-lightGray rounded-full  relative flex items-center justify-center overflow-hidden'>
                            <div className={`w-full h-full relative right-1  ${style.scaleUpAnimation} `}>
                                {renderMinuteDigits}
                                {minuteDigits.map((digit, index) =>
                                    digit === selectedMinuteDigit && (
                                        <React.Fragment key={digit}>
                                            <div
                                                className={`relative w-10 h-10 bg-primary rounded-full transform -translate-x-1/2 translate-y-16 pointer-events-none`}
                                                style={{
                                                    top: '41%',
                                                    left: '42.6%',
                                                    transform: `rotate(${index * 30}deg) translate(0, -90px) rotate(${-index * 30}deg)`
                                                }}
                                                onClick={() => handleMinuteSelectDigit(selectedMinuteDigit === 0 ? 1 : selectedMinuteDigit + 1)}
                                            ></div>
                                            <div
                                                className='absolute w-0.5 h-[92px] bg-primary transform -translate-x-1/2 -translate-y-1/2'
                                                style={{
                                                    top: '50.5%',
                                                    left: '52%',
                                                    transformOrigin: 'center top',
                                                    transform: `translateX(-50%) rotate(${index * 30}deg) translateY(-90px)`
                                                }}
                                            ></div>
                                            <div className='absolute w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-4' style={{ top: '56%', left: '52%' }}></div>
                                        </React.Fragment>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export { Timepicker24Hr };
