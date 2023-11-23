import React, {
  useState,
  ChangeEvent,
  useEffect,
  InputHTMLAttributes,
} from "react";
import { Dot, Check, EyeOpen, EyeClose } from "./icons/icons";

interface PasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  validate?: boolean;
  novalidate?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  getValue: (arg1: string) => void;
  getError: (arg1: boolean) => void;
  hasError?: boolean;
  props?: any;
  minChar?: number;
  maxChar?: number;
}

const Password: React.FC<PasswordProps> = ({
  label,
  className,
  onBlur,
  validate,
  novalidate,
  errorMessage = "This is a required field!",
  getValue,
  getError,
  hasError,
  disabled,
  minChar = 8,
  maxChar = 20,
  ...props
}) => {
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [err, setErr] = useState(false);
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMes, setErrorMsg] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    setErrorMsg(errorMessage);
    setErr(hasError);
  }, [hasError, errorMessage]);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newData = e.target.value;
    setPassword(newData);
    setData(newData);
    setOpen(true);
    if (err) {
      setErr(false);
    }
    getValue(newData);
  };

  interface RequirementItem {
    regex: RegExp;
    index: number;
  }

  const requirements: RequirementItem[] = [
    { regex: /[^A-Za-z0-9]/, index: 0 },
    { regex: /[A-Z]/, index: 1 },
    { regex: /[a-z]/, index: 2 },
    { regex: /[0-9]/, index: 3 },
    { regex: /\s/, index: 4 },
    { regex: new RegExp(`.{${minChar},${maxChar}}`), index: 5 },
  ];

  const requirementList = [
    "1 Special Character",
    "1 Uppercase",
    "1 Lowercase",
    "1 Number",
    "No Space Allowed",
    `Minimum ${minChar} and Maximum ${maxChar} Characters`,
  ];

  const validatePassword = (): JSX.Element[] => {
    let isAllValid = true;

    const requirementsList = requirements.map((item) => {
      let isValid;
      if (item.index === 4 && password.length > 0) {
        isValid = !item.regex.test(password);
      } else if (item.index === 5 && password.length! > maxChar) {
        isValid = !item.regex.test(password);
      } else {
        isValid = item.regex.test(password);
      }
      const requirementItemClass = isValid ? "valid" : "";

      if (!isValid) {
        isAllValid = false;
      }

      return (
        <li
          key={item.index}
          className={`${requirementItemClass} flex items-center justify-left text-darkCharcoal text-xs passwordsm:text-base passwordmd:text-lg`}
        >
          {isValid ? (
            <span className="ml-[5px] my-[6px] text-[18px] text-successColor">
              <Check />
            </span>
          ) : (
            <span className="text-3xl text-lightSilver">
              <Dot />
            </span>
          )}
          <span
            className={`${
              isValid &&
              "line-through ml-[7px] decoration-slatyGrey text-slatyGrey"
            }`}
          >
            {requirementList[item.index]}
          </span>
        </li>
      );
    });
    if (isAllValid) {
      setOpen(false);
    }
    return requirementsList;
  };

  const validateInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      setErr(true);
      setOpen(false);
      setErrorMsg(errorMessage);
    } else if (
      !e.target.value.match(/[^A-Za-z0-9]/) ||
      !e.target.value.match(/[A-Z]/) ||
      !e.target.value.match(/[a-z]/) ||
      !e.target.value.match(/[0-9]/) ||
      e.target.value.match(/\s/) ||
      e.target.value.length! < minChar ||
      e.target.value.length! > maxChar
    ) {
      setErr(true);
      setOpen(false);
      setErrorMsg("Please fill details according to the requirements.");
      getError(false);
    } else {
      setErr(false);
      getError(true);
    }
  };

  const handleFocus = () => {
    setFocus(true);
    setOpen(true);
  };

  const focusHandler = () => {
    setFocus(false);
    setOpen(false);
  };

  const getPasswordStrength = () => {
    let strength = "password";

    if (
      data.match(/[A-Z]/) &&
      data.match(/[a-z]/) &&
      data.match(/[0-9]/) &&
      !data.match(/\s/) &&
      data.length >= minChar &&
      data.length <= maxChar
    ) {
      strength = "Excellent";
    } else if (
      data.match(/[A-Z]/) &&
      data.match(/[a-z]/) &&
      data.match(/[0-9]/)
    ) {
      strength = "Good";
    } else if (password.length >= 3 && data.match(/[a-z]/)) {
      strength = "Too weak";
    }

    return strength;
  };

  const validateNull = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      setErr(true);
      setOpen(false);
      setErrorMsg(errorMessage);
    } else {
      setErr(false);
      getError(true);
    }
  };

  return (
    <div className="relative flex flex-col text-[14px] w-full">
      <div className="relative w-full">
        {!novalidate && open && (
          <>
            <div
              className={`absolute bottom-[30px] z-10 left-0 bg-pureWhite shadow-2xl py-4 pl-2 pr-4 text-[16px] sm-text-[14px] w-fit`}
            >
              <ul className="requirement-list">{validatePassword()}</ul>
            </div>
            <span
              className={`w-2 h-2 bg-pureWhite z-10 absolute bottom-[26px] left-[20px] rotate-[45deg]`}
            ></span>
          </>
        )}

        {label && (
          <span className="flex">
            <label
              className={`${
                err
                  ? "text-defaultRed"
                  : focus
                  ? "text-primary"
                  : "text-slatyGrey"
              }`}
            >
              {label}
            </label>
            {validate && (
              <span
                className={`${disabled ? "text-slatyGrey" : "text-defaultRed"}`}
              >
                &nbsp;*
              </span>
            )}
          </span>
        )}
      </div>

      <div
        className={`${
          !err &&
          "relative inline-block before:absolute before:bottom-0 before:left-0 before:block before:w-0 before:h-px before:bg-primary before:transition-width before:duration-[800ms] before:ease-in hover:before:w-full"
        }`}
      >
        <input
          className={`${className} py-1 border-b outline-none w-full pr-10 ${
            err
              ? "border-defaultRed text-defaultRed placeholder-defaultRed"
              : focus
              ? "border-primary"
              : "border-lightSilver"
          }`}
          type={type}
          value={password}
          onChange={handlePasswordChange}
          onBlur={
            novalidate
              ? validateNull
              : onBlur
              ? onBlur
              : validate
              ? validateInput
              : validate
              ? focusHandler
              : undefined
          }
          onFocus={handleFocus}
          disabled={disabled}
          {...props}
        />
      </div>
      {type === "password" ? (
        <span
          className={`absolute ${
            !label ? "top-2" : "top-6"
          } right-1 text-md sm:text-lg ${
            err ? "text-defaultRed" : "text-darkCharcoal"
          }`}
          onClick={() => setType("text")}
        >
          <EyeClose />
        </span>
      ) : (
        <span
          className={`absolute ${
            !label ? "top-2" : "top-6"
          } right-[7px] text-md sm:text-lg ${
            err ? "text-defaultRed" : "text-darkCharcoal"
          }`}
          onClick={() => setType("password")}
        >
          <EyeOpen />
        </span>
      )}

      <div className="flex flex-col justify-center w-full">
        {!novalidate && password && (
          <div className="mt-2 flex items-center">
            <div className="relative w-[150px] sm:w-[180px] h-[5px] rounded-lg bg-[#979797]">
              <span
                className={`absolute rounded-l-lg h-[5px] ${
                  data.match(/[A-Z]/) &&
                  data.match(/[a-z]/) &&
                  data.match(/[0-9]/) &&
                  !data.match(/\s/) &&
                  data.length >= minChar &&
                  data.length <= maxChar
                    ? "bg-successColor w-[150px] sm:w-[180px] rounded-lg"
                    : data.match(/[A-Z]/) &&
                      data.match(/[a-z]/) &&
                      data.match(/[0-9]/)
                    ? "bg-[#FFBF00] sm:w-[100px]"
                    : password.length >= 3 && data.match(/[a-z]/)
                    ? "bg-defaultRed sm:w-[45px]"
                    : "bg-[#979797]"
                }`}
              ></span>
            </div>
            <span className="ml-4 text-xs sm:text-sm">
              {getPasswordStrength()}
            </span>
          </div>
        )}
        {err && (
          <span className={`text-defaultRed text-[12px] sm:text-[14px]`}>
            {errorMes}
          </span>
        )}
      </div>
    </div>
  );
};

export { Password };
