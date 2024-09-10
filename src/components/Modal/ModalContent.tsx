import React, { ReactNode } from 'react';

interface ModalContentProps {
  children: ReactNode;
  className?: string;
  isScrollable?: boolean

}

const ModalContent: React.FC<ModalContentProps> = ({ children, className, isScrollable }) => {

  return (
    <div className={`${className} overflow-y-auto custom-scroll flex-auto ${isScrollable && "overflow-y-auto max-h-96"} text-pureBlack`}>
      {children || 'Modal Content'}
    </div>
  );
};

export default ModalContent;