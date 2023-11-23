import React, { useEffect, useRef, useState } from "react";
import { Button } from "../Button/Button";
import Typography from "../Typography/Typography";
import { Avatar } from "../Avatar/Avatar";
import { CompanyList } from "../CompanyList/CompanyList";
import "../CompanyList/CompanyList.module.scss";
import Send from "./icons/Send";
import Attach from "./icons/Attach";

interface CommentSentBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    options: { label: string; value: string; imageUrl?: string }[];
    variant?: "default" | "commentSentBox";
    getValue?: (values: string[]) => void;
    getInputValue?: (value: string) => void;
    getCompanyListValue?: (value: string[]) => void;
}

const CommentSentBox: React.FC<CommentSentBoxProps> = ({ options, getValue, getInputValue, getCompanyListValue, variant = "default" }) => {
    const [list, setList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [mentioning, setMentioning] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setMessage(text);
        setInputValue(text);

        if (text.endsWith("@")) {
            setIsOpen(true);
            setSearchValue("");
        } else {
            setIsOpen(false); // Close the ul when "@" is not at the end of the text
            setSearchValue(text.toLowerCase().substring(text.lastIndexOf("@") + 1));
        }
    };

    const handleSelect = (value: string) => {
        const updatedValues = [...selectedValues];
        const index = updatedValues.indexOf(value);
        if (index > -1) {
            updatedValues.splice(index, 1);
        } else {
            updatedValues.push(value);
        }
        setSelectedValues(updatedValues);

        // Set the selected value in the input field
        const updatedInputValue = inputValue.replace(/@[^\s@]*$/, `${value}`);
        setInputValue(updatedInputValue);
        setIsOpen(false);
    };

    const handleAttachButtonClick = () => {
        // Trigger the file input click when the Attach button is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setInputValue(selectedFile.name);

            setSelectedFile(selectedFile);
        }
    };

    const handleSendButtonClick = () => {
        // Get the text and the selected file information
        const text = inputValue;
        const file = selectedFile;

        // Clear the input field and reset the selected file
        getValue(selectedValues);


        // Call the getInputValue prop with the message value when the "Send" button is clicked
        getInputValue(message);

        getCompanyListValue(list)

        setInputValue("");
        setSelectedFile(null);
    };

    const ulRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ulRef.current && !ulRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    return (
        <>
            {variant === "commentSentBox" ? (<><div className="rounded relative border border-lightSilver w-auto h-[75px]">
                <input
                    className="focus:outline-none w-full py-[18px] text-pureBlack px-[20px] font-medium"
                    placeholder="Type a new message OR type @ if you want to mention anyone in the message."
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div className="absolute w-full px-5 bottom-0">
                    <ul
                        ref={ulRef}
                        className={`absolute z-10 w-[300px] bg-pureWhite mt-[1px] overflow-y-auto shadow-md transition-transform ${isOpen
                            ? "max-h-60 translate-y-0 transition-opacity opacity-100 duration-500"
                            : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
                            } ${isOpen ? "ease-out" : ""}`}
                    >
                        {options.length > 0 &&
                            options.some((option) =>
                                option.label.toLowerCase().startsWith(searchValue)
                            ) ? (
                            options.map((option, index) => (
                                <li
                                    key={option.value + index}
                                    className={`outline-none focus:bg-whiteSmoke p-[10px] text-[14px] hover:bg-whiteSmoke font-normal cursor-pointer flex items-center ${selectedValues.includes(option.value)
                                        ? "bg-whiteSmoke"
                                        : ""
                                        } ${!option.label.toLowerCase().startsWith(searchValue)
                                            ? "hidden"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        if (option.value !== inputValue) {
                                            handleSelect(option.value);
                                        }
                                    }}
                                >
                                    <div className="mx-2 flex-shrink-0 items-center text-[1.5rem] text-darkCharcoal">
                                        <Avatar
                                            variant="small"
                                            name={option.label}
                                            imageUrl={option.imageUrl}
                                        />
                                    </div>
                                    <Typography type="h6">{option.label}</Typography>
                                </li>
                            ))
                        ) : null}
                    </ul>
                </div>

                {searchValue === "@" ? (
                    <span className="p-[10px] focus:bg-whiteSmoke text-[15px] hover.bg-whiteSmoke font-medium cursor-pointer flex flex-row items-center space-x-2 ">
                        No matching data found.
                    </span>
                ) : null}

                <div className="flex mt-5 ml-3 justify-between">
                    <div className="w-[250px]">
                        <CompanyList
                            id="company"
                            showAvatar={3}
                            label=""
                            noborder
                            options={options}
                            getError={() => { }}
                            getValue={(e: any) => {
                                setList(e);
                                setInputValue("");
                            }}
                        />
                    </div>

                    <div className="flex justify-end">
                        <div className="mr-5 mt-1 cursor-pointer" onClick={handleAttachButtonClick}>
                            <Attach />
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg, .jpeg, .png, .gif, .pdf" // Specify the file types you want to accept
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <div>
                            <Button className="rounded-md mr-2" variant="btn-primary" onClick={handleSendButtonClick}>
                                <Send />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
                <ul>
                    {list.map((item) => (
                        <li className="bg-red-500" key={item.value}>
                            {item.label}
                        </li>
                    ))}
                </ul></>) : (<>
                    <div className="rounded flex  relative border border-lightSilver w-auto h-[75px]">

                        <div className="flex-grow">
                            <input
                                className="focus:outline-none w-full py-[18px] px-[20px] font-medium"
                                placeholder="Type a new message OR type @ if you want to mention anyone in the message."
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="inline-flex items-center justify-end">
                            <div className="mr-5 mt-1 cursor-pointer" onClick={handleAttachButtonClick}>
                                <Attach />
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg, .jpeg, .png, .gif, .pdf" // Specify the file types you want to accept
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <div>
                                <Button className="rounded-md mr-2" variant="btn-primary" onClick={handleSendButtonClick}>
                                    <Send />
                                </Button>
                            </div>
                        </div>
                        <div className="absolute w-full px-5 bottom-0">
                            <ul
                                ref={ulRef}
                                className={`absolute z-10 w-[300px] bg-pureWhite mt-[1px] overflow-y-auto shadow-md transition-transform ${isOpen
                                    ? "max-h-60 translate-y-0 transition-opacity opacity-100 duration-500"
                                    : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
                                    } ${isOpen ? "ease-out" : ""}`}
                            >
                                {options.length > 0 &&
                                    options.some((option) =>
                                        option.label.toLowerCase().startsWith(searchValue)
                                    ) ? (
                                    options.map((option, index) => (
                                        <li
                                            key={option.value + index}
                                            className={`outline-none focus:bg-whiteSmoke p-[10px] text-[14px] hover:bg-whiteSmoke font-normal cursor-pointer flex items-center ${selectedValues.includes(option.value)
                                                ? "bg-whiteSmoke"
                                                : ""
                                                } ${!option.label.toLowerCase().startsWith(searchValue)
                                                    ? "hidden"
                                                    : ""
                                                }`}
                                            onClick={() => {
                                                if (option.value !== inputValue) {
                                                    handleSelect(option.value);
                                                }
                                            }}
                                        >
                                            <div className="mx-2 flex-shrink-0 items-center text-[1.5rem] text-darkCharcoal">
                                                <Avatar
                                                    variant="small"
                                                    name={option.label}
                                                    imageUrl={option.imageUrl}
                                                />
                                            </div>
                                            <Typography type="h6">{option.label}</Typography>
                                        </li>
                                    ))
                                ) : null}
                            </ul>
                        </div>

                        {searchValue === "@" ? (
                            <span className="p-[10px] focus:bg-whiteSmoke text-[15px] hover.bg-whiteSmoke font-medium cursor-pointer flex flex-row items-center space-x-2 ">
                                No matching data found.
                            </span>
                        ) : null}

                        <div className="flex mt-5 ml-3 justify-between">

                        </div>
                    </div>
                    <ul>
                        {list.map((item) => (
                            <li className="bg-red-500" key={item.value}>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </>)}

        </>
    );
};

export { CommentSentBox };