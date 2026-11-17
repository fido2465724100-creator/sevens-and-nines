import React from 'react';
import ussrFlagUrl from '../assets/flag-ussr.svg';

interface FlagIconProps {
  code: string;
  flag: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  code,
  flag,
  className = '',
  size = 'md',
}) => {
  if (code === 'ru') {
    const sizeClasses = {
      sm: 'w-4 h-3 rounded-[2px]',
      md: 'w-6 h-4 rounded-[3px]',
      lg: 'w-9 h-6 rounded-md',
    };

    return (
      <img
        src={ussrFlagUrl}
        alt="USSR Flag"
        className={`inline-block object-cover shadow-sm select-none ${sizeClasses[size]} ${className}`}
        style={{ verticalAlign: 'middle' }}
      />
    );
  }

  return (
    <span className={`select-none drop-shadow ${className}`}>
      {flag}
    </span>
  );
};
