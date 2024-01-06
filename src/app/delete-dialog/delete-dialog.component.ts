import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent implements OnInit {

  message = "This will delete this item";

  constructor(@Inject(MAT_DIALOG_DATA) private data: string) {
  }

  ngOnInit(): void {
    this.message = this.data;
  }
}
