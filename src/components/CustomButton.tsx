import React, { ReactElement } from "react";

interface PrimaryButtonProps {
  icon?: ReactElement;
  type: "button" | "submit" | "reset";
  label: string;
  disabled?: boolean;
  additionalClasses?: string;
  handleClick?: () => void;
}

const CustomButton: React.FC<PrimaryButtonProps> = ({
  icon,
  type,
  label,
  disabled,
  additionalClasses,
  handleClick,
}) => {
  return (
    <button
      onClick={handleClick}
      type={type}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${additionalClasses}`}
      disabled={disabled}>
      {icon}
      {label}
    </button>
  );
};

export default CustomButton;
