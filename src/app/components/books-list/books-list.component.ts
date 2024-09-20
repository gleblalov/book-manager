import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { BooksService } from "../../services/books/books.service";
import {IBook} from "../../interfaces/book";
import {BookCardComponent} from "../book-card/book-card.component";
import {BookModalComponent} from "../../modals/book-modal/book-modal.component";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [BookCardComponent, NgForOf, MatDialogModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, NgIf],
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  constructor(
    public bookService: BooksService,
    private _dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.bookService.getBooksList();
  }

  public deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe(() => {
      this.bookService.getBooksList();
    }, error => {
      console.log(error)
    });
  }


  public openBookModal(book: IBook) {
    const config = {
      width: '400px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        book: book
      }
    };

    this._dialog.open(BookModalComponent, config);
  }
}
