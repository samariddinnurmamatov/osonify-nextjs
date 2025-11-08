# Toast Usage Guide

## Import

```tsx
import { useToast } from "@/shared/hooks/use-toast";
// yoki
import { toast } from "@/shared/stores/toastStore";
```

## Usage Examples

### 1. Hook orqali foydalanish (Tavsiya etiladi)

```tsx
"use client";

import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";

export function MyComponent() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast.success("Muvaffaqiyatli!", "Operatsiya bajarildi");
  };

  const handleError = () => {
    toast.error("Xatolik!", "Nimadir noto'g'ri ketdi");
  };

  const handleWarning = () => {
    toast.warning("Ogohlantirish!", "Ehtiyot bo'ling");
  };

  const handleInfo = () => {
    toast.info("Ma'lumot", "Bu muhim ma'lumot");
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Success Toast</Button>
      <Button onClick={handleError}>Error Toast</Button>
      <Button onClick={handleWarning}>Warning Toast</Button>
      <Button onClick={handleInfo}>Info Toast</Button>
    </div>
  );
}
```

### 2. To'g'ridan-to'g'ri import qilish

```tsx
"use client";

import { toast } from "@/shared/stores/toastStore";

export function MyComponent() {
  const handleClick = () => {
    toast.success("Title", "Message", 3000); // duration optional
  };

  return <button onClick={handleClick}>Show Toast</button>;
}
```

### 3. Server Actions yoki API calls'da foydalanish

```tsx
"use client";

import { toast } from "@/shared/stores/toastStore";

export async function handleSubmit(formData: FormData) {
  try {
    const response = await fetch("/api/something", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    toast.success("Muvaffaqiyatli!", "Ma'lumot saqlandi");
  } catch (error) {
    toast.error("Xatolik!", "Ma'lumot saqlanmadi");
  }
}
```

### 4. Custom duration bilan

```tsx
toast.success("Title", "Message", 10000); // 10 soniya
toast.error("Title", "Message", 0); // Auto-close yo'q (manual close)
```

## Toast Types

- `toast.success(title, message?, duration?)` - Yashil rang
- `toast.error(title, message?, duration?)` - Qizil rang
- `toast.warning(title, message?, duration?)` - Sariq rang
- `toast.info(title, message?, duration?)` - Ko'k rang

## Features

- ✅ Dark mode support
- ✅ Auto-dismiss (default 5 seconds)
- ✅ Manual close button
- ✅ Smooth animations
- ✅ Accessible (ARIA attributes)
- ✅ Multiple toasts support
- ✅ Responsive design

