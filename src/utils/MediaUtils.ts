export type MediaItem = {
  uri: string
  name?: string
  type?: string
  blob?: Blob
  fileName?: string
  mimeType?: string
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
