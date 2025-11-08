# API Architecture Decision

## Qaysi yondashuv yaxshi?

### ✅ **client.ts (Functional Approach)** - TAVSIYA ETILADI

**Nima uchun:**
1. **Next.js 15 + React 19 uchun optimal** - `cookies()` va `headers()` async bo'lgani uchun functional approach yaxshi
2. **SSR Support** - Server-side'da cookie'dan avtomatik token olish
3. **Type Safety** - TypeScript bilan to'liq type-safe
4. **Tree-shaking** - Faqat ishlatilgan kod bundle'ga kiradi
5. **No Singleton Issues** - SSR'da singleton pattern muammo yaratishi mumkin
6. **Simple & Clean** - O'qish va maintain qilish oson

### ❌ **base.service.ts (Class-based Singleton)** - TAVSIYA ETILMAYDI

**Nima uchun:**
1. **SSR Issues** - Singleton pattern SSR'da muammo yaratishi mumkin
2. **Unnecessary Abstraction** - Har bir service o'ziga xos, base abstraction kerak emas
3. **Complexity** - Qo'shimcha complexity qo'shadi
4. **Not Next.js 15 Optimized** - Async cookies() bilan to'g'ri ishlamaydi

## Senior Level Yechim

### Optimal Struktura:

```
src/shared/api/
├── client.ts              # ✅ Functional base client (SSR optimized)
├── types/
│   └── index.ts          # All type definitions
└── services/
    ├── auth.service.ts   # ✅ Static class methods
    ├── user.service.ts   # ✅ Static class methods
    └── ...               # ✅ Har bir service alohida
```

### Nima uchun bu yondashuv yaxshi?

1. **Separation of Concerns**
   - Har bir service o'z domain'iga ega
   - Base abstraction kerak emas (DRY principle, lekin over-engineering emas)

2. **SSR First**
   - `client.ts` Next.js 15'ning async cookies() bilan ishlaydi
   - Server-side'da avtomatik cookie forwarding
   - Client-side'da localStorage fallback

3. **Type Safety**
   - Har bir service method TypeScript type'lar bilan
   - Request/Response type'lar aniq

4. **Developer Experience**
   - `AuthService.loginWithWebApp()` - to'g'ridan-to'g'ri chaqirish mumkin
   - IDE autocomplete ishlaydi
   - JSDoc comments bilan documentation

## Foydalanish

### Server Component (SSR):
```tsx
import { AuthService } from "@/shared/api";

export default async function LoginPage() {
  // SSR - cookie'dan avtomatik token olinadi
  const user = await UserService.getProfile();
  return <div>{user.first_name}</div>;
}
```

### Client Component:
```tsx
"use client";
import { AuthService } from "@/shared/api";

export function LoginButton() {
  const handleLogin = async () => {
    // Client-side - localStorage'dan token olinadi
    const auth = await AuthService.loginWithWebApp(initData);
  };
  return <button onClick={handleLogin}>Login</button>;
}
```

### Server Action:
```tsx
"use server";
import { UserService } from "@/shared/api";

export async function updateTheme(theme: "light" | "dark") {
  // SSR - cookie'dan avtomatik token olinadi
  await UserService.updateProfile({ interface_theme: theme });
}
```

## Xulosa

✅ **client.ts + Static Service Classes** - Bu eng yaxshi yondashuv:
- Next.js 15 + React 19 uchun optimal
- SSR to'liq support
- Type-safe
- Clean & maintainable
- Senior level best practices

❌ **base.service.ts** - O'chirib tashlash kerak:
- SSR'da muammo yaratishi mumkin
- Unnecessary abstraction
- Over-engineering

