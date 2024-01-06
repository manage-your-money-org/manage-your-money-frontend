import {UnsplashPhotoUrls} from "./UnsplashPhotoUrls";
import {Links} from "./Links";
import {UnsplashUser} from "./UnsplashUser";

export interface UnsplashPhoto {
  id: string,
  width: number,
  height: number,
  color: string,
  alt_description: string,
  urls: UnsplashPhotoUrls,
  links: Links,
  user: UnsplashUser,
}
