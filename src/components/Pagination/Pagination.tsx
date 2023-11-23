import React, { useEffect, useState, useRef } from "react";
import ChevronsLeft from "./icons/ChevronsLeft";
import ChevronLeft from "./icons/ChevronLeft";
import ChevronDown from "./icons/ChevronDown";
import styles from "./pagination.module.scss";
import Typography from "../Typography/Typography";

interface PaginationProps {
  totalPages: number;
  space?: boolean | String;
  variant: any;
  disabled?: boolean;
  onChangePage: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  const selectRef = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<number>(1);

  const handleScreenSizeChange = () => {
    if (window.innerWidth <= 768) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  // for screen changing
  useEffect(() => {
    handleScreenSizeChange();
    window.addEventListener("resize", handleScreenSizeChange);
    return () => {
      window.removeEventListener("resize", handleScreenSizeChange);
    };
  }, []);

  const handleClick = (pageNumber: number | string) => {
    if (pageNumber === "...") {
      return;
    }
    setIsOpen(false);
    setCurrentPage(Number(pageNumber));
    props.onChangePage(Number(pageNumber));
  };

  const handleFirstPage = () => {
    if (currentPage !== 1) {
      handleClick(1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleClick(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < props.totalPages) {
      handleClick(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage !== props.totalPages) {
      handleClick(props.totalPages);
    }
  };

  const { totalPages, space, variant } = props;

  let pageNumbers: (number | string)[] = [];

  if (totalPages <= 5) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 3) {
      pageNumbers = [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      pageNumbers = [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pageNumbers = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }
  }

  // page changing conditions for small screens
  if (isSmallScreen) {
    if (currentPage <= 2) {
      pageNumbers = [1, 2, "...", totalPages];
    } else if (currentPage >= totalPages - 1) {
      pageNumbers = [1, "...", totalPages - 1, totalPages];
    } else {
      pageNumbers = [1, currentPage, "...", totalPages];
    }
  }

  //Style for main container
  const containerClassName = `flex items-center mt-4`;

  // Common style for normal (Next, Prev) buttons
  const buttonStyles = `${isSmallScreen ? "px-2" : "px-3"} py-2 text-[14px] `;

  // Common style for arrow buttons
  const arrowButtonStyle = `p-[4px] hover:bg-whiteSmoke rounded cursor-pointer`;

  // common style for pages button in space variant
  const pagesSpaceStyle = `py-[1px] px-[9px] rounded text-[14px] `;

  // Common Style for first page number in variant - without space
  const firstPageNumStyle = `py-[1px] px-[9px] rounded-l-lg text-[14px]  ml-2`;

  // Common style for last page number in variant - without space
  const lastPageNumStyle = `py-[1px] px-[9px] rounded-r-lg text-[14px] mr-2`;

  // common Style for Middle page numbers for variant without space
  const middlePageNumStyle = `py-[1px] px-[9px] text-[14px] `;

  // Styel for current page number
  const currentPageNumStyle = `bg-secondaryPrimary border border-primary text-darkCharcoal`;

  // Style for default Page Numbers with variant space
  const defaultPageNumSpaceStyle = `text-darkCharcoal bg-pureWhite border border-lightSilver hover:bg-whiteSmoke`;

  // Style for default page numbers for variant without space
  const defaultPageNumStyle = `text-darkCharcoal bg-pureWhite border-t border-r border-b border-lightSilver hover:bg-whiteSmoke`;

  const handleToggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSearchInputChange = (e: any) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // for prop variant = "buttons"
  return variant === "vertical" ? (
    <div
      className={`relative flex items-baseline ${styles.customScrollbar}`}  ref={selectRef}>
      <Typography className="text-[16px] font-medium mr-2.5">Page</Typography>
      <div className="w-[80px]">
        <div className="h-[42px] relative flex items-center">
          <input
            type="text"
            onClick={handleToggleOpen}
            onChange={handleSearchInputChange}
            readOnly={true}
            value={isOpen ? searchValue : currentPage}
            className={`border-[1px] border-lightSilver rounded-lg outline-none py-2 px-[15px] bg-white ${
              props.disabled ? "text-slatyGrey" : "text-darkCharcoal"
            } text-[16px] font-normal w-full
          `}
          />
          <div
            onClick={handleToggleOpen}
            className={`absolute right-[10px] text-[1.5rem] ${
              props.disabled
                ? "text-slatyGrey cursor-default"
                : "text-darkCharcoal cursor-pointer"
            } ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown />
          </div>
        </div>

        <ul
          className={`absolute w-[80px] bg-pureWhite border-[1px] mt-2.5 border-lightSilver rounded-lg overflow-y-auto shadow-md transition-transform
             ${
               isOpen
                 ? "max-h-[200px] translate-y-0 transition-opacity opacity-100 duration-500 ease-out "
                 : "max-h-0 translate-y-20 transition-opacity opacity-0 duration-500 "
             }
             `}
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <li
              key={number}
              className={`py-[8px] px-[15px] text-[14px] hover:bg-whiteSmoke font-normal cursor-pointer flex flex-row items-center space-x-2 ${
                number === currentPage ? "bg-whiteSmoke" : ""
              }`}
              onClick={() => {
                if (number !== currentPage) {
                  handleClick(number);
                }
              }}
            >
              <Typography className="text-[16px] font-normal">
                {number}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
      <Typography className="text-[16px] font-medium ml-2.5">
        of {totalPages}
      </Typography>
    </div>
  ) : variant === "buttons" ? (
    // for "space" prop
    space ? (
      <div className={containerClassName}>
        <button
          className={`${buttonStyles} ${
            currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handleFirstPage()}
          disabled={currentPage === 1}
        >
          First
        </button>
        <span className="text-lightSilver">|</span>
        <button
          className={`${buttonStyles} ${
            currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handlePrevPage()}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <div className="flex">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`${pagesSpaceStyle} ${
                currentPage === pageNumber
                  ? currentPageNumStyle
                  : defaultPageNumSpaceStyle
              } ${isSmallScreen ? "ml-1" : "ml-2"}`}
              onClick={() => handleClick(Number(pageNumber))}
              disabled={currentPage === pageNumber || pageNumber === "..."}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <button
          className={`${buttonStyles} ${
            currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handleNextPage()}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span className="text-lightSilver">|</span>
        <button
          className={`${buttonStyles} ${
            currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handleLastPage()}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    ) : (
      // buttons without space
      <div className={containerClassName}>
        <button
          className={`${buttonStyles} ${
            currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handleFirstPage()}
          disabled={currentPage === 1}
        >
          First
        </button>
        <span className="text-lightSilver">|</span>
        <button
          className={`${buttonStyles} ${
            currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handlePrevPage()}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <div className="flex">
          {pageNumbers.map((pageNumber, index) => {
            if (!space && index === 0) {
              return (
                <button
                  key={pageNumber}
                  className={`${firstPageNumStyle} ${
                    currentPage === pageNumber
                      ? currentPageNumStyle
                      : defaultPageNumSpaceStyle
                  }`}
                  onClick={() => handleClick(Number(pageNumber))}
                  disabled={currentPage === pageNumber || pageNumber === "..."}
                >
                  {pageNumber}
                </button>
              );
            } else if (index === pageNumbers.length - 1) {
              return (
                <button
                  key={pageNumber}
                  className={`${lastPageNumStyle} ${
                    currentPage === pageNumber
                      ? currentPageNumStyle
                      : defaultPageNumStyle
                  }`}
                  onClick={() => handleClick(Number(pageNumber))}
                  disabled={currentPage === pageNumber || pageNumber === "..."}
                >
                  {pageNumber}
                </button>
              );
            } else {
              return (
                <button
                  key={pageNumber}
                  className={`${middlePageNumStyle} ${
                    currentPage === pageNumber
                      ? currentPageNumStyle
                      : defaultPageNumStyle
                  }`}
                  onClick={() => handleClick(Number(pageNumber))}
                  disabled={currentPage === pageNumber || pageNumber === "..."}
                >
                  {pageNumber}
                </button>
              );
            }
          })}
        </div>
        <button
          className={`${buttonStyles} ${
            currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handleNextPage()}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span className="text-lightSilver">|</span>
        <button
          className={`${buttonStyles} ${
            currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
          }`}
          onClick={() => handleLastPage()}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    )
  ) : // arrows with space
  space ? (
    <div className={containerClassName}>
      <button
        className={`${arrowButtonStyle} ${
          currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
        }`}
        onClick={() => handleFirstPage()}
        disabled={currentPage === 1}
      >
        {/* Left Icon */}
        <div className="text-[20px]">
          <ChevronsLeft />
        </div>
      </button>
      {/* <span className="text-lightSilver">|</span> */}
      <button
        className={`${arrowButtonStyle} ${
          currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
        }`}
        onClick={() => handlePrevPage()}
        disabled={currentPage === 1}
      >
        <div className="text-[20px]">
          <ChevronLeft />
        </div>
      </button>
      <div className="flex">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`${pagesSpaceStyle} ${
              currentPage === pageNumber
                ? currentPageNumStyle
                : "text-darkCharcoal hover:bg-whiteSmoke"
            } ${isSmallScreen ? "ml-1" : "ml-2"}`}
            onClick={() => handleClick(Number(pageNumber))}
            disabled={currentPage === pageNumber || pageNumber === "..."}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        className={`${arrowButtonStyle} ${
          currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
        } ${isSmallScreen ? "ml-1" : "ml-2"}`}
        onClick={() => handleNextPage()}
        disabled={currentPage === totalPages}
      >
        <div className="text-[20px] rotate-180">
          <ChevronLeft />
        </div>
      </button>
      {/* <span className="text-lightSilver">|</span> */}
      <button
        className={`${arrowButtonStyle} ${
          currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
        }`}
        onClick={() => handleLastPage()}
        disabled={currentPage === totalPages}
      >
        <div className="text-[20px] rotate-180">
          <ChevronsLeft />
        </div>
      </button>
    </div>
  ) : (
    // arrows without space
    <div className={containerClassName}>
      <button
        className={`${arrowButtonStyle} ${
          currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
        }`}
        onClick={() => handleFirstPage()}
        disabled={currentPage === 1}
      >
        <div className="text-[20px]">
          <ChevronsLeft />
        </div>
      </button>
      <button
        className={`${arrowButtonStyle} ${
          currentPage === 1 ? "text-slatyGrey" : "text-darkCharcoal"
        }`}
        onClick={() => handlePrevPage()}
        disabled={currentPage === 1}
      >
        <div className="text-[20px]">
          <ChevronLeft />
        </div>
      </button>
      <div className="flex">
        {pageNumbers.map((pageNumber, index) => {
          if (!space && index === 0) {
            return (
              <button
                key={pageNumber}
                className={`${firstPageNumStyle} ${
                  currentPage === pageNumber
                    ? currentPageNumStyle
                    : defaultPageNumSpaceStyle
                }`}
                onClick={() => handleClick(Number(pageNumber))}
                disabled={currentPage === pageNumber || pageNumber === "..."}
              >
                {pageNumber}
              </button>
            );
          } else if (index === pageNumbers.length - 1) {
            return (
              <button
                key={pageNumber}
                className={`${lastPageNumStyle} ${
                  currentPage === pageNumber
                    ? currentPageNumStyle
                    : defaultPageNumStyle
                }`}
                onClick={() => handleClick(Number(pageNumber))}
                disabled={currentPage === pageNumber || pageNumber === "..."}
              >
                {pageNumber}
              </button>
            );
          } else {
            return (
              <button
                key={pageNumber}
                className={`${middlePageNumStyle} ${
                  currentPage === pageNumber
                    ? currentPageNumStyle
                    : defaultPageNumStyle
                }`}
                onClick={() => handleClick(Number(pageNumber))}
                disabled={currentPage === pageNumber || pageNumber === "..."}
              >
                {pageNumber}
              </button>
            );
          }
        })}
      </div>
      <button
        className={`${arrowButtonStyle} ${
          currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
        }`}
        onClick={() => handleNextPage()}
        disabled={currentPage === totalPages}
      >
        <div className="text-[20px] rotate-180">
          <ChevronLeft />
        </div>
      </button>
      {/* <span className="text-lightSilver">|</span> */}
      <button
        className={`${arrowButtonStyle} ${
          currentPage === totalPages ? "text-slatyGrey" : "text-darkCharcoal"
        }`}
        onClick={() => handleLastPage()}
        disabled={currentPage === totalPages}
      >
        <div className="text-[20px] rotate-180">
          <ChevronsLeft />
        </div>
      </button>
    </div>
  );
};

export default Pagination;
