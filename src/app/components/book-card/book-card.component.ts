import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {IBook} from "../../interfaces/book";
import {MatCardModule} from "@angular/material/card";
import {RippleHoverDirective} from "../../directives/ripple-hover/ripple-hover.directive";
import {MatRippleModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, RippleHoverDirective, MatRippleModule, NgOptimizedImage, MatIconModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  @Input() book!: IBook;
  @Output() deleteBookEvent = new EventEmitter<number>();
  @Output() openModalEvent = new EventEmitter<IBook>();

  public deleteBook() {
    this.deleteBookEvent.emit(this.book.id);
  }

  public openModal() {
    this.openModalEvent.emit(this.book);
  }

}
