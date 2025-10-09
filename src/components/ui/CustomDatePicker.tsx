import * as React from 'react';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  isRTL?: boolean;
  isMobile?: boolean;
}

export default function CustomDatePicker({
  value,
  onChange,
  label = "تاريخ الميلاد",
  placeholder = "اختر تاريخ الميلاد",
  isRTL = false,
  isMobile = false
}: CustomDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState(value);

  React.useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    onChange(newDate);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => handleDateChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isMobile ? 'py-3 text-lg' : ''}`}
        style={{
          fontSize: isMobile ? '16px' : '14px',
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr',
          cursor: 'pointer'
        }}
        max={new Date().toISOString().split('T')[0]}
        min="1900-01-01"
      />
    </div>
  );
}
