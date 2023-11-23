import React from 'react';

function CardAction(props) {
  return (
    <div className="flex justify-end p-2">
      {props.children}
    </div>
  );
}

export default CardAction;
