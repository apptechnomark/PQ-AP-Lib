import React from "react";
import style from "./Progressstep.module.scss";

interface ProgressStepProps {
  steps: any[]
  activeStep: number,
  getCurrentStep: (arg1: number) => void
}

const ProgressStep = ({ steps, activeStep, getCurrentStep }: ProgressStepProps) => {


  return (
    <>
      <div className="w-full flex gap-2 py-2">
        {steps.map((step: number, index: number) => (<>
          <div key={step + Math.random()} className="w-full flex flex-col  justify-center items-center">
            <button className={`w-8 h-8 relative flex justify-center items-center rounded-full border-2 ${activeStep < index ? 'border-[#F6F6F6]' :"border-primary"}  ${activeStep < index ? 'bg-[#F6F6F6]' : activeStep > index ? "bg-[#02B89D]" : "bg-[#A9ECE1]"}"`}
              onClick={() => getCurrentStep(index)}>
              <label className={`text-base font-medium font-proxima ${activeStep < index ? "text-slatyGrey" : activeStep > index ? "text-pureWhite" : "text-primary"} `}>{index + 1}</label>
          {(activeStep == index) && <span className="absolute flex inset-0 rounded-full overflow-visible">
            <span
              className={`${style.rippleAnimation} absolute !w-7 !h-7 rounded-full bg-primary opacity-50`}
            ></span>
          </span>}
        </button >
        <label className={`text-base mt-2 font-medium font-proxima ${activeStep < index ? "text-slatyGrey" : "text-primary"} `}>{step}</label>
          </div>
      {!(steps.length - 1 === index) && <div className="bg-primary w-full h-0.5 mt-[16px]"></div>}
    </>))
}
      </div >
    </>
  );
};

export default ProgressStep;