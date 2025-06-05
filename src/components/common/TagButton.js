import React from 'react';
import './TagButton.css';

const TagButton = ({ 
  variant, 
  isActive, 
  onClick, 
  children,
  className,
  ...props 
}) => {
  const buttonClasses = [
    'tag-button',
    variant,
    isActive ? 'active' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const TagButtonGroup = ({ children, className, ...props }) => {
  const groupClasses = [
    'tag-button-group',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses} {...props}>
      {children}
    </div>
  );
};

export default TagButton; 