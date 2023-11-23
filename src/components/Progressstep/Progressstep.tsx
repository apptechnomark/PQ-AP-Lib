import React from "react";
import style from "./Progressstep.module.scss";

interface ProgressStepProps {
  total: number;
  current: number;
  icon?: JSX.Element;
  customized?: boolean;
  label?: Array<string>;
}

const ProgressStep = ({
  total,
  current,
  label,
  icon,
  customized,
}: ProgressStepProps) => {
  const totalSteps = Array.apply(null, new Array(total)).map(function (el, i) {
    return ++i;
  });

  const done = () => {
    return Math.floor((100 / total) * current);
  };

  return (
    <>
      {!customized ? (
        <div className="m-2 w-auto">
          <div className="mx-2 my-1 flex justify-between">
            <h6>{label && label[current - 1]}</h6>
            <h6>
              Step {current} of {total}
            </h6>
          </div>
          <div className="w-auto h-1 rounded-xl bg-slate-600">
            <div
              style={{ width: `${done()}%` }}
              className={`h-1 rounded-s-md bg-[#02b89d] duration-1000  ${done() === 100 ? "rounded-e-md" : ""
                }`}
            ></div>
          </div>
        </div>
      ) : (
        <div id={style.steps}>
          {totalSteps.map((step: number) => (
            <div
              key={step}
              className={`${style.step} ${step < current
                  ? style.done
                  : step === current
                    ? style.active
                    : ""
                }`}
              data-desc={label && label[step - 1]}
            >
              <span
                className={`${style.step__span} ${step === current ? style.span_active : ""
                  }`}
              >
                {icon ? <div className="h-4 w-4">{icon}</div> : step}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProgressStep;