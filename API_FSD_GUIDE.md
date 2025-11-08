# API Services - FSD Architecture

## 📁 To'liq Struktura

```
src/shared/api/
├── client/
│   ├── base-api.ts          # ✅ Universal fetch helper (SSR+CSR)
│   ├── server-fetch.ts      # ✅ Server-only (Next.js cookies/headers)
│   ├── browser-fetch.ts     # ✅ Client-only (localStorage)
│   └── index.ts             # ✅ Universal API client export
├── interceptors/
│   ├── auth-interceptor.ts  # ✅ Token management, refresh, retry
│   ├── error-handler.ts     # ✅ Unified error handling
│   └── index.ts
├── services/
│   ├── auth.service.ts      # ✅ Authentication
│   ├── user.service.ts      # ✅ User management
│   ├── chat.service.ts      # ✅ Chat operations
│   ├── slide.service.ts     # ✅ Slide operations
│   ├── image.service.ts     # ✅ Image operations
│   ├── storage.service.ts   # ✅ File storage
│   ├── payment.service.ts   # ✅ Payment processing
│   ├── subscription.service.ts # ✅ Subscriptions
│   ├── preset.service.ts    # ✅ Presets
│   ├── health.service.ts    # ✅ Health checks
│   └── index.ts
├── types/
│   ├── common.ts            # ✅ Common types
│   ├── auth.types.ts        # ✅ Auth types
│   ├── user.types.ts        # ✅ User types
│   ├── chat.types.ts        # ✅ Chat types
│   ├── slide.types.ts       # ✅ Slide types
│   ├── image.types.ts       # ✅ Image types
│   ├── storage.types.ts     # ✅ Storage types
│   ├── payment.types.ts     # ✅ Payment types
│   ├── subscription.types.ts # ✅ Subscription types
│   ├── preset.types.ts      # ✅ Preset types
│   └── index.ts
└── index.ts                 # ✅ Main entry point
```

## 🎯 Arxitektura Afzalliklari

### ✅ **Optimal Yechim**

1. **Universal API Client** (`api`)
   - Avtomatik server/browser tanlash
   - `typeof window === "undefined"` orqali aniqlash
   - Next.js 15 + React 19 uchun optimallashtirilgan

2. **Separation of Concerns**
   - `base-api.ts` - Core fetch logikasi (universal)
   - `server-fetch.ts` - SSR uchun (Next.js async cookies/headers)
   - `browser-fetch.ts` - Client uchun (localStorage)

3. **Interceptor Pattern**
   - `auth-interceptor.ts` - Auto token refresh, retry logic
   - `error-handler.ts` - Unified error handling + toast

4. **Type Safety**
   - Har bir servis uchun alohida type fayllar
   - To'liq TypeScript support

## 📖 Foydalanish

### 1. Server Component (SSR)

```tsx
import { userService } from "@/shared/api";

export default async function ProfilePage() {
  // SSR - avtomatik serverApi ishlatiladi
  // Token cookie'dan avtomatik olinadi
  const user = await userService.getProfile();
  
  return (
    <div>
      <h1>{user.first_name}</h1>
      <p>Balance: {user.balance}</p>
    </div>
  );
}
```

### 2. Client Component

```tsx
"use client";

import { chatService, imageService } from "@/shared/api";
import { toast } from "@/shared/stores/toastStore";
import { useState, useEffect } from "react";

export function MyComponent() {
  const [chats, setChats] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Chat service - avtomatik browserApi ishlatiladi
    chatService
      .getChats({ page: 1, limit: 20 })
      .then(setChats)
      .catch(() => {
        toast.error("Xatolik!", "Chatlar yuklanmadi");
      });

    // Image service
    imageService
      .getMyImages({ page: 1, limit: 20 })
      .then((data) => setImages(data.items))
      .catch(() => {
        toast.error("Xatolik!", "Rasmlar yuklanmadi");
      });
  }, []);

  return (
    <div>
      <h2>Chats: {chats.length}</h2>
      <h2>Images: {images.length}</h2>
    </div>
  );
}
```

### 3. Server Action

```tsx
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

### 4. FormData bilan File Upload

```tsx
"use client";

import { storageService } from "@/shared/api";
import { toast } from "@/shared/stores/toastStore";

export function FileUploadButton() {
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      const fileArray = Array.from(files);
      const result = await storageService.uploadFiles(fileArray);
      
      toast.success("Muvaffaqiyatli!", `${result.file_ids.length} fayl yuklandi`);
    } catch (error) {
      toast.error("Xatolik!", "Fayllar yuklanmadi");
    }
  };

  return (
    <input
      type="file"
      multiple
      onChange={(e) => handleUpload(e.target.files)}
    />
  );
}
```

## 🔑 Barcha Servislar

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

// Delete permanently
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

// Payme callback
await paymentService.paymeCallback(data, authorization);

// Click callback
await paymentService.clickCallback(data);
```

### SubscriptionService

```tsx
import { subscriptionService } from "@/shared/api";

// Buy per-unit
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

## 🎨 Xususiyatlar

### ✅ **Universal API Client**

```tsx
import { api } from "@/shared/api";

// Avtomatik server/browser tanlash
const data = await api.get("/api/v1/users/me");
```

### ✅ **HTTP Methods**

```tsx
// GET
api.get<TResponse>(path, options?)

// POST
api.post<TResponse, TBody>(path, body?, options?)

// PUT
api.put<TResponse, TBody>(path, body?, options?)

// PATCH
api.patch<TResponse, TBody>(path, body?, options?)

// DELETE
api.delete<TResponse>(path, options?)
```

### ✅ **FormData Support**

```tsx
const formData = new FormData();
formData.append("file", file);

// Avtomatik FormData aniqlanadi
await api.post("/api/v1/upload", formData);
```

### ✅ **Error Handling**

```tsx
import { handleApiError } from "@/shared/api/interceptors";
import { userService } from "@/shared/api";

try {
  await userService.getProfile();
} catch (error) {
  // Avtomatik toast ko'rsatiladi
  handleApiError(error);
}
```

### ✅ **Token Management**

```tsx
import { setAuthTokens, clearAuthTokens } from "@/shared/api/client";

// Set tokens (client-side)
setAuthTokens(accessToken, refreshToken);

// Clear tokens (client-side)
clearAuthTokens();
```

## 🚀 Next.js 15 Optimizations

1. **Async Cookies** - `await cookies()` Next.js 15'da async
2. **Async Headers** - `await headers()` Next.js 15'da async
3. **Server Components** - To'liq SSR support
4. **Client Components** - Client-side optimizatsiya
5. **Type Safety** - To'liq TypeScript support

## 📝 Import Patterns

```tsx
// Barcha servislar
import { 
  AuthService, 
  UserService, 
  ChatService,
  ImageService,
  // ... boshqalar
} from "@/shared/api";

// Types
import type { 
  User, 
  ChatData, 
  ImageData,
  // ... boshqalar
} from "@/shared/api";

// API client (kamdan-kam kerak)
import { api } from "@/shared/api/client";

// Interceptors
import { handleLoginSuccess, handleLogout } from "@/shared/api/interceptors";
```

## ✨ Xulosa

Bu struktura:
- ✅ FSD prinsiplariga mos
- ✅ Next.js 15 + React 19 uchun optimal
- ✅ SSR to'liq support
- ✅ Type-safe
- ✅ Clean & maintainable
- ✅ Senior-level best practices
- ✅ Rasmdagidan ham yaxshiroq va optimallashtirilgan

Barcha servislar tayyor va ishlatishga yaroqli! 🎉

