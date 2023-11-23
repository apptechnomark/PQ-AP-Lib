
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../Button/Button";
import { useMediaQuery } from 'react-responsive';
import { MenuIcon } from "../MenuIcon/MenuIcon";
import "../MenuIcon/MenuIcon.module.scss";
import MinusIcon from "./icons/MinusIcon"
import { Rating } from "../Rating/Rating";
import NegativeSignIcon from "./icons/NegativeSignIcon";
import RightArrowIcon from "./icons/RightArrow";
import Typography from "../Typography/Typography";
import { Close } from "../Closebutton/Close";

interface IconName {
    icon: React.ReactNode;
    name?: string;
}

interface NavigationBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    disabled?: boolean;
    isOpen?: boolean;
    items: string[];
    counts?: number;
    onOpenModal?: () => void;
    onClose?: () => void;
    tabs?: any;
    getValue?: (arg: string) => void;
    visibleTab?: number;
    visibleIcon?: number;
    tableBarIcons?: React.ReactNode[];
    count?: number;
    message?: string;
    icons?: IconName[];
    variant?: "default" | "selectedRows";
    Size?: "large";
}

const PropertyBar: React.FC<NavigationBarProps> = ({
    className,
    disabled,
    getValue,
    tabs,
    visibleTab,
    visibleIcon,
    tableBarIcons,
    count,
    icons,
    message,
    isOpen,
    onClose,
    items,
    counts,
    onOpenModal,
    variant = "default",
    Size = "default",
    ...props
}) => {

    const selectRef = useRef<HTMLDivElement>(null);
    const parentDivRef = useRef<HTMLDivElement>(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [selectedTabIconIndex, setSelectedTabIconIndex] = useState<number>(0);
    const [width, setWidth] = useState<number | null>(null);
    const [actualWidth, setActualWidth] = useState("");
    const [mobile, setMobile] = useState(false);
    const [tablet, setTablet] = useState(false);
    const [retina, setRetina] = useState(false);

    const isMobile = useMediaQuery({ query: '(min-width:200px) and (max-width: 430px)' });
    const isTablet = useMediaQuery({ query: '(min-width:431px) and (max-width: 1024px)' });
    const isRetina = useMediaQuery({ query: '(min-width:1025px) and (max-width: 1456px)' });
    const isTv = useMediaQuery({ query: '(min-width:1057px) and (max-width: 3000px)' });

    const [tab, setTab] = useState<string>(
        tabs && tabs.length > 0 ? tabs[0].id : ""
    );
    const [visibleTabs, setVisibleTabs] = useState<any>(
        tabs ? tabs.slice(0, visibleTab) : []
    );
    const [dropdownTabs, setDropdownTabs] = useState<any>(
        tabs ? tabs.slice(visibleTab) : []
    );

    const [tabIcon, setTabIcon] = useState<string>(
        icons && icons.length > 0 ? icons[0].name : ""
    );
    const [visibleTabsIcon, setVisibleTabsIcon] = useState<any>(
        icons ? icons.slice(0, visibleTab) : []
    );
    const [dropdownTabsIcon, setDropdownTabsIcon] = useState<any>(
        icons ? icons.slice(visibleTab) : []
    );

    const [isopen, setIsOpen] = useState<boolean>(false);
    const [isIconOpen, setIsIconOpen] = useState<boolean>(false);

    const handleTabClick = (tabId: string, index: number) => {
        const clickedTab = dropdownTabs[index];
        const lastVisibleTab = visibleTabs[visibleTabs.length - 1];

        // Check if the clicked tab is already visible, then return
        if (visibleTabs.some((tab: any) => tab.id === tabId)) {
            setTab(tabId); // Update the tab state
            setSelectedTabIndex(index);
            return;
        }
        // Find the index of the clicked tab in the dropdownTabs array
        const clickedTabIndexInDropdown = dropdownTabs.findIndex(
            (tab: any) => tab.id === tabId
        );

        // Update the state to swap the tabs
        const updatedVisibleTabs = [...visibleTabs];
        const updatedDropdownTabs = [...dropdownTabs];

        // Replace the last visible tab with the clicked tab
        updatedVisibleTabs[visibleTabs.length - 1] = clickedTab;

        // If the clicked tab is already in the dropdown, replace it with the last visible tab
        if (clickedTabIndexInDropdown !== -1) {
            updatedDropdownTabs[clickedTabIndexInDropdown] = lastVisibleTab;

            // Find the new index of the selected tab in the visible tabs
            const newSelectedTabIndex = updatedVisibleTabs.findIndex(
                (tab) => tab.id === tabId
            );
            setSelectedTabIndex(newSelectedTabIndex);
        } else {
            // If the clicked tab is not in the dropdown, add the last visible tab to the beginning of the dropdown
            updatedDropdownTabs.unshift(lastVisibleTab);
            setSelectedTabIndex(visibleTabs.length + clickedTabIndexInDropdown);
        }

        setTab(tabId);
        setVisibleTabs(updatedVisibleTabs);
        setDropdownTabs(updatedDropdownTabs);
    }
    useEffect(() => {
        getValue(tab);
    }, [tab])

    const handleTabIconClick = (tabId: string, index: number) => {
        const clickedTab = dropdownTabsIcon[index];
        const lastVisibleTab = visibleTabsIcon[visibleTabsIcon.length - 1];

        // Check if the clicked tab is already visible, then return
        if (visibleTabsIcon.some((tab: any) => tab.name === tabId)) {
            setTabIcon(tabId); // Update the tab state
            setSelectedTabIconIndex(index);
            return;
        }
        // Find the index of the clicked tab in the dropdownTabs array
        const clickedTabIndexInDropdown = dropdownTabsIcon.findIndex(
            (tab: any) => tab.name === tabId
        );

        // Update the state to swap the tabs
        const updatedVisibleTabs = [...visibleTabsIcon];
        const updatedDropdownTabs = [...dropdownTabsIcon];

        // Replace the last visible tab with the clicked tab
        updatedVisibleTabs[visibleTabsIcon.length - 1] = clickedTab;

        // If the clicked tab is already in the dropdown, replace it with the last visible tab
        if (clickedTabIndexInDropdown !== -1) {
            updatedDropdownTabs[clickedTabIndexInDropdown] = lastVisibleTab;

            // Find the new index of the selected tab in the visible tabs
            const newSelectedTabIndex = updatedVisibleTabs.findIndex(
                (tab) => tab.name === tabId
            );
            setSelectedTabIconIndex(newSelectedTabIndex);
        } else {
            // If the clicked tab is not in the dropdown, add the last visible tab to the beginning of the dropdown
            updatedDropdownTabs.unshift(lastVisibleTab);
            setSelectedTabIconIndex(visibleTabs.length + clickedTabIndexInDropdown);
        }

        setTabIcon(tabId);
        setVisibleTabsIcon(updatedVisibleTabs);
        setDropdownTabsIcon(updatedDropdownTabs);
    }



    const handleResize = () => {
        if (parentDivRef.current) {
            const newWidth = parentDivRef.current.offsetWidth;
            setWidth(newWidth);

            if (newWidth >= 341 && newWidth <= 662) {
                setTablet(true);
                setMobile(false);
                setRetina(false);
            } else if (newWidth >= 210 && newWidth <= 340) {
                setTablet(false);
                setMobile(true);
                setRetina(false);
            } else if (newWidth >= 662 && newWidth <= 1738) {
                setTablet(false);
                setMobile(false);
                setRetina(true);
            } else {
                setTablet(false);
                setMobile(false);
                setRetina(false);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Call this initially to set the initial state

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [parentDivRef]);



    // To Toggle Tab-list
    const handleToggleOpen = () => {
        setIsOpen(!isopen);
    };

    const handleIconToggleOpen = () => {
        setIsIconOpen(!isIconOpen);
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setIsIconOpen(false);
            }
        };
        window.addEventListener("click", handleOutsideClick);
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const firstIcon = tableBarIcons && tableBarIcons.length > 0 ? tableBarIcons[0] : null;
    const otherIcons = tableBarIcons && tableBarIcons.length > 1 ? tableBarIcons.slice(1) : [];


    const containerClasses = `bg-whiteSmoke  rounded-[127px] w-max border-[1px] border-primary py-[15px] ${Size === "large" ? "px-[30px]" : "px-[20px]"
        } flex`;

    const getDynamicWidth = (component) => {
        const baseWidth = component === "tablet" ? 372 : 893; // Initial width
        const windowWidth = width;
        const maxAllowedWidth = component === "tablet" ? 800 : 1082; // Max width for the table and the other component
        const widthIncrement = 2; // Width increment
        let classes = [];

        if (windowWidth >= 967 && windowWidth <= 1399) {
            classes.push("w-1399", "pl-5");
        } else if (windowWidth <= baseWidth) {
            classes.push(`w-${baseWidth}`);
        } else {
            classes.push(`w-${Math.min(baseWidth + Math.floor((windowWidth - baseWidth) / 2) * widthIncrement, maxAllowedWidth)}`);
        }

        return classes;
    };




    return (
        <>
            {variant === "selectedRows" ? (
                isRetina ? (
                    // Render this content if variant is "selectedRows" and retina is true
                    <div ref={parentDivRef}>
                        <div className={`bg-whiteSmoke rounded-[127px] ${getDynamicWidth("other").join(" ")} border-[1px] border-primary py-[15px]`}>
                            <div className="gap-2.5 flex">
                            </div>
                            <div className="flex">
                                <div className="lgd:flex justify-center items-center">
                                    <MinusIcon />
                                </div>
                                <span className="flex justify-center items-center text-[16px] pr-[15px]">
                                    {count} task selected
                                </span>
                                <div className="border-x-2 border-lightSilver items-center flex">{firstIcon}</div>
                                {otherIcons.map((icon, index) => (
                                    <div key={index} className="border-r-2 border-lightSilver items-center flex">{icon}</div>
                                ))}
                                <Button className="rounded-md btn-sm ml-5" variant="btn-outline-primary">Submit Task</Button>

                                <div className="ml-[15px] border-r-2 border-lightSilver justify-center  flex items-center lgd:h-[25px]">

                                </div>
                                <div className="ml-[40px] flex justify-center items-center">
                                    <span className="text-slatyGrey italic text-[16px]">
                                        {message}
                                    </span>
                                </div>
                            </div>


                        </div>
                    </div>
                ) : isTv ? (
                    // Render this content if variant is "selectedRows," retina is false, and mobile is also false
                    <div className={`lgd:px-[20px]`} ref={parentDivRef}>
                        <div className={containerClasses}>
                            <div className="gap-2.5 flex">
                                <div className="">
                                    <MinusIcon />
                                </div>
                                <span className="flex justify-center items-center pr-[15px]">
                                    {count} task selected
                                </span>
                            </div>
                            <div className="flex  lgd:flex justify-center items-center">
                                <div className="border-x-2 border-lightSilver items-center flex px-[10px] ">{firstIcon}</div>
                                {otherIcons.map((icon, index) => (
                                    <div key={index} className="border-r-2 border-lightSilver items-center flex px-[10px]">{icon}</div>
                                ))}
                                <Button className="rounded-md btn-sm ml-5" variant="btn-outline-primary">Submit Task</Button>
                            </div>

                            <div className="ml-[15px] border-r-2 border-lightSilver justify-center  flex items-center lgd:h-[25px]">

                            </div>
                            <div className="ml-[40px] flex justify-center items-center">
                                <span className="text-slatyGrey italic text-[14px]">
                                    {message}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : !isMobile && !isRetina && !isTv ? (
                    <div ref={parentDivRef}>
                        <div className={`bg-whiteSmoke rounded-[127px] w-[${getDynamicWidth("tablet")}] border-[1px] border-primary py-[10px]`}>
                            <div className="flex">
                                <div className="lgd:flex justify-center items-center">
                                    <MinusIcon />
                                </div>
                                <span className="flex justify-center items-center pr-[15px]">
                                    {count} task selected
                                </span>
                                <div className="border-x-2 border-lightSilver items-center flex">{firstIcon}</div>
                                {otherIcons.map((icon, index) => (
                                    <div key={index} className="border-r-2 border-lightSilver items-center flex">{icon}</div>
                                ))}
                                <Button className="rounded-md btn-sm ml-3" variant="btn-outline-primary">Submit Task</Button>

                                <div className="ml-[15px] border-r-2 border-lightSilver justify-center  flex items-center lgd:h-[25px]">

                                </div>
                                <div className="ml-[40px] flex justify-center items-center">
                                    <span className="text-slatyGrey italic text-[14px]">
                                        {message}
                                    </span>
                                </div>
                            </div>


                        </div>
                    </div>
                ) : (
                    // Render this content if variant is "selectedRows," retina is false, and mobile is true
                    <div
                        className={`fixed bottom-0 w-max h-full bg-pureWhite transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
                            } z-[60]`}
                    >
                        <div className="flex justify-between bg-pureWhite items-center w-max h-full py-2 px-5 border-b-[1px] border-[#D8D8D8]">
                            <div className="flex flex-row justify-center items-center">
                                <div className="mr-5">
                                    <NegativeSignIcon />
                                </div>
                                <div className="flex flex-col">
                                    <Typography type="h5">{count} task Selected</Typography>
                                    <Typography className="italic text-[#6E6D7A]">
                                        click on - button to select more
                                    </Typography>
                                </div>
                            </div>
                            <div onClick={onClose}>
                                <Close variant="small" />
                            </div>
                        </div>
                        <div className="p-4 bg-pureWhite">
                            <ul className="">
                                {items.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`flex w-full justify-between items-center ${index === items.length - 1
                                            ? ""
                                            : "border-b-[1px] border-[#D8D8D8]"
                                            }`}
                                    >
                                        <div className="flex py-4 flex-grow ">
                                            <span className=" flex items-center justify-center">
                                                {icons && icons.length > 0 ? icons[index].icon : null}
                                            </span>
                                            <Typography type="h6" className="ml-5">
                                                {item}
                                            </Typography>
                                        </div>
                                        <span className="flex ">
                                            <RightArrowIcon onClick={onOpenModal} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-5 border-t-[1px] border-[#D8D8D8]">
                                <Button
                                    className="rounded-md btn-md !w-full"
                                    variant="btn-outline-primary"
                                    onClick={onClose}
                                >
                                    Submit Task
                                </Button>
                            </div>
                        </div>
                    </div>

                )
            ) : (
                // Render this content for other variants
                <div className="flex justify-between">
                    <div className="flex relative items-center ">
                        {visibleTabs.map((tab: any, index: number) => (
                            <div onClick={() => handleTabClick(tab.id, index)} key={tab.id + index}>
                                <label
                                    className={`border-r ${index > tabs?.length - 2 ? "border-none" : "border-r-lightSilver"
                                        } px-5 cursor-pointer ${selectedTabIndex === index
                                            ? "text-primary text-base font-semibold"
                                            : "text-slatyGrey font-medium text-sm"
                                        }`}
                                >
                                    {tab.label}
                                </label>
                            </div>
                        ))}
                        {visibleTab < tabs?.length && (
                            <div ref={selectRef} className="cursor-pointer ">
                                <div onClick={handleToggleOpen} className="px-4 opacity-75">
                                    <MenuIcon size="small" direction="meatball" classname="w-full" />
                                </div>
                                <div>
                                    <ul
                                        className={`absolute w-[215px] py-2 z-[1] bg-pureWhite overflow-y-auto transition-transform drop-shadow-lg ${isopen
                                            ? "max-h-60 translate-y-0 transition-opacity opacity-100 duration-500 ease-out"
                                            : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
                                            }`}
                                    >
                                        {dropdownTabs.map((tab: any, index: number) => (
                                            <li
                                                key={tab.id}
                                                onClick={() =>
                                                    handleTabClick(
                                                        tab.id,
                                                        // visibleTabs.length +
                                                        index
                                                    )
                                                }
                                                className="p-2 hover:bg-whiteSmoke font-normal text-base cursor-pointer flex"
                                            >
                                                <label className="cursor-pointer">{tab.label}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 overflow-visible">
                        {icons &&
                            icons.map((info, index) => (
                                <div className={`flex items-center cursor-pointer ${index === icons.length - 1 ? 'mr-5' : ''}`} key={`icon-${index}`}>
                                    {info.name ? (
                                        <span content={info.name}>
                                            {info.icon}
                                        </span>
                                    ) : (
                                        info.icon
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </>
    );
};

export { PropertyBar };