import React, { CSSProperties } from 'react';

interface BreadcrumbItem {
  label: string;
  url?: string;
  goBack?: () => void;
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
         
          {items.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <span style={linkStyle} className="mx-2 h-6 text-primary ">
                  {separator}
                </span>
              )}
              {item.url ? (
                <a
                  href={item.url}
                  className={`text-sm font-medium ${index === items.length - 1 ? 'text-slatyGrey' : 'text-primary border-b border-primary'}`}
                  style={linkStyle}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={item.goBack}
                  className={`text-sm font-medium ${index === items.length - 1 ? 'text-slatyGrey' : 'text-primary border-b border-primary'}`}
                  style={linkStyle}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
}

export default Breadcrumb;
