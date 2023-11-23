
import React, { CSSProperties, ReactNode } from "react";
import "./Typography.module.scss";

interface TypographyProps {
  style?: CSSProperties;
  className?: string;
  type?: string;
  children?: ReactNode;
  htmlFor?: string;
}

export default class Typography extends React.Component<TypographyProps> {
  render() {
    const { style, className, type, children, htmlFor } = this.props;

    let Element;
    let styles = "";

    switch (type) {
      case "h1":
        Element = "h1";
        styles = "text-[32px] font-bold lg:text-[40px]";
        break;
      case "h2":
        Element = "h2";
        styles = "text-[28px] font-bold lg:text-[32px]";
        break;
      case "h3":
        Element = "h3";
        styles = "text-[24px] font-semibold lg:text-[28px]";
        break;
      case "h4":
        Element = "h4";
        styles = "text-[20px] font-semibold lg:text-[24px]";
        break;
      case "h5":
        Element = "h5";
        styles = "text-[16px] font-medium lg:text-[20px]";
        break;
      case "h6":
        Element = "h6";
        styles = "text-[14px] font-medium lg:text-[16px]";
        break;
      case "title":
        Element = "span";
        styles = "text-[16px] font-medium lg:text-[20px]";
        break;
      case "sub-title":
        Element = "span";
        styles = "text-[14px] font-medium lg:text-[16px]";
        break;
      case "table-title":
        Element = "caption";
        styles = "text-[14px] width-max-content font-bold lg:text-[16px]";
        break;
      case "label":
        Element = "label";
        styles = "text-[12px] font-normal lg:text-[14px]";
        break;
      case "body":
        Element = "p";
        styles = "text-[14px] font-normal lg:text-[16px]";
        break;
      case "button":
        Element = "button";
        styles = "text-[16px] font-normal lg:text-[16px]";
        break;
      case "caption":
        Element = "caption";
        styles = "text-[10px] width-max-content font-normal lg:text-[12px]";
        break;
      case "badge":
        Element = "span";
        styles = "text-[10px] font-normal lg:text-[10px]";
        break;
      case "tool-tip":
        Element = "span";
        styles = "text-[16px] font-normal lg:text-[14px]";
        break;
      default:
        Element = "span";
        styles = "text-[14px] font-normal lg:text-[16px]";
        break;
    }

    const combinedClassName = `${className} ${styles} font-proxima `;

    return (
      <Element style={style} className={combinedClassName} htmlFor={htmlFor}>
        {children}
      </Element>
    );
  }
}