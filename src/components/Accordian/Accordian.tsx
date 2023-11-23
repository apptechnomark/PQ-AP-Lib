import React, { useState } from "react";
import Typography from "../Typography/Typography";
import ChevronDown from "./icons/ChevronDown";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  dataCollection: AccordionItem[];
  label?: string;
  icon?: boolean;
  one?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  dataCollection,
  label,
  icon,
  one,
}) => {
  const [activeAccordions, setActiveAccordions] = useState<number[]>([]);
  const toggleAccordion = (index: number) => {
    if (activeAccordions.includes(index)) {
      setActiveAccordions(activeAccordions.filter((i) => i !== index));
    } else {
      setActiveAccordions([...activeAccordions, index]);
    }
  };

  const toggleAccordionOne = (index: number) => {
    if (activeAccordions.includes(index)) {
      setActiveAccordions([]);
    } else {
      setActiveAccordions([index]);
    }
  };

  return (
    <div className="px-10 py-5 mx-auto">
      {label && (
        <div>
          <Typography type="label">{label}</Typography>
        </div>
      )}

      <div className="w-full">
        {dataCollection.map((item, index) => (
          <div
            key={index}
            className={`border border-[#fff] border-b-lightSilver cursor-pointer`}
            onClick={
              one
                ? () => toggleAccordionOne(index)
                : () => toggleAccordion(index)
            }
          >
            <div
              className={`flex justify-between py-4 px-3 hover:bg-whiteSmoke ${
                activeAccordions.includes(index) ? "bg-whiteSmoke" : ""
              }`}
            >
              <Typography
                type="h6"
                className={`${
                  activeAccordions.includes(index)
                    ? "text-darkCharcoal "
                    : "text-darkCharcoal"
                }`}
              >
                {item.question}
              </Typography>

              <span className="flex justify-center items-center ml-6">
                {icon ? (
                  <div>
                    <div className="w-[16px] h-[2px] bg-darkCharcoal"></div>

                    <div
                      className={`w-[16px] bg-darkCharcoal transition-all duration-500 ${
                        activeAccordions.includes(index)
                          ? "plus h-0"
                          : "transform translate-x-0 -translate-y-0.5 -rotate-90 h-[2px]"
                      }`}
                    ></div>
                  </div>
                ) : (
                  <span
                    className={`transition-all duration-500 ${
                      activeAccordions.includes(index) ? "-rotate-180" : ""
                    }`}
                  >
                    <ChevronDown />
                  </span>
                )}
              </span>
            </div>

            <div>
              <Typography
                type="h6"
                className={`text-darkCharcoal px-3 transition-all duration-[600ms] ${
                  activeAccordions.includes(index) ? "my-2" : ""
                }`}
              >
                {activeAccordions.includes(index) ? `${item.answer}` : ""}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export { Accordion };
