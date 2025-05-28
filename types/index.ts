export interface Video {
    id: string
    title: string
    description: string
    publicId: string 
    originalSize: number
    compressedSize: number
    duration: number
    createdAt: Date
    updatedAt: Date
}

export interface Image {
  id: string;
  publicId: string;
  userId: string;
  originalSize: string;
  compressedSize: string;
  createdAt: Date;
  updatedAt: Date;
}