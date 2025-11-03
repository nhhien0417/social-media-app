import { Image, ImageStyle } from "react-native";

export default function Avatar({ uri, size = 32, style }: { uri?: string; size?: number; style?: ImageStyle }) {
  return (
    <Image
      source={{ uri }}
      style={[{ width: size, height: size, borderRadius: 999 }, style]}
    />
  );
}
