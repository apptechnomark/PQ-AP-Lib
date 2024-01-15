import React, { useEffect, useRef, useState } from "react";
import ChevronRight from "./icons/ChevronRight";
import SortIcon from "./icons/SortIcon";
import styles from "./Datatable.module.scss";

interface AComponentProps {
  children: string;
}

interface BComponentProps {
  children: string;
}

interface ExpandableStyle {
  columns?: string;
  rows?: string;
}

interface Column {
  header: any;
  accessor: string;
  sortable: boolean;
  colStyle?: string;
  rowStyle?: string;
  colalign?: "left" | "center" | "right";
}

interface DataTableProps {
  columns: Column[];
  stickyPostion?: string;
  data: any[];
  align?: "left" | "center" | "right";
  expandable?: boolean;
  getExpandableData: (arg1: any) => void;
  getRowId?: (arg1: any) => void;
  isExpanded?: boolean;
  expandableStyle?: ExpandableStyle;
  sticky?: boolean;
  hoverEffect?: boolean;
  noHeader?: boolean;
  userClass?: string;
  isTableLayoutFixed?: boolean
  isRowDisabled?: boolean
}

const DataTable = ({
  columns,
  data,
  align = "left",
  stickyPostion,
  expandable,
  isExpanded = false,
  expandableStyle,
  getExpandableData,
  getRowId,
  sticky,
  hoverEffect,
  noHeader,
  userClass,
  isTableLayoutFixed,
  isRowDisabled = false
}: DataTableProps) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "" });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [columnStyle, setColumnStyle] = useState([])

  const handleSort = (columnKey: any) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleRowToggle = (rowIndex: any) => {
    getExpandableData(data[rowIndex]);
    const isRowExpanded = expandedRows.has(rowIndex);
    const newExpandedRows = new Set(expandedRows);

    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex);
    } else {
      newExpandedRows.clear();
      newExpandedRows.add(rowIndex);
    }

    setExpandedRows(newExpandedRows);
  };

  const handleGetIdHover = (rowIndex: any) => {
    getRowId(data[rowIndex]);
  };

  const handleGetIdClick = (rowIndex: any) => {
    getExpandableData(data[rowIndex]);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (React.isValidElement(aValue) && React.isValidElement(bValue)) {
        const aProps = aValue.props as AComponentProps;
        const bProps = bValue.props as BComponentProps;
        const aPropValue = aProps.children;
        const bPropValue = bProps.children;

        if (typeof aPropValue === "string" && typeof bPropValue === "string") {
          return sortConfig.direction === "asc"
            ? aPropValue.localeCompare(bPropValue)
            : bPropValue.localeCompare(aPropValue);
        } else if (
          typeof aPropValue === "number" &&
          typeof bPropValue === "number"
        ) {
          return sortConfig.direction === "asc"
            ? aPropValue - bPropValue
            : bPropValue - aPropValue;
        }
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      } else {
        // Handle other data types here if needed
        return 0;
      }
    });

    return sorted;
  }, [data, sortConfig]);

  const getAlignment = (align: string) => {
    switch (align) {
      case "left":
        return "start";
        break;
      case "center":
        return "center";
        break;
      case "right":
        return "end";
        break;
      default:
        return "start";
        break;
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setExpandedRows(new Set());
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <table ref={tableRef} className={`w-full ${!!isTableLayoutFixed ? 'table-fixed' : ''}`}>
      <thead className={`${sticky && styles.customDataTable} `}>
        <tr
          className={`w-full z-[5] top-0 ${sticky ? `${userClass ? `${userClass}` : `${stickyPostion} sticky`}  bg-pureWhite` : "static border-y border-pureBlack"
            } ${noHeader ? "hidden " : ""}`}
        >
          {expandable && (
            <th className={`w-8 ${expandableStyle?.columns}`}></th>
          )}
          {columns?.map((column, colIndex) => (
            <th
              className={`${column?.colStyle} p-2 font-proxima h-12 text-sm font-bold whitespace-nowrap ${column?.sortable ? "cursor-pointer" : "cursor-default"
                }`}
              key={colIndex}
              onClick={() => column?.sortable && handleSort(column?.accessor)}
            >
              {column?.sortable ? (
                <span
                  className={`flex items-center font-proxima justify-${getAlignment(
                    column?.colalign
                  )} gap-2`}
                >
                  {column?.header}
                  <SortIcon
                    order={
                      sortConfig?.key === column?.accessor &&
                      sortConfig?.direction
                    }
                  />
                </span>
              ) : (
                <span
                  className={`flex font-proxima items-center justify-${getAlignment(
                    column.colalign
                  )}`}
                >
                  {column.header}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData?.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr className={`${hoverEffect ? "hover:bg-[#f2f2f2]" : ""} ${isRowDisabled && sortedData.length !== (rowIndex + 1) ? `row-disabled` : ''}`}
              onMouseEnter={getRowId ? () => handleGetIdHover(rowIndex) : undefined}
              onMouseLeave={getRowId ? () => handleGetIdHover(null) : undefined}
              onClick={!getRowId && getExpandableData ? () => handleGetIdClick(rowIndex) : undefined}
            >
              {expandable &&
                (row?.details ? (
                  <td
                    className={`${expandableStyle?.rows} text-[14px] font-proxima h-12 ${expandedRows.has(rowIndex) ? "border-none" : "border-b"}  border-[#ccc] cursor-pointer`}
                    onClick={() => handleRowToggle(rowIndex)}
                  >
                    <div className={`flex justify-center items-center transition-transform ${expandedRows.has(rowIndex) || isExpanded ? "rotate-90 duration-300" : "duration-200"}`}>
                      <ChevronRight />
                    </div>
                  </td>
                ) : (
                  <td
                    className={`w-8 ${expandableStyle?.rows} h-12 text-[14px] pl-2 font-proxima ${expandedRows.has(rowIndex) ? "border-none" : "border-b"} ${noHeader && "border-t"} border-[#ccc] cursor-pointer`}
                  ></td>
                ))}
              {columns?.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={` ${row?.style} ${noHeader && column?.colStyle} ${column?.rowStyle} h-12 text-[14px] font-proxima py-1 px-1 ${expandedRows.has(rowIndex) ? "border-none" : "border-b"} border-[#ccc] break-all ${noHeader && "border-t"}`}
                >
                  <span
                    className={`flex py-2 px-1 text-[14px] font-proxima items-center justify-${getAlignment(
                      column?.colalign
                    )}`}
                  >
                    {row[column?.accessor]}
                  </span>
                </td>
              ))}
            </tr>
            {(expandedRows.has(rowIndex) || isExpanded) && (
              <tr>
                <td className="text-[14px] font-semibold font-proxima" colSpan={columns.length + 1}>
                  {row?.details ? (
                    row?.details
                  ) : (
                    <div className={`m-3 text-[14px] font-proxima ${expandableStyle?.rows}`}>
                      No data to display
                    </div>
                  )}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;