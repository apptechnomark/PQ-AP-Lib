import React, { CSSProperties } from 'react';

interface BreadcrumbItem {
  label: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant: string;
  className?: string;
  style?: CSSProperties;
}

class Breadcrumb extends React.Component<BreadcrumbProps> {
  render() {
    const { items, variant, className, style } = this.props;

    const separator = variant === '>' ? '>' : '/';

    const linkStyle: CSSProperties = {
      fontSize: (style as any) && (style as any).fontSize ? (style as any).fontSize : 'inherit',
    };

    const containerStyle: CSSProperties = {
      fontSize: (style as any) && (style as any).fontSize ? (style as any).fontSize : 'inherit',
      ...(style as any)
    };

    const iconStyle: CSSProperties = {
      fontSize: (style as any) && (style as any).fontSize ? (style as any).fontSize : 'inherit'
    };

    return (
      <nav className={`flex ${className} `} style={containerStyle} aria-label="Breadcrumb">
        <ol className="inline-flex items-center">
         
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={iconStyle}
            className='mr-1'
          >
            <path
              d="M6.66667 3.33333V0.666667C6.66667 0.477778 6.73056 0.319444 6.85833 0.191667C6.98611 0.0638889 7.14445 0 7.33333 0H11.3333C11.5222 0 11.6806 0.0638889 11.8083 0.191667C11.9361 0.319444 12 0.477778 12 0.666667V3.33333C12 3.52222 11.9361 3.68056 11.8083 3.80833C11.6806 3.93611 11.5222 4 11.3333 4H7.33333C7.14445 4 6.98611 3.93611 6.85833 3.80833C6.73056 3.68056 6.66667 3.52222 6.66667 3.33333ZM0 6V0.666667C0 0.477778 0.0638889 0.319444 0.191667 0.191667C0.319444 0.0638889 0.477778 0 0.666667 0H4.66667C4.85556 0 5.01389 0.0638889 5.14167 0.191667C5.26944 0.319444 5.33333 0.477778 5.33333 0.666667V6C5.33333 6.18889 5.26944 6.34722 5.14167 6.475C5.01389 6.60278 4.85556 6.66667 4.66667 6.66667H0.666667C0.477778 6.66667 0.319444 6.60278 0.191667 6.475C0.0638889 6.34722 0 6.18889 0 6ZM6.66667 11.3333V6C6.66667 5.81111 6.73056 5.65278 6.85833 5.525C6.98611 5.39722 7.14445 5.33333 7.33333 5.33333H11.3333C11.5222 5.33333 11.6806 5.39722 11.8083 5.525C11.9361 5.65278 12 5.81111 12 6V11.3333C12 11.5222 11.9361 11.6806 11.8083 11.8083C11.6806 11.9361 11.5222 12 11.3333 12H7.33333C7.14445 12 6.98611 11.9361 6.85833 11.8083C6.73056 11.6806 6.66667 11.5222 6.66667 11.3333ZM0 11.3333V8.66667C0 8.47778 0.0638889 8.31945 0.191667 8.19167C0.319444 8.06389 0.477778 8 0.666667 8H4.66667C4.85556 8 5.01389 8.06389 5.14167 8.19167C5.26944 8.31945 5.33333 8.47778 5.33333 8.66667V11.3333C5.33333 11.5222 5.26944 11.6806 5.14167 11.8083C5.01389 11.9361 4.85556 12 4.66667 12H0.666667C0.477778 12 0.319444 11.9361 0.191667 11.8083C0.0638889 11.6806 0 11.5222 0 11.3333ZM1.33333 5.33333H4V1.33333H1.33333V5.33333ZM8 10.6667H10.6667V6.66667H8V10.6667ZM8 2.66667H10.6667V1.33333H8V2.66667ZM1.33333 10.6667H4V9.33333H1.33333V10.6667Z"
              fill={items.length > 1 ? "#02B89D" : "#6E6D7A"}
            />
          </svg>
          {items.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <span style={linkStyle} className="mx-2 h-6 text-primary ">
                  {separator}
                </span>
              )}
              <a
                href={item.url}
                className={`text-sm font-medium ${index === items.length - 1 ? "text-slatyGrey" : "text-primary border-b border-primary"}`}
                style={linkStyle}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }
}

export default Breadcrumb;
