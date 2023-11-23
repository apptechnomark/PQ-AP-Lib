import React, { useState, useEffect, useRef } from "react";

interface NotificationProps {
    count?: number;
    children?: React.ReactNode;
    classname?: string;
}

const Notification: React.FC<NotificationProps> = ({
    count,
    children,
    classname,
}) => {
    const [isNotificationbarOpen, setIsNotificationbarOpen] = useState(false);
    const notificationbarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationbarRef.current &&
                !notificationbarRef.current.contains(event.target)
            ) {
                setIsNotificationbarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleNotificationbar = () => {
        setIsNotificationbarOpen(!isNotificationbarOpen);
    };

    return (
        <div className="relative top-0.5 ml-3" ref={notificationbarRef}>
            {count !== undefined && (
                <span
                    className="text-pureWhite absolute -top-1.5 -right-1.5 bg-pureRed text-xs rounded-full px-1 cursor-pointer"
                    onClick={toggleNotificationbar}
                >
                    {count}
                </span>
            )}
            <button onClick={toggleNotificationbar}>
                <svg
                    width="15"
                    height="19"
                    viewBox="0 0 15 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 15.6781V14.6086H1.92177V7.43287C1.92177 6.15168 2.33508 5.02033 3.1617 4.03882C3.9891 3.05809 5.02705 2.4459 6.27554 2.20228V1.5216C6.27554 1.21337 6.37284 0.966239 6.56743 0.78021C6.76202 0.593403 7.00525 0.5 7.29714 0.5C7.58903 0.5 7.83226 0.593403 8.02685 0.78021C8.22144 0.966239 8.31874 1.21337 8.31874 1.5216V2.20228C9.58358 2.4459 10.6215 3.05809 11.4326 4.03882C12.2428 5.02033 12.648 6.15168 12.648 7.43287V14.6086H14.5943V15.6781H0ZM7.29714 18.5C6.8597 18.5 6.48687 18.3541 6.17863 18.0622C5.8704 17.7703 5.71629 17.3893 5.71629 16.9191H8.87799C8.87799 17.3893 8.73205 17.7703 8.44016 18.0622C8.14828 18.3541 7.76727 18.5 7.29714 18.5ZM2.99124 14.6086H11.5785V7.43287C11.5785 6.23263 11.1648 5.21921 10.3374 4.39259C9.5108 3.56519 8.49737 3.15149 7.29714 3.15149C6.08134 3.15149 5.05974 3.56519 4.23234 4.39259C3.40494 5.21921 2.99124 6.23263 2.99124 7.43287V14.6086Z"
                        fill="#6E6D7A"
                    />
                </svg>
            </button>
            <div
                className={`fixed right-0 top-0 transform ${isNotificationbarOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-500 ease-in-out ${classname}`}
            >
                <button
                    className="absolute top-3 right-3"
                    onClick={toggleNotificationbar}
                >
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
                {children}
            </div>
        </div>
    );
};

export default Notification;