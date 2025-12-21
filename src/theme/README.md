# 🎨 Theme System Documentation

## Tổng Quan

Hệ thống theme centralized giúp quản lý màu sắc cho toàn bộ app một cách dễ dàng và nhất quán. Lấy cảm hứng từ Instagram và Facebook.

## 📁 Cấu Trúc File

```
src/theme/
├── colors.ts         # Định nghĩa tất cả màu sắc
├── useAppColors.ts   # Custom hook để lấy màu theo theme
└── index.ts          # Barrel export
```

## 🚀 Cách Sử Dụng

### 1. Import Hook

```tsx
import { useAppColors } from '@/theme'
```

### 2. Sử Dụng Trong Component

```tsx
export default function MyComponent() {
  const colors = useAppColors()

  return (
    <View backgroundColor={colors.background}>
      <Text color={colors.text}>Hello</Text>
      <Button backgroundColor={colors.accent}>Click me</Button>
    </View>
  )
}
```

## 🎨 Các Màu Có Sẵn

### Basic Colors

```tsx
colors.background // #FFFFFF (light) / #000000 (dark)
colors.backgroundSecondary // #F5F5F5 (light) / #121212 (dark)
colors.backgroundTertiary // #F0F0F0 (light) / #1A1A1A (dark)

colors.text // #262626 (light) / #FAFAFA (dark)
colors.textSecondary // #8E8E93 (light) / rgba(250,250,250,0.6) (dark)
colors.placeholder // #8E8E93 (light) / rgba(250,250,250,0.5) (dark)

colors.border // #DBDBDB (light) / rgba(255,255,255,0.1) (dark)
colors.borderSecondary // #C7C7C7 (light) / rgba(255,255,255,0.15) (dark)

colors.accent // #0095F6 (light) / #1DA1F2 (dark)
colors.card // #FFFFFF (light) / #121212 (dark)
colors.modal // #FFFFFF (light) / #121212 (dark)
```

### Input Colors

```tsx
colors.input.background // #F0F0F0 (light) / rgba(255,255,255,0.12) (dark)
colors.input.border // #DBDBDB (light) / rgba(255,255,255,0.15) (dark)
colors.input.text // #262626 (light) / #FAFAFA (dark)
colors.input.placeholder // #8E8E93 (light) / rgba(250,250,250,0.5) (dark)
```

### Button Colors

```tsx
colors.button.primary // #0095F6 (light) / #1DA1F2 (dark)
colors.button.primaryText // #FFFFFF
colors.button.secondary // #F0F0F0 (light) / rgba(255,255,255,0.12) (dark)
colors.button.secondaryText // #262626 (light) / #FAFAFA (dark)
```

### Semantic Colors

```tsx
colors.success // #34C759 (light) / #32D74B (dark)
colors.error // #FF3B30 (light) / #FF453A (dark)
colors.warning // #FF9500 (light) / #FF9F0A (dark)
colors.info // #0095F6 (light) / #1DA1F2 (dark)
```

### Feature Colors

```tsx
// Gallery
colors.features.gallery.icon // #0095F6 (light) / #1DA1F2 (dark)
colors.features.gallery.background // rgba(0,149,246,0.12) (light) / rgba(29,161,242,0.2) (dark)

// Camera
colors.features.camera.icon // #5856D6 (light) / #8B89F6 (dark)
colors.features.camera.background // rgba(88,86,214,0.12) (light) / rgba(88,86,214,0.2) (dark)

// Story
colors.features.storyGradient // ['#F58529', '#FEDA77', '#DD2A7B', '#8134AF', '#515BD4']

// Status
colors.features.online // #34C759
colors.features.offline // #8E8E93
colors.features.like // #FF3B30
```

### Component-Specific Colors

```tsx
// Segment Control (Post/Story toggle)
const segmentControl = colors.components.segmentControl
segmentControl.background // #F0F0F0 (light) / rgba(255,255,255,0.08) (dark)
segmentControl.activeBackground // #0095F6 (light) / rgba(29,161,242,0.28) (dark)
segmentControl.inactiveText // #8E8E93 (light) / rgba(250,250,250,0.75) (dark)
segmentControl.activeText // #FFFFFF

// Chip
const chip = colors.components.chip
chip.background // rgba(0,149,246,0.1) (light) / rgba(29,161,242,0.15) (dark)
chip.border // rgba(0,149,246,0.2) (light) / rgba(29,161,242,0.3) (dark)

// Search Bar
const searchBar = colors.components.searchBar
searchBar.background // #F0F0F0 (light) / rgba(255,255,255,0.1) (dark)
searchBar.border // #DBDBDB (light) / rgba(255,255,255,0.15) (dark)
searchBar.icon // #8E8E93 (light) / rgba(250,250,250,0.6) (dark)
searchBar.text // #262626 (light) / #FAFAFA (dark)
```

## 📝 Ví Dụ Thực Tế

### Example 1: Button với Theme

