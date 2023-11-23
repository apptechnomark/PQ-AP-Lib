import React, { useEffect, useRef, useState } from "react";

import CheckBox from "../Checkbox/Checkbox";
import "../Checkbox/checkbox.module.scss";
import { Text } from "../Textfield/Text";
import CrossIcon from "./icons/CrossIcon";
import SearchIcon from "./icons/Search.js";
import styles from "./search.module.scss";

interface SearchProps {
  variant?: 'rounded' | 'dropdown' | 'animated' | 'inputsearch';
  options?: { value: string; label: string }[];
  type?: string;
  Data?: string[];
  getValue?: (results: string[]) => void;
}

function SearchBar({ variant, options, type, Data, getValue }: SearchProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<string[]>(Data);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setSearchTerm("");
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const filteredResults = Data?.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [searchTerm, Data]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      getValue(filteredData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const selectRef = useRef<HTMLDivElement>(null);

  const isRounded = variant === "rounded";
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const openDropdownOnClick = () => {
    if (options) {
      toggleDropdown();
      setOpen(!open)
    }

  };

  const handleCheckboxChange = (value: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

  const selectedDisplay = selected.length > 0 && (
    <div className="flex flex-wrap justify-center items-center">
      {selected.slice(0, 1).map((selectedValue) => {
        const selectedOption = options.find(
          (option) => option.value === selectedValue
        );
        return (
          <div
            key={selectedValue}
            className={`flex items-center  badge bg-[#E9ECEF] text-[#212529] border border-[#CED4DA] rounded-sm px-1 mr-[3px] ml-[1px] mt-[1px] mb-2 text-[14px] ${selectedOption?.label.length > 8 ? "max-w-[100px]" : ""
              }`}
          >
            <span title={selectedOption?.label}>
              {selectedOption?.label.length > 8
                ? selectedOption?.label.substring(0, 8) + "..."
                : selectedOption?.label}
            </span>

            <div
              onClick={() => handleSelect(selectedValue)}
              className="ml-1 cursor-pointer"
            >
              <CrossIcon />
            </div>
          </div>
        );
      })}
      {selected.length > 1 && (
        <div className="flex items-center badge bg-[#E9ECEF] text-darkCharcoal border border-[#CED4DA] rounded-sm px-1 mb-2 text-[14px]">
          +{selected.length - 1}
        </div>
      )}
    </div>
  );

  const handleSelect = (value: string) => {
    const selectedIndex = selected.indexOf(value);
    let updatedSelected: string[];

    if (selectedIndex === -1) {
      const selectedOption = options.find((option) => option.value === value);
      updatedSelected = [
        ...selected,
        selectedOption ? selectedOption.value : value,
      ];
    } else {
      updatedSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(updatedSelected);
  };


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const clearValue = () => {
    setSelected([]);
    openDropdownOnClick()
  }




  return (

    <div>
      {variant === "dropdown" ? (
        <>
          <div className={`relative ${styles.customScrollbar}`} ref={selectRef} >
            <div className="flex relative py-2 pl-[15px] pr-[12px] w-[250px] border-[1px] border-[#D8D8D8] rounded-3xl hover:border-[#00B0AE]">
              <div className="flex justify-center items-center  cursor-pointer" onClick={openDropdownOnClick}>
                <SearchIcon />
              </div>
              <div className={`flex justify-center items-center cursor-pointer ${open ? "rotate-180 text-primary duration-400" : "duration-200"}`} onClick={openDropdownOnClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="5" viewBox="0 0 9 5" fill="none">
                  <path d="M4.15 5L0 0.851064L0.851282 0L4.15 3.29787L7.44872 0L8.3 0.851064L4.15 5Z" fill="#6E6D7A" />
                </svg>
              </div>

              <div
                onClick={() => { setOpen(true) }}
                className={`shrink-0 w-fit h-[26px] ml-[3px]  text-[14px] font-normal  ${open
                  ? "text-primary cursor-default"
                  : selected.length === 0
                    ? "text-darkCharcoal cursor-pointer"
                    : ""
                  } `}
              >
                {selectedDisplay}
              </div>

              <div className="w-fit bg-slate-600 flex-1 ">
                <Text
                  type="text"
                  placeholder={selected.length > 0 ? "" : "Default Search"}
                  noborder
                  onClick={openDropdownOnClick}
                  getValue={(value) => setInputValue(value)}
                  getError={() => { }} />
              </div>
              {open && (
                <div className={`flex absolute right-3 top-4 justify-center items-center cursor-pointer `} onClick={clearValue} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M0.749509 10L0 9.2311L4.20467 5L0 0.768897L0.749509 0L5 4.2083L9.25049 0L10 0.768897L5.79533 5L10 9.2311L9.25049 10L5 5.7917L0.749509 10Z" fill="#6E6D7A" />
                  </svg>
                </div>
              )}
            </div>
            {
              options && (<>
                <ul
                  className={`absolute z-[1] top-[50px] left-0 w-[250px] bg-pureWhite overflow-y-auto shadow-md transition-transform ${open
                    ? "max-h-40 translate-y-0 transition-opacity opacity-100 duration-500 ease-out"
                    : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500"
                    } `}
                >
                  {options.length > 0 &&
                    options.map((option, index) => (
                      <li
                        key={index}
                        className={`outline-none focus:bg-whiteSmoke p-[10px] text-[14px] hover:bg-whiteSmoke font-normal cursor-pointer flex items-center ${selectedValues.includes(option.value) ? "bg-whiteSmoke" : ""
                          } ${!option.label.toLowerCase().startsWith(inputValue)
                            ? "hidden"
                            : ""
                          }`}
                        onClick={
                          type !== "checkbox"
                            ? () => {
                              if (option.value !== inputValue) {
                                handleSelect(option.value);
                              }
                            }
                            : undefined
                        }
                      >
                        <CheckBox
                          id={option.value}
                          checked={selected.includes(option.value)}
                          onChange={() => handleCheckboxChange(option.value)}
                          label={option.label}
                        />
                      </li>
                    ))}
                </ul>
              </>)
            }
          </div>
        </>

      ) : variant === "animated" ? (

        <form className={styles.search}>
          <input
            type="text"
            id="search"
            className={styles.search__input}
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className={styles.search__button}
            onClick={handleSearch}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_8148_121547"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_8148_121547)">
                <path
                  d="M10.0726 15.1424C8.6561 15.1424 7.45654 14.6512 6.47393 13.6689C5.49131 12.6865 5 11.4873 5 10.0712C5 8.65508 5.49131 7.45585 6.47393 6.4735C7.45654 5.49117 8.6561 5 10.0726 5C11.4891 5 12.6887 5.49117 13.6713 6.4735C14.6539 7.45585 15.1452 8.65508 15.1452 10.0712C15.1452 10.6634 15.0458 11.2289 14.8469 11.768C14.648 12.307 14.3827 12.7758 14.0509 13.1745L18.8237 17.9459C18.9385 18.0607 18.9973 18.2051 18.9999 18.3789C19.0026 18.5527 18.9438 18.6997 18.8237 18.8198C18.7035 18.9399 18.5578 19 18.3866 19C18.2154 19 18.0697 18.9399 17.9495 18.8198L13.1768 14.0484C12.762 14.3907 12.2851 14.6586 11.7459 14.8521C11.2068 15.0456 10.649 15.1424 10.0726 15.1424ZM10.0726 13.8985C11.1414 13.8985 12.0466 13.5278 12.7884 12.7862C13.5301 12.0447 13.901 11.1397 13.901 10.0712C13.901 9.00272 13.5301 8.09771 12.7884 7.35616C12.0466 6.61462 11.1414 6.24384 10.0726 6.24384C9.00383 6.24384 8.09857 6.61462 7.35682 7.35616C6.61508 8.09771 6.24421 9.00272 6.24421 10.0712C6.24421 11.1397 6.61508 12.0447 7.35682 12.7862C8.09857 13.5278 9.00383 13.8985 10.0726 13.8985Z"
                  fill="#6E6D7A"
                />
              </g>
            </svg>
          </button>
        </form>

      ) : variant === "inputsearch" ? (<>
        <div className="relative top-[25px] w-[25px] z-[1]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <mask id="mask0_8362_114461" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_8362_114461)">
              <path d="M18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.325 18.925C20.5083 19.1083 20.6 19.3333 20.6 19.6C20.6 19.8667 20.5 20.1 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z" fill="#333333" />
            </g>
          </svg>
        </div>
        <div className="w-[250px]">

          <Text placeholder="Search" className="pl-[30px]" getValue={() => { }} getError={() => { }} />
        </div>


      </>) : (
        <div>
          <div className={`font-Arial relative ml-30 w-[250px] border-[1px] ${isRounded ? 'rounded' : ''} border-[#D8D8D8] rounded-5 p-[12px] hover:border-[#00B0AE]`}>
            <button className="h-auto bg-white absolute left-0 border-none pl-[12px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="search">
                  <mask id="mask0_8538_63412" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect id="Bounding box" width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_8538_63412)">
                    <path id="search_2" d="M10.0726 15.1424C8.6561 15.1424 7.45654 14.6512 6.47393 13.6689C5.49131 12.6865 5 11.4873 5 10.0712C5 8.65508 5.49131 7.45585 6.47393 6.4735C7.45654 5.49117 8.6561 5 10.0726 5C11.4891 5 12.6887 5.49117 13.6713 6.4735C14.6539 7.45585 15.1452 8.65508 15.1452 10.0712C15.1452 10.6634 15.0458 11.2289 14.8469 11.768C14.648 12.307 14.3827 12.7758 14.0509 13.1745L18.8237 17.9459C18.9385 18.0607 18.9973 18.2051 18.9999 18.3789C19.0026 18.5527 18.9438 18.6997 18.8237 18.8198C18.7035 18.9399 18.5578 19 18.3866 19C18.2154 19 18.0697 18.9399 17.9495 18.8198L13.1768 14.0484C12.762 14.3907 12.2851 14.6586 11.7459 14.8521C11.2068 15.0456 10.649 15.1424 10.0726 15.1424ZM10.0726 13.8985C11.1414 13.8985 12.0466 13.5278 12.7884 12.7862C13.5301 12.0447 13.901 11.1397 13.901 10.0712C13.901 9.00272 13.5301 8.09771 12.7884 7.35616C12.0466 6.61462 11.1414 6.24384 10.0726 6.24384C9.00383 6.24384 8.09857 6.61462 7.35682 7.35616C6.61508 8.09771 6.24421 9.00272 6.24421 10.0712C6.24421 11.1397 6.61508 12.0447 7.35682 12.7862C8.09857 13.5278 9.00383 13.8985 10.0726 13.8985Z" fill="#6E6D7A" />
                  </g>
                </g>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Default Search"
              className="w-[200px] ml-4 text-24px border-none outline-none pl-4"
            />
          </div>

        </div>
      )
      }
    </div >
  )
};

export { SearchBar };
