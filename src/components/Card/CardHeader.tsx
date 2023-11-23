  import React from 'react';

  function CardHeader(props) {
    return (
      <div className="flex items-center p-4">
        {props.children}
      </div>
    );
  }

  export default CardHeader;