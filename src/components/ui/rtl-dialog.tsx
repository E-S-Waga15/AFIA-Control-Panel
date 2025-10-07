import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { X } from 'lucide-react';
import { Button } from './button';

interface RTLDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export const RTLDialog: React.FC<RTLDialogProps> = ({
  open,
  onOpenChange,
  title,
  children,
  trigger,
  className = "",
  maxWidth = "max-w-md"
}) => {
  const { isRTL } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={`${className} ${maxWidth} [&>button]:hidden`} dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader className="relative">
          <DialogTitle className={`${isRTL ? 'text-right pr-8' : 'text-left pl-0'}`}>
            {title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-6 w-6 p-0 hover:bg-gray-100 z-10`}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className={`${isRTL ? 'text-right' : 'text-left'} mt-4`}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// مكون مبسط للاستخدام السريع
export const RTLDialogSimple: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onOpenChange, title, children }) => {
  return (
    <RTLDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
    >
      {children}
    </RTLDialog>
  );
};
