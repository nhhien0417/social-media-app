export interface Media {
  id: string
  type: 'image' | 'video'
  url: string
  ratio: number
  thumbUrl?: string
}
