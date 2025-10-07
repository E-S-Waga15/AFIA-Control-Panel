import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar,
} from './sidebar';
import { Button } from './button';
import { PanelLeftIcon, PanelRightIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from './utils';

interface RTLSidebarTriggerProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function RTLSidebarTrigger({ className, onClick }: RTLSidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();
  const { isRTL } = useLanguage();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    toggleSidebar();
  };

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={handleClick}
    >
      {isRTL ? <PanelRightIcon /> : <PanelLeftIcon />}
      <span className="sr-only">
        {isRTL ? 'إغلاق الشريط الجانبي' : 'فتح الشريط الجانبي'}
      </span>
    </Button>
  );
}

interface RTLSidebarProps {
  children?: any;
  className?: string;
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  defaultOpen?: boolean;
}

export function RTLSidebar({ children, className, defaultOpen = true, side, variant, collapsible }: RTLSidebarProps) {
  const { isRTL } = useLanguage();

  // تحديد الجانب بناءً على اللغة إذا لم يتم تحديده صراحة
  const sidebarSide = side || (isRTL ? "right" : "left");

  return (
    <Sidebar
      side={sidebarSide}
      variant={variant}
      collapsible={collapsible}
      className={cn(
        // إصلاحات خاصة بـ RTL
        isRTL && [
          "[&_[data-slot=sidebar-gap]]:group-data-[side=right]:rotate-0",
          "[&_[data-slot=sidebar-gap]]:group-data-[side=right]:translate-x-0",
          "[&_[data-slot=sidebar-container]]:right-0",
          "[&_[data-slot=sidebar-container]]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          "[&_[data-slot=sidebar-container]]:group-data-[collapsible=icon]:border-l-0",
          "[&_[data-slot=sidebar-container]]:group-data-[collapsible=icon]:border-r",
          "[&_[data-slot=sidebar-rail]]:group-data-[side=right]:-left-4",
          "[&_[data-slot=sidebar-rail]]:group-data-[side=right]:translate-x-1/2",
          "[&_[data-slot=sidebar-rail]]:group-data-[side=right]:cursor-w-resize",
          "[[data-side=right][data-state=collapsed]_[data-slot=sidebar-rail]]:cursor-w-resize",
        ],
        className
      )}
    >
      {children}
    </Sidebar>
  );
}

export { RTLSidebarTrigger };
export { SidebarProvider };
