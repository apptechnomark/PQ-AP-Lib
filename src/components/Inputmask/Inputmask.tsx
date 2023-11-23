import React, { useState, useEffect } from "react";
import Typography from "../Typography/Typography";
import { Text } from "../Textfield/Text";

interface InputMaskProps {
  type: string;
  setPrefix?: string;
  className?: string;
  setDelimiter?: string[];
  splitLengths?: number[];
  US?: boolean;
  label?: string;
  getValue: (arg1: string) => void;
}

const InputMask: React.FC<InputMaskProps> = ({
  type,
  setPrefix,
  className,
  setDelimiter,
  splitLengths,
  US,
  label,
  getValue
}) => {
  var array: string[] | undefined;
  array = setPrefix ? setPrefix.split("") : [];

  const [value, setValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasErrorMessage, setHasErrorMessage] = useState<boolean>(false);
  const [hasNoError, setHasNoError] = useState<boolean>(false);

  // const [originalValue, setOriginalValue] = useState<string>("");
  // const [maskedValue, setMaskedValue] = useState<string>("");

  const getDefaultLabel = (type: string) => {
    switch (type) {
      case "numeral":
        return "Numeral";
      case "date":
        return "Date";
      case "time":
        return "Time";
      case "credit":
        return "Credit Card";
      case "phone":
        return "Phone Number";
      case "delimiter":
        return "Delimiter";
      case "prefix":
        return "Prefix";
      default:
        return "Label";
    }
  };

  const getDefaultPlaceholder = (type: string) => {
    switch (type) {
      case "numeral":
        return "1,00,00,000";
      case "date":
        return US ? "DD/MM/YYYY" : "MM/DD/YYYY";
      case "time":
        return "15:58:25";
      case "credit":
        return "xxxx xxxx xxxx 1234";
      case "phone":
        return "9874 563 214";
      case "delimiter":
        return "Delimiter:'.'";
      case "prefix":
        return setPrefix || "+123";
    }
  };

  const getMaxLength = (type: string) => {
    switch (type) {
      case "time":
        return 8;
      case "phone":
        return 12;
      case "date":
        return 10;
      case "credit":
        return 19;
      default:
        return undefined;
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value || "";

    //prefix inputmask
    if (type === "prefix") {
      const prefixValue = setPrefix || "+123";
      const splitLength = splitLengths || [3, 3, 3, 4];

      if (inputValue === prefixValue) {
        setValue(prefixValue);
      } else if (inputValue.startsWith(prefixValue)) {
        const numericValue = inputValue
          .substring(prefixValue.length)
          .replace(/\D/g, "");

        let formattedValue = prefixValue;
        let currentIndex = 0;

        for (const length of splitLength) {
          const chunk = numericValue.substring(
            currentIndex,
            currentIndex + length
          );
          if (chunk) {
            formattedValue += " " + chunk;
          }
          currentIndex += length;
        }
        setValue(formattedValue);
        getValue(formattedValue);

      } else {
        setValue(prefixValue);
      }
    }
    //numeral inputmask
    else if (type === "numeral") {
      let numericValue = inputValue.replace(/[^0-9]/g, "");

      if (numericValue === "") {
        setValue("");
      } else {
        let reversed = numericValue.split("").reverse().join("");
        let result = reversed.match(/.{1,3}/g).join(",");
        let finalResult = result.split("").reverse().join("");

        setValue(finalResult);
        getValue(finalResult);
      }
    }

    //date inputmask
    else if (type === "date") {
      let inputValue = event.target.value || "";
      inputValue = inputValue.replace(/[^0-9]/g, "");

      let formattedValue = "";
      if (inputValue.length >= 1) {
        if (US) {
          const date = parseInt(inputValue.slice(0, 2));
          if (date >= 1 && date <= 31) {
            formattedValue = inputValue.slice(0, 2);
          } else {
            formattedValue = "31";
          }
        } else {
          const month = parseInt(inputValue.slice(0, 2));
          if (month >= 1 && month <= 12) {
            formattedValue = inputValue.slice(0, 2);
          } else {
            formattedValue = "12";
          }
        }
      }

      if (inputValue.length >= 3) {
        if (US) {
          const month = parseInt(inputValue.slice(2, 4));
          if (month >= 1 && month <= 12) {
            formattedValue += "/" + inputValue.slice(2, 4);
          } else {
            formattedValue += "/12";
          }
        } else {
          const date = parseInt(inputValue.slice(2, 4));
          if (date >= 1 && date <= 31) {
            formattedValue += "/" + inputValue.slice(2, 4);
          } else {
            formattedValue += "/31";
          }
        }

      }
      if (inputValue.length >= 5) {
        const year = parseInt(inputValue.slice(4, 8));
        if (year > 0 && year <= 2099) {
          formattedValue += "/" + inputValue.slice(4, 8);
        } else {
          formattedValue += "/2099";
        }
      }

      setValue(formattedValue);
      getValue(formattedValue);
    }

    //time inputmask
    else if (type === "time") {
      let inputValue = event.target.value || "";
      let updatedValue = inputValue.slice(0, 8);
      inputValue = inputValue.replace(/[^0-9]/g, "");
      let hasError = false;

      if (updatedValue == "00:00:00") {
        hasError = true;
        setErrorMessage("Time can't be 00:00:00");
      } else {
        setErrorMessage("");
      }

      let formattedValue = "";
      if (inputValue.length >= 1) {
        const hours = parseInt(inputValue.slice(0, 2));
        if (hours >= 0 && hours <= 23) {
          formattedValue = inputValue.slice(0, 2);
        } else {
          formattedValue = "23";
        }
      }

      if (inputValue.length >= 3) {
        const minutes = parseInt(inputValue.slice(2, 4));
        if (minutes >= 0 && minutes <= 59) {
          formattedValue += ":" + inputValue.slice(2, 4);
        } else {
          formattedValue += ":59";
        }
      }

      if (inputValue.length >= 5) {
        const seconds = parseInt(inputValue.slice(4, 6));
        if (seconds >= 0 && seconds <= 59) {
          formattedValue += ":" + inputValue.slice(4, 6);
        } else {
          formattedValue += ":59";
        }
      }
      setHasErrorMessage(hasError);
      setValue(formattedValue);
      getValue(formattedValue);
    }

    //credit card inputmask
    else if (type === "credit") {
      let inputValue = event.target.value || "";
      inputValue = inputValue.replace(/\s/g, "");
      inputValue = inputValue.replace(/[^\d]/g, "");
      inputValue = inputValue.slice(0, 16);
      let hasError = false;
      let formattedValue = "";

      for (let i = 0; i < inputValue.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += " ";
        }
        formattedValue += inputValue[i];
      }
      if (formattedValue == "0000 0000 0000 0000") {
        hasError = true;
        setErrorMessage("Credit card number can't be 0000 0000 0000 0000");
      } else {
        setErrorMessage("");
      }
      setHasErrorMessage(hasError);
      setValue(formattedValue);
      getValue(formattedValue);

      //   let inputValue = event.target.value || "";
      //   inputValue = inputValue.replace(/\s/g, "");
      //   inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, "");
      //   inputValue = inputValue.slice(0, 16);
      //   let newFormattedValue = "";

      //   for (let i = 0; i < inputValue.length; i++) {
      //     if (i > 11 && i <= 15) {
      //       newFormattedValue += inputValue[i];
      //     } else {
      //       newFormattedValue += 'x';
      //     }
      //   }

      //   // Update both original and masked values
      //   setOriginalValue(inputValue);
      //   setMaskedValue(newFormattedValue);
      // }
    }

    //phone number inputmask
    else if (type === "phone") {
      let inputValue = event.target.value || "";
      inputValue = inputValue.replace(/\s/g, "");
      inputValue = inputValue.replace(/[^\d]/g, "");
      inputValue = inputValue.slice(0, 10);
      let hasError = false;

      let formattedValue = "";
      for (let i = 0; i < inputValue.length; i++) {
        if (i === 4 || i === 7) {
          formattedValue += " ";
        }
        formattedValue += inputValue[i];
      }

      if (formattedValue == "0000 000 000") {
        hasError = true;
        setErrorMessage("Phone number can't be 0000 000 000");
      } else {
        setErrorMessage("");
      }
      setHasErrorMessage(hasError);
      setValue(formattedValue);
      getValue(formattedValue);

    }
    //delimiter inputmask
    else if (type === "delimiter") {
      let inputValue = event.target.value || "";
      if (!inputValue) {
        setValue("");
        return;
      }
      inputValue = inputValue.replace(
        new RegExp((setDelimiter || ["·", "·"]).join("|"), "g"),
        ""
      );
      let formattedValue = "";
      let delimiterIndex = 0;
      let currentLength = 0;
      for (let i = 0; i < inputValue.length; i++) {
        formattedValue += inputValue[i];
        currentLength++;
        if (
          delimiterIndex < (setDelimiter || ["·", "·"]).length &&
          currentLength === (splitLengths || [3, 3, 3])[delimiterIndex]
        ) {
          formattedValue += (setDelimiter || ["·", "·"])[delimiterIndex];
          delimiterIndex++;
          currentLength = 0;
        }
      }
      setValue(formattedValue);
      getValue(formattedValue);
    }
  };

  const defaultLabel = getDefaultLabel(type);
  const defaultPlaceholder = getDefaultPlaceholder(type);
  const maxLength = getMaxLength(type);

  const handleBlur = () => {
    if (type === "phone") {
      if (value.length < 12) {
        setHasErrorMessage(true);
        setErrorMessage("Minimum 10 digits required");
      } else {
        setHasErrorMessage(false);
        setErrorMessage("");
      }
    }
    if (type === "credit") {
      if (value.length < 12) {
        setHasErrorMessage(true);
        setErrorMessage("Minimum 16 digits required");
      } else {
        setHasErrorMessage(false);
        setErrorMessage("");
      }
    } else if (type == "time" && hasErrorMessage) {
      setHasErrorMessage(true);
      setErrorMessage("Time can't be 00:00:00");
    }
    else if (type == "phone" && hasErrorMessage) {
      setHasErrorMessage(true);
      setErrorMessage("Phone number can't be 0000 000 000");
    }
    else if (type == "credit" && hasErrorMessage) {
      setHasErrorMessage(true);
      setErrorMessage("Credit card number can't be 0000 0000 0000 0000");
    }
    else if (value.trim() === "") {
      setHasErrorMessage(true);
      setErrorMessage("This is a required field!");
    } else {
      setHasErrorMessage(false);
      setErrorMessage("");
    }
  };

  return (
    <>
      <Typography type="label" className="block text-slatyGrey">
        {label || defaultLabel}
      </Typography>
      <Text
        onChange={changeHandler}
        value={value}
        onBlur={handleBlur}
        placeholder={defaultPlaceholder}
        validate
        maxLength={maxLength}
        errorMessage={errorMessage}
        getValue={(e: any) => setValue(e)}
        getError={(e: any) => setHasNoError(e)}
        hasError={hasErrorMessage}
      />
    </>
  );
};

export default InputMask;