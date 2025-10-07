"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useLanguage } from '../../contexts/LanguageContext'; // يُفترض أن هذا هو مسار hook اللغة
import { cn } from "./utils"; // يُفترض أن هذا هو مسار دالة cn لدمج الفئات

/**
 * مكون Switch يدعم اتجاه RTL عبر تعديل فئات التحريك (translate-x).
 */
export const RTLSwitch = React.forwardRef(({ className, ...props }, ref) => {
  // استخدام hook اللغة لتحديد الاتجاه الحالي
  const { isRTL } = useLanguage();

  let thumbTranslateClasses;

  if (isRTL) {
    // في حالة RTL (العربية):
    // يجب أن يعكس حركة LTR.
    // حركة LTR الافتراضية هي: checked -> ينتقل إلى اليمين (translateX)
    // لذا، حركة RTL الصحيحة هي: checked -> ينتقل إلى اليسار (-translateX)
    //
    // سنستخدم فئة `translate-x-0` للحالة المحددة، وفئة `rtl-translate-fix` المخصصة
    // للحالة غير المحددة والتي ستقوم بإجبار التحويل إلى أقصى اليمين.
    
    thumbTranslateClasses =
    "data-[state=checked]:translate-x-[calc(-10%+2px)] data-[state=unchecked]:translate-x-[calc(100%-2px)]";
      
    // ملاحظة: قد نحتاج إلى ضبط `1.25rem` إلى قيمة تعادل عرض الزر
    // في بعض تطبيقات Shadcn/ui تكون القيمة (w-8 - size-4) = 16px. 
    // إذا لم يعمل `1.25rem`، جرب استخدام القيمة الأصلية المتمثلة في `calc(100%-2px)` ولكن بعلامة سلبية، 
    // لكن هذا يتطلب إضافة CSS خارجي. سنعتمد على Tailwind أولاً.-

  } else {
    // في حالة LTR (الإنجليزية): السلوك الافتراضي
    // الحركة الافتراضية: checked -> ينتقل إلى اليمين (translate-x-[calc(100%-2px)])
    //                    unchecked -> يبقى في اليسار (translate-x-0)
    thumbTranslateClasses =
      "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0";
  }

  // الفئات الأساسية للمسار (Track)
  const rootClasses = cn(
    "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );

  // الفئات الأساسية للزر الدائري (Thumb)
  const thumbClasses = cn(
    "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform",
    thumbTranslateClasses, // تطبيق فئات التحويل المحددة أعلاه
  );

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      // إضافة خاصية dir للتحكم في اتجاه النص والحاويات الداخلية (قد تساعد)
      dir={isRTL ? 'rtl' : 'ltr'}
      className={rootClasses}
      {...props}
    >
      {/* 💡 ملاحظة: فئة translate-x-[calc(100%-2px)] هي الأهم لضمان عمل الحركة */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={thumbClasses}
      />
    </SwitchPrimitive.Root>
  );
});

RTLSwitch.displayName = SwitchPrimitive.Root.displayName;
