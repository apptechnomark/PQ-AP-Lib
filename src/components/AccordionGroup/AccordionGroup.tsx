import React, { useState } from "react";
import ArrowUp from "./icons/ArrowUp";
import ArrowDown from "./icons/ArrowDown";

interface AccordionItem {
  title: string;
  children?: AccordionItem[] | JSX.Element;
  action?: JSX.Element;
}

interface AccordionData extends AccordionItem {
  children?: AccordionItem[];
}

interface AccordionGroupProps {
  data: AccordionData;
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({ data }) => {
  const [openIndex, setOpenIndex] = useState<string[]>([]);

  const toggleAccordion = (index: string) => {
    if (index[0] === "1") {
      setOpenIndex(openIndex.includes(index) ? [] : [index]);
    } else {
      const selectedItems = openIndex
        ? openIndex.filter(
            (item) =>
              item[0] !== index[0] && Number(item[0]) <= Number(index[0])
          )
        : [];

      setOpenIndex(
        openIndex.includes(index) ? selectedItems : [...selectedItems, index]
      );
    }
  };

  const Accordion = ({ title, children, level, action, index }: any) => {
    const isOpen = openIndex.includes(index) ? true : false;
    const paddingLeft = level * 22;

    return (
      <div
        className={`${index} border-t last:border-b ${
          level === 1 ? "border-[#6E6D7A]" : "border-[#D8D8D8]"
        }`}
      >
        <div
          style={{ paddingLeft }}
          className={`flex cursor-pointer items-center justify-between hover:bg-[#F6F6F6] ${
            level === 1
              ? "bg-[#F6F6F6] py-2.5"
              : `${"props" in action ? "py-[9px]" : "py-[15px]"}`
          }`}
          onClick={() => toggleAccordion(index)}
        >
          <div className="flex items-center">
            {!!children && (isOpen ? <ArrowUp /> : <ArrowDown />)}
            <span
              className={`pl-4 text-sm ${
                level !== 1 ? "font-bold uppercase" : "font-semibold"
              }`}
            >
              {title}
            </span>
          </div>
          <div>{action}</div>
        </div>
        {isOpen && <div>{children}</div>}
      </div>
    );
  };

  const NestedAccordion = ({ data, level = 1, action = [] }) => {
    return (
      <div>
        {!!data && Array.isArray(data) && data.length > 0 ? (
          data.map((item: any, index: number) => (
            <Accordion
              key={index}
              index={`${level}${index + 1}`}
              title={item.title}
              level={level}
              action={item.action || action}
            >
              {item.children && (
                <NestedAccordion
                  data={item.children}
                  level={level + 1}
                  action={action}
                />
              )}
            </Accordion>
          ))
        ) : (
          <>{data}</>
        )}
      </div>
    );
  };

  return <NestedAccordion data={data} />;
};
export { AccordionGroup };
