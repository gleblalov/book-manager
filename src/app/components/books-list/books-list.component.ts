import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {BooksService} from "../../services/books/books.service";
import {IBook} from "../../interfaces/book";
import {BookCardComponent} from "../book-card/book-card.component";
import {BookModalComponent} from "../../modals/book-modal/book-modal.component";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {State} from "../../constants/request-state";
import {StateService} from "../../services/state/state.service";
import {ToastrService} from "../../services/toastr/toastr.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [BookCardComponent, NgForOf, MatDialogModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, NgIf],
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'scale(0.5)', offset: 1 }) )
      ])
    ])
  ]
})
export class BooksListComponent implements OnInit {

  constructor(
    public bookService: BooksService,
    public stateService: StateService,
    public toastrService: ToastrService,
    private _dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.bookService.getBooksList();
  }

  public trackByBookId(index: number, book: IBook): number {
    return book.id;
  }

  public deleteBook(id: number): void {
    this.stateService.setRequestState(State.PROCESSING);
    this.bookService.deleteBook(id).subscribe(() => {
      this.toastrService.showNotification('Книгу успішно видалено', 'X', 'success');
      this.bookService.getBooksList();
    }, error => {
      this.stateService.setRequestState(State.ERROR);
      this.toastrService.showNotification('Виникла помилка під час видалення книги', 'X', 'error');
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
