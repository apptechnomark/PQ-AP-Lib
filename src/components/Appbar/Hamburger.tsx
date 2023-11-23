import React, { useState, useEffect, useRef } from "react";

interface HamburgerProps {
    children?: React.ReactNode;
    classname?: string;
    logo?: React.ReactNode;
    widths?: string;
}

const Hamburger: React.FC<HamburgerProps> = ({
    children,
    classname,
    logo,
    widths
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);

    };

    return (
        <>
            <button onClick={toggleSidebar}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <mask
                        id="mask0_7621_11450"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                    >
                        <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_7621_11450)">
                        <path
                            d="M4 18C3.71667 18 3.47917 17.9042 3.2875 17.7125C3.09583 17.5208 3 17.2833 3 17C3 16.7167 3.09583 16.4792 3.2875 16.2875C3.47917 16.0958 3.71667 16 4 16H20C20.2833 16 20.5208 16.0958 20.7125 16.2875C20.9042 16.4792 21 16.7167 21 17C21 17.2833 20.9042 17.5208 20.7125 17.7125C20.5208 17.9042 20.2833 18 20 18H4ZM4 13C3.71667 13 3.47917 12.9042 3.2875 12.7125C3.09583 12.5208 3 12.2833 3 12C3 11.7167 3.09583 11.4792 3.2875 11.2875C3.47917 11.0958 3.71667 11 4 11H20C20.2833 11 20.5208 11.0958 20.7125 11.2875C20.9042 11.4792 21 11.7167 21 12C21 12.2833 20.9042 12.5208 20.7125 12.7125C20.5208 12.9042 20.2833 13 20 13H4ZM4 8C3.71667 8 3.47917 7.90417 3.2875 7.7125C3.09583 7.52083 3 7.28333 3 7C3 6.71667 3.09583 6.47917 3.2875 6.2875C3.47917 6.09583 3.71667 6 4 6H20C20.2833 6 20.5208 6.09583 20.7125 6.2875C20.9042 6.47917 21 6.71667 21 7C21 7.28333 20.9042 7.52083 20.7125 7.7125C20.5208 7.90417 20.2833 8 20 8H4Z"
                            fill="#6E6D7A"
                        />
                    </g>
                </svg>
            </button>

            <div
                className={`fixed top-0 z-10 ${isSidebarOpen ? "left-0" : `-left-full`
                    } translate-all duration-700 ease-all ${classname}`} style={{ width: `${widths}px` }}
                ref={sidebarRef}
            >
                <button className="absolute top-2.5 right-3" onClick={toggleSidebar}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#6E6D7A"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div className="p-3 border-b-[1px] border-b-lightSilver">
                    {logo}
                </div>
                {children}
            </div>
        </>
    );
};

export default Hamburger;