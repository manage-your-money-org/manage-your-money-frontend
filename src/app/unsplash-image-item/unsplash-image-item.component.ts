import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UnsplashPhoto} from "../shared/models/response/Unsplash/UnsplashPhoto";

@Component({
  selector: 'app-unsplash-image-item',
  templateUrl: './unsplash-image-item.component.html',
  styleUrl: './unsplash-image-item.component.css'
})
export class UnsplashImageItemComponent {

  @Input() unsplashImageItem: UnsplashPhoto;
  @Input() isSelected: boolean;
  @Output() selectedUnsplashImage = new EventEmitter<UnsplashPhoto>;

  onItemClick() {

    this.selectedUnsplashImage.emit(this.unsplashImageItem);
  }

}
