import React from "react";
import style from "./Progressstep.module.scss";

interface ProgressStepProps {
  steps: any[]
  activeStep: number,
  isClickEnable?: boolean,
  getCurrentStep: (arg1: number) => void
}

const ProgressStep = ({
  steps,
  activeStep,
  isClickEnable = false,
  getCurrentStep }: ProgressStepProps) => {
  return (
    <div className="w-full flex gap-2">
      {steps.map((step: number, index: number) => (<React.Fragment key={index + Math.random()}>
        <div key={index + Math.random() + step} className="w-full flex h-fit flex-col relative justify-center items-center">
          <div className="relative z-[1] rounded-full" style={{ background: "transparent" }}>
            <button id={step + index + ""} className={`w-8 h-8 select-none  rounded-full border-2
              ${activeStep < index ? 'border-lightSilver' : "border-primary"}
              ${(activeStep < index) && !isClickEnable ? 'pointer-events-none cursor-default' : "cursor-pointer"}
              ${activeStep < index ? "bg-whiteSmoke" : activeStep > index ? `bg-primary ${!isClickEnable ? "pointer-events-none cursor-default" : ""}` : "bg-lightPrimary"}
              `}
              onClick={() => getCurrentStep(index)}>
              <label className={`text-base font-medium font-proxima cursor-pointer ${activeStep < index ? "text-slatyGrey" : activeStep > index ? "text-pureWhite" : "text-primary"} `}>{index + 1}</label>

            </button >
            {(activeStep == index) && <span className="absolute z-[-1] !top-[2.1px] !left-[1.6px] flex inset-0 rounded-full overflow-visible">
              <span className={`${style.rippleAnimation} absolute !w-7 !h-7 rounded-full opacity-50`}/>
            </span>}
          </div>
          <label htmlFor={step + index + ""} className={`text-base flex ${isClickEnable ? "cursor-pointer" : "pointer-events-none cursor-default"} justify-center items-center text-center w-full mt-2 font-medium font-proxima ${activeStep < index ? "text-slatyGrey" : "text-primary"} `}>{step}</label>
        </div>
        {!(steps.length - 1 === index) && <div key={index + Math.random()} className={`${activeStep > index ? 'bg-primary' : "bg-lightSilver"} w-full h-0.5 mt-[14px]`}></div>}
      </React.Fragment>))
      }
    </div >
  );
};

export default ProgressStep;