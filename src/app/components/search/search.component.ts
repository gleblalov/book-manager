import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, delay, of, Subscription} from "rxjs";
import {IBook} from "../../interfaces/book";
import {BooksService} from "../../services/books/books.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {StateService} from "../../services/state/state.service";
import {State} from "../../constants/request-state";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatListModule, ReactiveFormsModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':leave', [
        animate('500ms ease-in',
          style({ opacity: 0, transform: 'scale(0.5)', offset: 1 }) )
      ])
    ])
  ]
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() openBookModalEvent = new EventEmitter<IBook>();
  public searchControl = new FormControl('');
  public searchBooks: IBook[] = [];
  public isFocused: boolean = false;
  public isDirty: boolean = false;
  private _subscription: Subscription | undefined;

  constructor(
    public stateService: StateService,
    private _booksService: BooksService
  ) {
  }

  ngOnInit() {
    this._initSubscribes();
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  public onFocus(): void {
    this.isFocused = true;
    if (this.searchControl.value) {
      this.searchControl.setValue(this.searchControl.value);
      console.log('onFocus', this.searchControl.value)
    }
  }

  public onBlur(): void {
    setTimeout(() => {
      this.isFocused = false;
      this.isDirty = false;
      this.searchControl.setValue('')
    }, 200)
  }

  public openBookModal(book: IBook) {
    this.openBookModalEvent.emit(book);
  }

  private _initSubscribes() {
    this._subscription = this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        console.log('valueChanges', value)

        if (value) {
          this.isDirty = true;
        }
        this.filterBooks(value);
      });
  }

  private filterBooks(searchTerm: string | null): void {
    if (!searchTerm) {
      this.searchBooks = [];
      return;
    }

    this.stateService.setRequestState(State.SEARCHING);

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    of(this._booksService.booksList.filter(book =>
      book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      book.author.toLowerCase().includes(lowerCaseSearchTerm)
    ))
      .pipe(delay(500))
      .subscribe(filteredBooks => {
        this.searchBooks = filteredBooks;
        this.stateService.setRequestState(State.SUCCESS);
      });
  }
}
