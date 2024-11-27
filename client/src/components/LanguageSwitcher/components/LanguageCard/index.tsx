import React from "react";

interface LanguageCardProps {
  language: string;
  isSelected: boolean;
  onSelect: (language: string) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(language)}
      disabled={isSelected}
      className={`p-4 bg-orange-500 border-[2px] border-orange-900 rounded-md  ${
        isSelected ? "shadow-[0_0_0_1px_black]" : "shadow-[0_0_0_1px_white]"
      } flex justify-between items-start gap-2.5`}
    >
      <div className="text-white font-bold text-base font-['Londrina Solid'] leading-none" style={isSelected ? {color: 'white'} : {color: '#e5e7eb'}}>
        {language}
      </div>
      {isSelected ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5.25L7.5 12.75L3.75 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        ""
      )}
    </button>
  );
};
