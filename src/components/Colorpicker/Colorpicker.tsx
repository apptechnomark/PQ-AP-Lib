import React, { useRef, useState, useEffect } from "react";
import Styles from "./Colorpicker.module.scss";

interface ColorPickerProps {
  value?: any;
  onChange?: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = (props: any) => {
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [colorBoxValue, setColorBoxValue] = useState("");
  const [rgba, setRGBA] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [opacityPercentage, setOpacityPercentage] = useState(100);
  const [hex, setHex] = useState("#ff0000");
  const [value, setValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDragging2, setIsDragging2] = useState(false);
  const [cursorPosition2, setCursorPosition2] = useState({ x: 0, y: 0 });
  const [colorBlockRGBA, setColorBlockRGBA] = useState({
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  });

  const [isInputFocused, setIsInputFocused] = useState(false);

  const colorBlockRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const colorBlock = colorBlockRef.current;
    const ctx_colorBlock = colorBlock?.getContext("2d");
    const colorBlockWidth = colorBlock?.width || 0;
    const colorBlockHeight = colorBlock?.height || 0;

    const colorBlockState = {
      x: 0,
      y: 0,
    };
    const colorPickerState = {
      drag: false,
      rgbaColor: hex,
    };

    if (ctx_colorBlock) {
      ctx_colorBlock.rect(0, 0, colorBlockWidth, colorBlockHeight);
      fillColorBlockGradient();
    }

    function fillColorBlockGradient() {
      if (ctx_colorBlock) {
        ctx_colorBlock.fillStyle = colorPickerState.rgbaColor;
        ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);

        let grdWhite = ctx_colorBlock.createLinearGradient(
          0,
          0,
          colorBlockWidth,
          0
        );
        grdWhite.addColorStop(0, "rgba(255, 255, 255, 1)");
        grdWhite.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx_colorBlock.fillStyle = grdWhite;
        ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);

        let grdBlack = ctx_colorBlock.createLinearGradient(
          0,
          0,
          0,
          colorBlockHeight
        );
        grdBlack.addColorStop(0, "rgba(0, 0, 0, 0)");
        grdBlack.addColorStop(1, "rgba(0, 0, 0, 1)");
        ctx_colorBlock.fillStyle = grdBlack;
        ctx_colorBlock.fillRect(0, 0, colorBlockWidth, colorBlockHeight);
      }
    }

    function mousedownColorBlock(e: MouseEvent) {
      e.preventDefault();
      colorPickerState.drag = true;
      changeColorVariable(e);
      setCursorPosition2({ x: e.clientX, y: e.clientY });
    }

    function mousemoveColorBlock(e: MouseEvent) {
      if (colorPickerState.drag) {
        changeColorVariable(e);
        setCursorPosition2({ x: e.clientX, y: e.clientY });
      }
    }

    function mouseupColorBlock(e: MouseEvent) {
      colorPickerState.drag = false;
    }

    function mouseoutColorBlock(e: MouseEvent) {
      colorPickerState.drag = false;
    }

    function changeColorVariable(e?: MouseEvent) {
      if (e) {
        colorBlockState.x = e.offsetX;
        colorBlockState.y = e.offsetY;
      }
      if (ctx_colorBlock) {
        let imageData = ctx_colorBlock.getImageData(
          colorBlockState.x,
          colorBlockState.y,
          1,
          1
        ).data;
        const newRGBA = {
          r: imageData[0],
          g: imageData[1],
          b: imageData[2],
          a: 1,
        };
        setColorBlockRGBA(newRGBA); // Set the new RGBA value for the color block
        setHex(getHexColor(newRGBA));
      }
    }

    if (colorBlock) {
      colorBlock.addEventListener("mousedown", mousedownColorBlock);
      colorBlock.addEventListener("mousemove", mousemoveColorBlock);
      colorBlock.addEventListener("mouseup", mouseupColorBlock);
      colorBlock.addEventListener("mouseout", mouseoutColorBlock);
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && colorPickerRef.current) {
        updateColorAndPosition(event);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      colorPickerRef.current?.classList.remove("dragging");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (colorBlock) {
        colorBlock.removeEventListener("mousedown", mousedownColorBlock);
        colorBlock.removeEventListener("mousemove", mousemoveColorBlock);
        colorBlock.removeEventListener("mouseup", mouseupColorBlock);
        colorBlock.removeEventListener("mouseout", mouseoutColorBlock);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isInputFocused]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    
    setHex(newHex);
    setRGBA({ ...rgba, ...getRGBAFromHex(newHex) });
    updateCursorPosition(newHex); 
  };
  
  const updateCursorPosition = (newHex: string) => {
    const color = getRGBAFromHex(newHex);
    const percentageX = getColorPercentageX(color);
    const cursorX = (percentageX / 100) * colorPickerRef.current!.offsetWidth;
    setCursorPosition({ x: cursorX, y: cursorPosition.y });
  };

  const getColorPercentageX = (color: {
    r: number;
    g: number;
    b: number;
    a: number;
  }) => {
    const { r, g, b } = color;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let hue: number;
    if (diff === 0) {
      hue = 0;
    } else if (max === r) {
      hue = ((g - b) / diff) % 6;
    } else if (max === g) {
      hue = (b - r) / diff + 2;
    } else {
      hue = (r - g) / diff + 4;
    }

    const percentageX = (hue / 6) * 100;
    return percentageX;
  };
  const handleInputFocus = () => {
    setIsInputFocused(true);
    setHex(hex);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  useEffect(() => {
    const newRGBA = { ...rgba, ...colorBlockRGBA };
    setRGBA(newRGBA);
    setHex(getHexColor(newRGBA));
  }, [colorBlockRGBA]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateColorAndPosition(event.nativeEvent);
  };

  const updateColorAndPosition = (event: MouseEvent) => {
    if (colorPickerRef.current) {
      const rect = colorPickerRef.current.getBoundingClientRect();
      const gradientWidth = rect.width;
      const gradientHeight = rect.height;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clampedX = Math.max(0, Math.min(gradientWidth, x));
      const clampedY = Math.max(0, Math.min(gradientHeight, y));

      const percentageX = (clampedX / gradientWidth) * 100;
      const percentageY = (clampedY / gradientHeight) * 100;
      const color = getColorAtPosition(percentageX, percentageY);

      setRGBA(color);
      setCursorPosition({ x: clampedX, y: clampedY });
      setHex(getHexColor(color));
    }
  };

  const getColorAtPosition = (x: number, y: number) => {
    const colors = [
      { r: 255, g: 0, b: 0, a: 1 },
      { r: 255, g: 255, b: 0, a: 1 },
      { r: 0, g: 255, b: 0, a: 1 },
      { r: 0, g: 255, b: 255, a: 1 },
      { r: 0, g: 0, b: 255, a: 1 },
      { r: 255, g: 0, b: 255, a: 1 },
      { r: 255, g: 0, b: 0, a: 1 },
    ];

    const index = Math.floor((colors.length - 1) * (x / 100));
    const currentColor = colors[index];
    const nextColor = colors[index + 1] || colors[index];
    const colorPercentage =
      (x % (100 / (colors.length - 1))) / (100 / (colors.length - 1));

    const r = interpolateColorComponent(
      currentColor.r,
      nextColor.r,
      colorPercentage
    );
    const g = interpolateColorComponent(
      currentColor.g,
      nextColor.g,
      colorPercentage
    );
    const b = interpolateColorComponent(
      currentColor.b,
      nextColor.b,
      colorPercentage
    );
    const a = interpolateColorComponent(
      currentColor.a,
      nextColor.a,
      colorPercentage
    );

    return { r, g, b, a };
  };

  const interpolateColorComponent = (
    start: number,
    end: number,
    percentage: number
  ) => {
    return Math.round(start + (end - start) * percentage);
  };

  const getHexColor = (color: {
    r: number;
    g: number;
    b: number;
    a: number;
  }) => {
    const { r, g, b } = color;
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");
    return `#${hexR}${hexG}${hexB}`;
  };

  const [opacity, setOpacity] = useState(1);
  const [open, setOpen] = useState(false);

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);

    if (props.name === "a") {
      const newOpacity1 = parseFloat(e.target.value);
      setOpacity(newOpacity1);
    }

    const percentage = Math.round(newOpacity * 100);
    setOpacityPercentage(percentage);

    setRGBA((prevRGBA) => ({ ...prevRGBA, a: newOpacity }));
  };

  const getRGBAFromHex = (hexColor: string) => {
    const color = hexColor.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return { r, g, b, a: rgba.a };
  };

  const handleRGBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newRGB = { ...rgba, [name]: parseInt(value, 10) };

    setRGBA(newRGB);
    setColorBlockRGBA(newRGB);
    setHex(getHexColor(newRGB));
  };

  const rgbaColorValue = `${hex}${
    opacity !== 1 ? Math.round(opacity * 255).toString(16) : ""
  }`;

  useEffect(() => {
    props.onChange(rgbaColorValue);
  }, [rgbaColorValue]);

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    } else {
      setValue("");
    }
  }, [props.value]);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="w-56 max-h-[230px] rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="grid grid-cols-1">
                <div className="flex items-center">
                  <div
                    style={{
                      backgroundColor: value,
                      width: "30px",
                      height: "30px",
                      margin: "5px 10px 5px 0",
                      borderRadius: "5px",
                      border: `2px solid ${value}`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text my-2">Standard Color</div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div
                  className={`${Styles.color_box} ${Styles.color_box_white}`}
                  onClick={() => {
                    props.onChange("#FFFFFF");
                    setColorBoxValue("#FFFFFF");
                    setValue(props.value);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.color_box} ${Styles.color_box_gray}`}
                  onClick={() => {
                    props.onChange("#D8D8D8");
                    setColorBoxValue("#D8D8D8");
                    setValue(props.value);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.color_box} ${Styles.color_box_primary}`}
                  onClick={() => {
                    props.onChange("#02B89D");
                    setColorBoxValue("#02B89D");
                    setValue(props.value);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.color_box} ${Styles.color_box_secondary}`}
                  onClick={() => {
                    props.onChange("#069CDE");
                    setColorBoxValue("#069CDE");
                    setValue(`${props.value}`);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.color_box} ${Styles.color_box_success}`}
                  onClick={() => {
                    props.onChange("#135736");
                    setColorBoxValue("#135736");
                    setValue(`${props.value}`);
                    setOpen(false);
                  }}
                ></div>
              </div>
              <div className="flex gap-2">
                <div
                  className={`${Styles.color_box} ${Styles.color_box_danger}`}
                  onClick={() => {
                    props.onChange("#DC3545");
                    setColorBoxValue("#DC3545");
                    setValue(props.value);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.color_box} ${Styles.color_box_warning}`}
                  onClick={() => {
                    props.onChange("#FFC107");
                    setColorBoxValue("#FFC107");
                    setValue(`${props.value}`);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.color_box} ${Styles.color_box_info}`}
                  onClick={() => {
                    props.onChange("#0DCAF0");
                    setColorBoxValue("#0DCAF0");
                    setValue(`${props.value}`);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.color_box} ${Styles.color_box_dark}`}
                  onClick={() => {
                    props.onChange("#333333");
                    setColorBoxValue("#333333");
                    setValue(`${props.value}`);
                    setOpen(false);
                  }}
                ></div>
                <div
                  className={`${Styles.wrapper}`}
                  onClick={() => {
                    props.onChange("#000000");
                    setColorBoxValue("#000000");
                    setHex("#000000");
                    setValue("#000000");
                    setOpen(false);
                  }}
                >
                  <div className="box empty"></div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gary-300">
              <div className="text-center py-2"></div>
              <div
                className="text-center py-2"
                onClick={() => {
                  setOpen(true), setColorBoxValue("");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center">
                  <div className="grid grid-cols-1">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-gray-800 text-custom-color"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 21 21"
                      >
                        <path
                          stroke="currentcolor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                        />
                      </svg>
                      <p className="ml-2">More Color</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={dropdownRef}>
          <div
            className={`${
              open ? "" : "hidden"
            } rounded overflow-hidden shadow-lg`}
            style={{
              width: "100%",
              height: "370px",
            }}
          >
            <div
              className={`${Styles.color_picker__color_block}`}
              ref={colorPickerRef}
            >
              <div
                style={{
                  float: "right",
                  margin: "5px 5px 5px 5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <svg
                  className="w-3 h-3 text-custom-color"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentcolor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </div>
              <div className="px-1 py-1 w-full">
                <div className="font-bold text-xl mb-2">
                  <div className={`${Styles.color_picker__gradient}`}>
                    <canvas
                      className={`${Styles.color_picker__color_block} h-48`}
                      ref={colorBlockRef}
                      width="350"
                      height="200"
                      style={{
                        borderRadius: "5px",
                        cursor: isDragging2 ? "grabbing" : "crosshair",
                      }}
                    ></canvas>
                  </div>

                  <div
                    className={`${Styles.color_picker__cursor}`}
                    
                  ></div>
                </div>
                <p>Hue</p>

                <div
                  className={`${Styles.saturation}`}
                  ref={colorPickerRef}
                  onMouseDown={handleMouseDown}
                >
                  <div
                    className={`${Styles.cursor}`}
                    style={{
                      border: "5px solid rgb(248, 248, 248)",
                      background: hex,
                      position: "absolute",
                      top: `0px`,
                      left: `${cursorPosition.x}px`,
                      cursor: isDragging ? "grabbing" : "grab",
                    }}
                  ></div>
                </div>

                <p style={{ margin: "5px 0 0 0" }}>
                  Opacity:
                  <span style={{ float: "right" }}>{opacityPercentage}%</span>
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={handleOpacityChange}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    width: "100%",
                    height: "8px",
                    background: `linear-gradient(to right, rgba(0, 0, 0, 0), ${rgbaColorValue})`,
                    borderRadius: "3px",
                    outline: "none",
                    margin: "0",
                    padding: "0",
                  }}
                />

                <div className="flex align-center gap-1">
                  <div className="flex flex-col w-full">
                    <span>Hex</span>
                    <input
                      className={`${Styles.color_picker__input} ${
                        isInputFocused ? "focused" : ""
                      }`}
                      type="text"
                      value={`${hex}${
                        opacity !== 1
                          ? Math.round(opacity * 255).toString(16)
                          : ""
                      }`}
                      onChange={handleHexChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <span>R</span>
                    <input
                      className={`${Styles.color_picker__rgba} ${
                        isInputFocused ? "focused" : ""
                      }`}
                      type="number"
                      name="r"
                      min={0}
                      max={255}
                      value={rgba.r}
                      onChange={handleRGBChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <span>G</span>
                    <input
                      className={`${Styles.color_picker__rgba} ${
                        isInputFocused ? "focused" : ""
                      }`}
                      type="number"
                      name="g"
                      min={0}
                      max={255}
                      value={rgba.g}
                      onChange={handleRGBChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <span>B</span>
                    <input
                      className={`${Styles.color_picker__rgba} ${
                        isInputFocused ? "focused" : ""
                      }`}
                      type="number"
                      name="b"
                      min={0}
                      max={255}
                      value={rgba.b}
                      onChange={handleRGBChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <span>A</span>
                    <input
                      className={`${Styles.color_picker__rgba}`}
                      type="number"
                      name="a"
                      step={0.01}
                      max={1}
                      min={0}
                      value={rgba.a}
                      onChange={handleOpacityChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};