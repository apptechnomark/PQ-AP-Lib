import React from 'react';

function Card(props) {
  const defaultClassName = 'max-w-[345px] bg-pureWhite m-5 mx-auto bg-white shadow-lg';
  const isSquareVariant = props.variant === 'square';
  const cardClassName = `${defaultClassName} ${isSquareVariant ? '' : 'rounded'} ${props.className || ''}`;

  return (
    <div className={cardClassName} style={props.style}>
      {props.children}
    </div>
  );
}

export default Card;