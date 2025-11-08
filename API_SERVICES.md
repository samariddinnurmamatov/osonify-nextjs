# API Services Documentation

## Overview

Barcha API servislar FSD (Feature-Sliced Design) arxitektura asosida yaratilgan va SSR (Server-Side Rendering) uchun optimallashtirilgan.

## Struktura

```
src/shared/api/
├── client.ts              # Base API client (SSR support)
├── types/
│   └── index.ts          # Barcha API type definition'lar
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── chat.service.ts
│   ├── slide.service.ts
│   ├── image.service.ts
│   ├── storage.service.ts
│   ├── payment.service.ts
│   ├── subscription.service.ts
│   ├── preset.service.ts
│   ├── health.service.ts
│   └── index.ts          # Barcha servislarni export qilish
└── index.ts              # Main entry point
```

## Foydalanish

### Import

```tsx
// Barcha servislarni import qilish
import {
  AuthService,
  HealthService,
  userService,
  chatService,
  slideService,
  imageService,
  storageService,
  paymentService,
  subscriptionService,
  presetService,
} from "@/shared/api";

// Yoki alohida
import { userService } from "@/shared/api/services/user.service";
import type { User } from "@/shared/api/types";
```

### Server Component'da (SSR)

```tsx
// app/users/page.tsx
import { userService } from "@/shared/api";
import type { User } from "@/shared/api/types";

export default async function UsersPage() {
  // SSR - server-side'da avtomatik cookie'dan token olinadi
  const user = await userService.getProfile();
  
  return <div>{user.first_name}</div>;
}
```

### Client Component'da

```tsx
"use client";

import { chatService } from "@/shared/api";
import { toast } from "@/shared/stores/toastStore";
import { useState } from "react";

export function CreateChatButton() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const result = await chatService.createChat({
        service: "slide",
        topic: "My Presentation",
        metadata: { language: "uz", count: 10 },
      });
      
      toast.success("Chat yaratildi!", `ID: ${result.id}`);
    } catch (error) {
      toast.error("Xatolik!", "Chat yaratilmadi");
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handleCreate}>Create Chat</button>;
}
```

### Server Action'da

```tsx
// app/actions.ts
"use server";

import { userService } from "@/shared/api";
import { revalidatePath } from "next/cache";

export async function updateUserTheme(theme: "light" | "dark" | "system") {
  try {
    await userService.updateProfile({ interface_theme: theme });
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update theme" };
  }
}
```

## Servislar

### AuthService

```tsx
// Telegram WebApp login
const auth = await AuthService.loginWithWebApp(initData);

// Telegram login
const auth = await AuthService.loginWithTelegram({
  id: 123456789,
  first_name: "John",
  hash: "...",
  auth_date: "1234567890",
});

// Logout
await AuthService.logout({
  access_token: "...",
  refresh_token: "...",
});

// Refresh token
const newAuth = await AuthService.refreshToken(refreshToken);
```

### UserService

```tsx
import { userService } from "@/shared/api";

// Get profile
const user = await userService.getProfile();

// Update profile
await userService.updateProfile({
  interface_lang: "uz",
  interface_theme: "dark",
});

// Buy subscription
await userService.buySubscription({
  subscription_plan: "simple",
  subscription_type: "weekly",
});

// Get active subscription
const subscription = await userService.getActiveSubscription();
```

### ChatService

```tsx
import { chatService } from "@/shared/api";

// Create chat
const chat = await chatService.createChat({
  service: "slide",
  topic: "My Presentation",
  metadata: { language: "uz", count: 10 },
});

// Get chats
const chats = await chatService.getChats({ page: 1, limit: 20 });

// Get trashed chats
const trashed = await chatService.getTrashedChats({ page: 1, limit: 20 });

// Trash chat
await chatService.trashChat(chatId);

// Restore chat
await chatService.restoreChat(chatId);

// Delete chat permanently
await chatService.deleteChat(chatId);
```

### SlideService

```tsx
import { slideService } from "@/shared/api";

// Get slide by chat ID
const slide = await slideService.getSlideByChatId(chatId);
```

### ImageService

```tsx
import { imageService } from "@/shared/api";

// Get image configs
const configs = await imageService.getImageConfigs();

// Get my images
const images = await imageService.getMyImages({ page: 1, limit: 20 });

// Get all public images
const allImages = await imageService.getAllImages({ page: 1, limit: 20 });

// Get liked images
const liked = await imageService.getLikedImages({ page: 1, limit: 20 });

// Like image
await imageService.likeImage(imageId, chatId);

// Unlike image
await imageService.unlikeImage(imageId);
```

### StorageService

```tsx
import { storageService } from "@/shared/api";

// Upload files
const result = await storageService.uploadFiles([file1, file2]);

// Get files
const files = await storageService.getFiles({ file_ids: ["id1", "id2"] });

// Get single file
const file = await storageService.getFile(fileId);

// Delete files
await storageService.deleteFiles({ file_ids: ["id1", "id2"] });
```

### PaymentService

```tsx
import { paymentService } from "@/shared/api";

// Create order
const order = await paymentService.createOrder({
  provider: "click",
  amount: 10000,
  extra_data: {},
});

// Payme callback (usually called by Payme server)
await paymentService.paymeCallback(data, authorization);

// Click callback (usually called by Click server)
await paymentService.clickCallback(data);
```

### SubscriptionService

```tsx
import { subscriptionService } from "@/shared/api";

// Buy subscription
await subscriptionService.buySubscription({
  subscription_plan: "simple",
  subscription_type: "weekly",
});

// Buy per-unit subscription
await subscriptionService.buyPerUnitSubscription({
  service: "image",
  count: 10,
});

// Get active subscription
const subscription = await subscriptionService.getActiveSubscription();

// Get plans
const plans = await subscriptionService.getPlans();
```

### PresetService

```tsx
import { presetService } from "@/shared/api";

// Create preset
const preset = await presetService.createPreset({
  title: "Passport Photo",
  prompt: "High-res professional passport photo",
  model: "gpt-image-1",
  model_display: "Sora Image",
  image_ids: ["id1", "id2"],
  image_limit: 4,
  is_active: true,
});

// Get presets
const presets = await presetService.getPresets({
  page: 1,
  limit: 20,
  model: "gpt-image-1",
});

// Get preset by ID
const singlePreset = await presetService.getPresetById(presetId);

// Update preset
await presetService.updatePreset(presetId, {
  title: "New Title",
  prompt: "New prompt",
  // ...
});

// Delete preset
await presetService.deletePreset(presetId);

// Toggle like
const result = await presetService.toggleLikePreset(presetId);

// Get liked presets
const liked = await presetService.getLikedPresets({ page: 1, limit: 20 });
```

### HealthService

```tsx
// Check health
const status = await HealthService.checkHealth();
```

## SSR Features

1. **Automatic Token Handling**: Server-side'da cookie'dan avtomatik token olinadi
2. **Cookie Forwarding**: Server-side request'larda cookie'lar avtomatik forward qilinadi
3. **Type Safety**: Barcha API call'lar TypeScript type'lar bilan himoyalangan
4. **Error Handling**: Barcha error'lar to'g'ri handle qilinadi

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.osonify.ai
```

## Notes

- Barcha servislar SSR uchun optimallashtirilgan
- Server-side'da cookie'dan token avtomatik olinadi
- Client-side'da localStorage yoki cookie'dan token olish kerak (client component'lar uchun)
- Barcha request'lar `no-store` cache policy bilan ishlaydi (fresh data uchun)

