import React from 'react';

interface ToggleButtonProps {
  label: string;
  value: boolean; // Current state
  onToggle: () => void; // Function to toggle state
  optionOne: string; // Text for the first option
  optionTwo: string; // Text for the second option
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  value,
  onToggle,
  optionOne,
  optionTwo,
}) => {
  return (
    <div className="toggle-container">
      <span className="toggle-label">{label}</span>
      <div className="toggle-wrapper" onClick={onToggle}>
        <div
          className={`toggle-slider ${value ? 'translate-x-full' : ''}`}
        ></div>
        <div className="toggle-options">
          <span className={`toggle-item ${value ? 'inactive' : 'active'}`}>
            {optionOne}
          </span>
          <span className={`toggle-item ${!value ? 'inactive' : 'active'}`}>
            {optionTwo}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;
