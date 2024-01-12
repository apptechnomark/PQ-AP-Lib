import React, { ReactNode } from 'react';

interface ModalContentProps {
  children: ReactNode;
  className?: string;
  isScrollable?:boolean

}

const ModalContent: React.FC<ModalContentProps> = ({ children,className,isScrollable }) => {

  return (
    <div
    className={`${className} flex-auto max-h-96 ${isScrollable && "overflow-y-scroll"} text-pureBlack`}
  >
        {children || 'Modal Content'}
      </div>
  );
};

export default ModalContent;