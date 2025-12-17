import { MessageType } from '@/types/Message'

export const getMediaTypeFromUrl = (url: string): MessageType => {
  if (!url) return MessageType.TEXT
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.match(/\.(jpeg|jpg|png|gif|webp|bmp|heic)$/))
    return MessageType.IMAGE
  if (lowerUrl.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/))
    return MessageType.VIDEO
  if (lowerUrl.match(/\.(mp3|wav|ogg|m4a|aac)$/)) return MessageType.AUDIO
  return MessageType.FILE
}
