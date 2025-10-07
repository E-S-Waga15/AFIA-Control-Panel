import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { useLanguage } from '../../contexts/LanguageContext';

interface RTLSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export const RTLSelect: React.FC<RTLSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  children,
  className = ""
}) => {
  const { isRTL } = useLanguage();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`${className} ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={isRTL ? 'text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </SelectContent>
    </Select>
  );
};
