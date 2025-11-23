import { useLocalSearchParams } from 'expo-router'
import ProfileScreen from '@/features/profile/ProfileScreen'

export default function UserProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <ProfileScreen userId={id} />
}