```tsx
import { useAppColors } from '@/theme'

function MyButton({ onPress, children }) {
  const colors = useAppColors()

  return (
    <Button backgroundColor={colors.accent} onPress={onPress}>
      <Text color={colors.button.primaryText}>{children}</Text>
    </Button>
  )
}
```

### Example 2: Card Component

```tsx
import { useAppColors } from '@/theme'

function PostCard({ post }) {
  const colors = useAppColors()

  return (
    <YStack
      backgroundColor={colors.card}
      borderColor={colors.border}
      borderWidth={1}
      borderRadius={12}
      padding="$3"
    >
      <Text color={colors.text}>{post.title}</Text>
      <Text color={colors.textSecondary}>{post.description}</Text>
    </YStack>
  )
}
```

### Example 3: Search Bar

```tsx
import { useAppColors } from '@/theme'

function SearchInput() {
  const colors = useAppColors()
  const searchBar = colors.components.searchBar

  return (
    <XStack
      backgroundColor={searchBar.background}
      borderColor={searchBar.border}
      borderWidth={1}
      borderRadius={12}
      padding="$2"
    >
      <Search size={20} color={searchBar.icon} />
      <Input
        placeholder="Search"
        placeholderTextColor={colors.placeholder}
        color={searchBar.text}
      />
    </XStack>
  )
}
```

### Example 4: Action Buttons

```tsx
import { useAppColors } from '@/theme'

function ActionButtons() {
  const colors = useAppColors()

  return (
    <XStack gap="$2">
      <Button backgroundColor={colors.features.gallery.background}>
        <Image color={colors.features.gallery.icon} />
        <Text>Gallery</Text>
      </Button>

      <Button backgroundColor={colors.features.camera.background}>
        <Camera color={colors.features.camera.icon} />
        <Text>Camera</Text>
      </Button>
    </XStack>
  )
}
```

## 🛠️ Chỉnh Sửa Theme

### Thay Đổi Màu Chính

Chỉnh sửa file `src/theme/colors.ts`:

```typescript
export const AppColors = {
  light: {
    accent: '#YOUR_COLOR', // Thay đổi màu accent cho light mode
    // ...
  },
  dark: {
    accent: '#YOUR_COLOR', // Thay đổi màu accent cho dark mode
    // ...
  },
}
```

### Thêm Màu Mới

```typescript
export const AppColors = {
  light: {
    // ... existing colors
    myCustomColor: '#FF0000',
  },
  dark: {
    // ... existing colors
    myCustomColor: '#FF6666',
  },
}
```

Sau đó cập nhật hook trong `useAppColors.ts`:

```typescript
export const useAppColors = () => {
  // ... existing code
  return {
    // ... existing colors
    myCustomColor: AppColors[mode].myCustomColor,
  }
}
```

## 🎯 Best Practices

1. **Luôn dùng hook thay vì hardcode màu**

   ```tsx
   // ✅ Good
   const colors = useAppColors()
   <View backgroundColor={colors.background} />

   // ❌ Bad
   <View backgroundColor="#FFFFFF" />
   ```

2. **Sử dụng semantic colors cho trạng thái**

   ```tsx
   // ✅ Good
   <Text color={colors.success}>Success!</Text>
   <Text color={colors.error}>Error!</Text>

   // ❌ Bad
   <Text color="#34C759">Success!</Text>
   ```

3. **Tránh inline styles với màu hardcode**

   ```tsx
   // ✅ Good
   const colors = useAppColors()
   style={{ backgroundColor: colors.card }}

   // ❌ Bad
   style={{ backgroundColor: '#FFFFFF' }}
   ```

4. **Sử dụng component-specific colors khi cần**
   ```tsx
   const colors = useAppColors()
   const searchBar = colors.components.searchBar
   // Use searchBar.background, searchBar.icon, etc.
   ```

## 🔄 Migration Guide

Để migrate component cũ sang dùng theme system:

### Before:

```tsx
function OldComponent() {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const bgColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FAFAFA' : '#262626'

  return (
    <View backgroundColor={bgColor}>
      <Text color={textColor}>Hello</Text>
    </View>
  )
}
```

### After:

```tsx
function NewComponent() {
  const colors = useAppColors()

  return (
    <View backgroundColor={colors.background}>
      <Text color={colors.text}>Hello</Text>
    </View>
  )
}
```

## 🎨 Design System Reference

Màu sắc được lấy cảm hứng từ:

- **Instagram**: Primary blue (#0095F6), minimalist design
- **Facebook**: Classic blue (#1877F2)
- **iOS Design**: Semantic colors (success, error, warning)

## 📱 Component Examples Đã Migrate

- ✅ [PostAction.tsx](../features/create/components/PostAction.tsx)
- ✅ [Header.tsx](../features/create/components/Header.tsx)
- ✅ [SearchScreen.tsx](../features/search/SearchScreen.tsx)
- ✅ [SearchFilters.tsx](../features/search/components/SearchFilters.tsx)

## 🤝 Contributing

Khi thêm màu mới:

1. Thêm vào `colors.ts`
2. Export trong `useAppColors.ts`
3. Update documentation này
4. Test cả light và dark mode
