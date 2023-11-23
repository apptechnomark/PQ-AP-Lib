import React from 'react';

function CardContent(props) {
  return (
    <div className="p-4 text-sm text-gray-700">
      {props.children}
    </div>
  );
}

export default CardContent;