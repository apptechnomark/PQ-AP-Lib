import React from 'react'

const ChevronDown = ({ currentColor }) => {
  return (
    <div>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.40078 7.5L0.800781 1.69149L1.9495 0.5L6.40078 5.11702L10.8521 0.5L12.0008 1.69149L6.40078 7.5Z" fill={currentColor} />
      </svg>
    </div>
  )
}

export default ChevronDown