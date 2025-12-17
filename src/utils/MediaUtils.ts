import { MessageType } from '@/types/Message'

export type MediaItem = {
  uri: string
  name?: string
  type?: string
  blob?: Blob
  fileName?: string
  mimeType?: string
  duration?: number
}

export const getMediaItemFromCamera = (media: {
  uri: string
  type: 'photo' | 'video'
  duration?: number
}): MediaItem => {
  const filename = media.uri.startsWith('data:')
    ? `photo-${Date.now()}.jpg`
    : media.uri.split('/').pop() || `photo-${Date.now()}.jpg`

  const mimeType = media.uri.startsWith('data:')
    ? media.uri.split(',')[0].split(':')[1].split(';')[0]
    : media.type === 'video'
      ? 'video/mp4'
      : 'image/jpeg'

  return {
    uri: media.uri,
    type: media.type,
    name: filename,
    fileName: filename,
    mimeType: mimeType,
    duration: media.duration,
  }
}

export const getMediaItemsFromPicker = (assets: any[]): MediaItem[] => {
  return assets.map(asset => ({
    uri: asset.uri,
    type: asset.mediaType === 'video' ? 'video' : 'photo',
    name: asset.fileName || asset.uri.split('/').pop() || 'file',
    fileName: asset.fileName || asset.uri.split('/').pop() || 'file',
    mimeType:
      asset.mimeType ||
      (asset.mediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
    duration: asset.duration,
  }))
}

export const processMediaForUpload = async (
  mediaItems: MediaItem[]
): Promise<{ uri: string; name: string; type: string }[]> => {
  if (!mediaItems || mediaItems.length === 0) return []

  const promises = mediaItems.map(async item => {
    // Case 1: Item has a blob (e.g. from local selection on Web)
    if (item.blob) {
      return new Promise<{ uri: string; name: string; type: string }>(
        resolve => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({
              uri: reader.result as string,
              name: item.fileName || 'image.jpg',
              type: item.mimeType || 'image/jpeg',
            })
          }
          reader.readAsDataURL(item.blob!)
        }
      )
    }

    // Case 2: Item is a remote URL (http/https) - need to fetch and convert to blob then data URI
    if (item.uri.startsWith('http://') || item.uri.startsWith('https://')) {
      try {
        const response = await fetch(item.uri)
        if (!response.ok) throw new Error('Download failed')

        const blob = await response.blob()
        const fileName = item.uri.split('/').pop() || 'media.jpg'

        return new Promise<{
          uri: string
          name: string
          type: string
        }>(resolve => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({
              uri: reader.result as string,
              name: fileName,
              type: blob.type || 'image/jpeg',
            })
          }
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error('Failed to download media:', item.uri, error)
        // Fallback: return original if download fails (backend might handle it or it will fail there)
        return {
          uri: item.uri,
          name: item.uri.split('/').pop() || 'media.jpg',
          type: 'image/jpeg',
        }
      }
    }

    // Case 3: Local file URI (e.g. React Native mobile) or already Data URI
    return {
      uri: item.uri,
      name: item.fileName || item.name || item.uri.split('/').pop() || 'file',
      type:
        item.mimeType ||
        item.type ||
        (item.uri.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'),
    }
  })

  return Promise.all(promises)
}

export const dataURItoBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

export const urlToDataURI = async (url: string): Promise<string> => {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export const getMediaTypeFromUrl = (url: string): MessageType => {
  if (!url) return MessageType.TEXT
  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes('audio_')) return MessageType.AUDIO

  if (lowerUrl.match(/\.(jpeg|jpg|png|gif|webp|bmp|heic)$/))
    return MessageType.IMAGE
  if (lowerUrl.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/)) return MessageType.VIDEO
  if (lowerUrl.match(/\.(mp3|wav|ogg|m4a|aac|webm)$/)) return MessageType.AUDIO
  return MessageType.FILE
}
