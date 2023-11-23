import React, { useState, useEffect } from "react";
import CheckBox from "../Checkbox/Checkbox";
import SortingIcon from "./icons/SortingIcon";
import ChevronIcon from "./icons/ChevronIcon";
import Style from "./Table.module.scss";

interface TableHeader {
  heading: string;
  field: string;
  sort: boolean;
}

interface TableProps {
  className?: any;
  data: any[];
  headers: TableHeader[];
  sortable?: boolean;
  sticky?: boolean;
  selected?: boolean;
  action?: boolean;
  actions?: any[];
  actionHeading?: string | React.ReactNode;
  expandable?: boolean;
  JsxComponents?:
  | Record<string, React.ComponentType<any>>
  | JSX.Element
  | React.ReactNode;
  actionDesc?: any[];
  expandableHeading?: boolean;
  getRowId?: (rowData: any) => void;
  getAction?: any;
  actionSticky?: boolean;
}

const Table: React.FC<TableProps> = (props) => {
  const [filteredData, setFilteredData] = useState<any[]>(props.data);
  const [sortingColumn, setSortingColumn] = useState<string>("");
  const [sortingOrder, setSortingOrder] = useState<string>("asc");
  const [isAllChecked, setIsAllChecked] = useState<boolean[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  
  useEffect(() => {
    setFilteredData(props.data)
  },[props.data])
  
  
  const toggleRowExpansion = (index: number) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // function for handling select and deselect all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const updatedArray = filteredData.map((_item, index) => checked);
    setIsAllChecked(updatedArray);
    setIsChecked(checked);
  };

  const handleSort = (column: string, isSortable: boolean) => {
    if (!isSortable) return;

    const sortedData = [...filteredData];

    let newSortingOrder = "asc";
    if (column === sortingColumn && sortingOrder === "asc") {
      newSortingOrder = "desc";
    }

    sortedData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return valueA - valueB;
      } else {
        return 0;
      }
    });

    if (newSortingOrder === "desc") {
      sortedData.reverse();
    }

    setFilteredData(sortedData);
    setSortingColumn(column);
    setSortingOrder(newSortingOrder);
  };

  useEffect(() => {
    // Function to close the "Hello" message when clicking outside the action div
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".action-div")) {
        setSelectedRowIndex(-1);
      }
    };

    // Attach the event listener when the "Hello" message is open
    if (selectedRowIndex !== -1) {
      document.addEventListener("click", handleOutsideClick);
    }

    // Clean up the event listener when the component unmounts or the "Hello" message is closed
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedRowIndex]);

  const actionItem = (props.actionDesc ?? []).map((name: any, index) => {
    return (
      <React.Fragment key={name + index}>
        <li
          onClick={() => props.getAction(name)}
          key={index}
          className="flex w-full h-9 px-3 hover:bg-lightGray !cursor-pointer"
        >
          <div className="flex justify-center items-center ml-2 cursor-pointer">
            <label className="inline-block text-xs cursor-pointer">
              {name}
            </label>
          </div>
        </li>
      </React.Fragment>
    );
  });

  // function for selecting single row
  const handleCheckRow = (index: number, checked: boolean) => {
    const updatedArray = [...isAllChecked];
    updatedArray[index] = checked;
    setIsAllChecked(updatedArray);

    // Check if any of the checkboxes in the rows are unchecked
    const anyUnchecked = updatedArray.some((value) => !value);

    // Update the main checkbox state in the header accordingly
    setIsChecked(!anyUnchecked);

    setSelectedRowIndex(checked ? index : -1);
  };

  const detectExpandableKey = (): string | null => {
    if (props.expandable && props.data.length > 0) {
      const firstItem = props.data[0];
      for (const key in firstItem) {
        if (Array.isArray(firstItem[key])) {
          return key;
        }
      }
    }
    return null;
  };

  const nestedKey = props.expandable ? detectExpandableKey() : null;
  return (
    <div
      className={`w-full h-screen ${props.className} ${Style.table_container}`}
    >
      <table className="w-full">
        <thead>
          <tr
            className={`${props.sticky
              ? "sticky top-0 z-[2] drop-shadow-md"
              : "border-y border-b-pureBlack border-t-pureBlack"
              } bg-pureWhite h-[48px] w-full`}
          >
            {props.expandable && <th></th>}
            {props.selected && (
              <th className="sm:w-[56px]">
                <CheckBox

                  id="selectAll"
                  checked={isChecked}
                  onChange={handleSelectAll}
                />
              </th>
            )}

            {props.headers.map((header) => (
              <th
                key={header.field}
                className="cursor-pointer text-[16px] sm:text-[14px] font-bold uppercase"
                onClick={() => {
                  handleSort(header.field, header.sort);
                }}
              >
                <span className="flex justify-start items-center pl-[10px]">
                  <div className="flex items-center">
                    {header.heading}
                    {header.sort && (
                      <span
                        className={`ml-2 ${sortingOrder === "asc" ? "" : "rotate-180"
                          }`}
                      >
                        <SortingIcon />
                      </span>
                    )}
                  </div>
                </span>
              </th>
            ))}

            {props.action && (
              <th
                className={`cursor-pointer text-[16px] sm:text-[14px] font-bold uppercase ${props.actionHeading && "w-[10px] pr-5"} ${props.actionSticky ? `${Style.sticky_action_column}` : ""
                  }`}
              >
                {props.actionHeading ? props.actionHeading : "Actions"}
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => (
            <React.Fragment key={index}>
              <tr
                className={`h-[56px] cursor-default hover:bg-whiteSmoke ${props.expandable && expandedRows[index]
                  ? "bg-whiteSmoke border-b border-b-lightSilver"
                  : "border-b border-b-lightSilver"
                  }`}
              >
                {props.expandable && (
                  <td className="sm:w-[56px]">

                    {item[nestedKey] && item[nestedKey].length > 0 ? (
                      <button
                        onClick={() => toggleRowExpansion(index)}
                        className={`transition-all duration-300 ${expandedRows[index] && "-rotate-180"
                          }`}
                      >
                        <ChevronIcon />
                      </button>
                    ) : (
                      <div style={{ width: "24px" }} />
                    )}
                  </td>
                )}

                {props.selected && (
                  <td className="sm:w-[56px]">

                    <CheckBox
                      id={index.toString()}
                      checked={isAllChecked[index]}
                      onChange={(e) => {
                        e.stopPropagation(); 
                        handleCheckRow(index, e.target.checked);
                      }}
                    />
                  </td>
                )}

                {props.headers.map((header,index) => (
                  <td
                    key={index}
                    className="py-[19px] sm:py-[12px] pl-[10px] sm:text-base font-normal"
                  >
                    <span className="flex justify-start items-center">
                      {typeof item[header.field] === "string" &&
                        item[header.field].startsWith("http") ? (
                        <img
                          src={item[header.field]}
                          alt="Item"
                          className="max-w-[50px] max-h-[50px] rounded"
                        />
                      ) : props.JsxComponents &&
                        props.JsxComponents[header.field] ? (
                        <div>
                          {React.createElement(
                            props.JsxComponents[header.field],
                            {
                              data: item[header.field],
                            }
                          )}
                        </div>
                      ) : (
                        item[header.field]
                      )}
                    </span>
                  </td>
                ))}

                {props.action &&
                  props.actions &&
                  props.actions.map((action) => (
                    <td
                      
                      key={action}
                      className={`${props.actionSticky
                        ? `${Style.sticky_action_column} hover:bg-whiteSmoke`
                        : ""
                        } ${props.sticky && index === selectedRowIndex
                          ? "right-0 !z[2]"
                          : ""
                        }`}
                    >
                      <div onClick={() => {
                        if (props.getRowId) {
                          props.getRowId(item);
                          setSelectedRowIndex(index);
                        }
                      }}>{action}</div>
                      {selectedRowIndex === index && (
                        <div className="action-div relative z-10 flex justify-center items-center">
                          <div className="visible absolute top-4 right-12 w-fit h-auto py-2 border border-lightSilver rounded-md bg-pureWhite shadow-lg ">
                            <div className="w-40 h-auto ">
                              <ul className="w-40">{actionItem}</ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
              </tr>


              {props.expandable && expandedRows[index] && nestedKey && item[nestedKey] && (<>

                <tr
                  className={`p-4   ${props.expandable && expandedRows[index]
                    ? "bg-whiteSmoke"
                    : "border-b border-b-lightSilver"
                    }`}
                >
                  <td colSpan={props.headers.length + 1}>
                    <table className="w-[100%] ">
                      <thead>
                        <tr>
                          <th></th>
                          {item[nestedKey].length > 0 &&
                            Object.keys(item[nestedKey][0]).map((key,index) => (
                              <th key={index}></th>
                            ))}
                        </tr>
                      </thead>

                      <tbody>
                        {item[nestedKey].map((child, index) => (
                          <tr className=" bg-pureWhite   border-b border-b-lightSilver hover:bg-whiteSmoke" key={index}>
                            <td></td>
                            {Object.values(child).map((value: any, valueIndex) => (
                              <td
                                key={valueIndex}
                                className="py-[19px] sm:py-[12px] pl-[10px] sm:text-base font-normal"
                              >
                                <span className="flex justify-start items-start">
                                  {value}
                                </span>
                              </td>

                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </td>
                </tr>
              </>)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
