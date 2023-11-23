import React from 'react';

interface AppBarProps {
    classname?: string;
    children?: React.ReactNode;
    rightContent?: React.ReactNode;
}

const Appbar: React.FC<AppBarProps> = ({ children, rightContent, classname }) => {
    return (
        <div className={`flex justify-between items-center px-4 py-5 min-w-fit border-b-[1px] border-b-lightSilver ${classname}`}>
            <div className="flex items-center">
                {children}
            </div>
            <div className="flex items-center space-x-4">
                {rightContent}
            </div>

        </div>
    );
};

export default Appbar;