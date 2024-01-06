export interface UnsplashUser {
  id: string,
  name: string,
  username: string,
  profile_image: {
    small: string,
    medium: string,
    large: string
  },
  total_collections: number,
  total_photos: number
}
