# API Architecture - FSD Structure

## 📁 Folder Structure

```
src/shared/api/
├── client/
│   ├── base-api.ts          # Universal fetch helper (SSR+CSR)
│   ├── server-fetch.ts      # Server-only fetch util (cookies, headers)
│   ├── browser-fetch.ts     # Client-only fetch util (localStorage)
│   └── index.ts             # Export universal API client
├── interceptors/
│   ├── auth-interceptor.ts  # Token management, refresh, retry
│   ├── error-handler.ts     # Unified error handling
│   └── index.ts
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
│   └── index.ts
├── types/
│   ├── common.ts
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── chat.types.ts
│   ├── slide.types.ts
│   ├── image.types.ts
│   ├── storage.types.ts
│   ├── payment.types.ts
│   ├── subscription.types.ts
│   ├── preset.types.ts
│   └── index.ts
└── index.ts                 # Main entry point
```

## 🎯 Architecture Benefits

### ✅ **Separation of Concerns**
- `base-api.ts` - Core fetch logic (universal)
- `server-fetch.ts` - SSR-specific (Next.js cookies/headers)
- `browser-fetch.ts` - Client-specific (localStorage)

### ✅ **Interceptor Pattern**
- `auth-interceptor.ts` - Auto token refresh, retry logic
- `error-handler.ts` - Unified error handling with toast

### ✅ **Type Safety**
- All types separated by domain
- Full TypeScript support

### ✅ **Next.js 15 Optimized**
- Async `cookies()` and `headers()` support
- SSR-first approach
- Automatic environment detection

## 📖 Usage Examples

### Server Component (SSR)

```tsx
import { UserService } from "@/shared/api";

export default async function ProfilePage() {
  // SSR - automatically uses serverApi, gets token from cookies
  const user = await UserService.getProfile();
  
  return <div>{user.first_name}</div>;
}
```

### Client Component

```tsx
"use client";

import { ChatService } from "@/shared/api";
import { toast } from "@/shared/stores/toastStore";
import { useState, useEffect } from "react";

export function ChatList() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    ChatService.getChats({ page: 1, limit: 20 })
      .then(setChats)
      .catch((error) => {
        toast.error("Xatolik!", "Chatlar yuklanmadi");
      });
  }, []);

  return <div>{/* Chat list */}</div>;
}
```

### Server Action

```tsx
"use server";

import { UserService } from "@/shared/api";
import { revalidatePath } from "next/cache";

export async function updateTheme(theme: "light" | "dark") {
  await UserService.updateProfile({ interface_theme: theme });
  revalidatePath("/profile");
}
```

## 🔑 Key Features

1. **Universal API Client** - `api` automatically selects server/browser implementation
2. **Auto Token Management** - Tokens automatically attached from cookies/localStorage
3. **Error Handling** - Unified error handling with toast notifications
4. **Type Safety** - Full TypeScript support for all endpoints
5. **SSR Optimized** - Next.js 15 async APIs support
6. **FormData Support** - File uploads handled automatically
7. **HTTP Methods** - GET, POST, PUT, PATCH, DELETE all supported

## 🚀 Services Available

- `AuthService` - Authentication
- `UserService` - User management
- `ChatService` - Chat operations
- `SlideService` - Slide operations
- `ImageService` - Image operations
- `StorageService` - File storage
- `PaymentService` - Payment processing
- `SubscriptionService` - Subscription management
- `PresetService` - Preset management
- `HealthService` - Health checks

## 📝 Method Signatures

All services follow this pattern:

```tsx
// GET request
ServiceName.getMethod(params?): Promise<ResponseType>

// POST request
ServiceName.postMethod(body, options?): Promise<ResponseType>

// PUT request
ServiceName.putMethod(id, body, options?): Promise<ResponseType>

// PATCH request
ServiceName.patchMethod(id, body, options?): Promise<ResponseType>

// DELETE request
ServiceName.deleteMethod(id, options?): Promise<void>
```

## 🎨 Best Practices

1. **Always use services** - Don't call `api` directly
2. **Handle errors** - Use try/catch or error boundaries
3. **Type everything** - Use TypeScript types from `@/shared/api/types`
4. **SSR first** - Prefer server components when possible
5. **Use interceptors** - Let interceptors handle token refresh automatically

