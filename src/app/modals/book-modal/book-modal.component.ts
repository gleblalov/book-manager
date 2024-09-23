import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {IBook, IBookApi} from "../../interfaces/book";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DATE_FORMATS, MatRippleModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {BooksService} from "../../services/books/books.service";
import {RippleHoverDirective} from "../../directives/ripple-hover/ripple-hover.directive";
import {State} from "../../constants/request-state";
import {StateService} from "../../services/state/state.service";
import {ToastrService} from "../../services/toastr/toastr.service";

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-book-modal',
  standalone: true,
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  imports: [CommonModule, MatDialogModule, MatCardModule, MatIconModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatButtonModule, RippleHoverDirective, MatRippleModule],
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public book: IBook | undefined;
  public isEditMode: boolean = false;
  public isAddBook: boolean = false;
  public bookForm!: FormGroup;
  public imageSrc: string | ArrayBuffer | null = null;

  public get isFormDirty(): boolean {
    return !(this.imageSrc || this.bookForm.dirty);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { book?: IBook, isAddBook?: boolean },
    public dialogRef: MatDialogRef<BookModalComponent>,
    public bookService: BooksService,
    public stateService: StateService,
    public toastrService: ToastrService,
    private _fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.book = this.data.book;

    if (this.data.isAddBook) {
      this.isEditMode = true;
      this.isAddBook = true;
      this._initForm();
    }
  }

  public switchEditMode() {
    this.isEditMode = !this.isEditMode;
    this.imageSrc = null;
    if (this.isEditMode) {
      this._initForm();
    }
  }

  public setYear(normalizedYear: Date, datepicker: MatDatepicker<any>) {
    this.bookForm?.get('year')?.setValue(normalizedYear);
    datepicker.close();
  }

  public onSubmit(): void {
    if (this.bookForm.valid) {
      this.stateService.setRequestState(State.PROCESSING);
      const body: IBookApi = {
        title: this.bookForm.value.title,
        author: this.bookForm.value.author,
        year: this.bookForm.value.year ? this.bookForm.value.year.getFullYear() : '',
        description: this.bookForm.value.description,
        image: this.isAddBook ? this.imageSrc : this.imageSrc || this.book?.image,
      }

      if (this.isAddBook) {
        this.bookService.addBook(body).subscribe(res => {
          this.bookService.getBooksList();
          this.dialogRef.close();
          this.toastrService.showNotification('Книгу успішно додано', 'X', 'success');
          this.imageSrc = null;
        }, error => {
          this.stateService.setRequestState(State.ERROR);
          this.toastrService.showNotification('Виникла помилка під час додовання книги', 'X', 'error');
          console.log(error)
        })
      } else {
        if (this.book?.id) {
          this.bookService.editBook(this.book.id, body).subscribe(res => {
            this.bookService.getBooksList();
            this.dialogRef.close();
            this.toastrService.showNotification('Книгу успішно редаговано', 'X', 'success');
            this.imageSrc = null;
          }, error => {
            this.stateService.setRequestState(State.ERROR);
            this.toastrService.showNotification('Виникла помилка під час редагування книги', 'X', 'error');
            console.log(error)
          })
        }
      }
    }
  }

  public deleteBook(): void {
    if (this.book?.id) {
      this.stateService.setRequestState(State.PROCESSING);
      this.bookService.deleteBook(this.book.id).subscribe(() => {
        this.toastrService.showNotification('Книгу успішно видалено', 'X', 'success');
        this.bookService.getBooksList();
        this.dialogRef.close();
      }, error => {
        this.stateService.setRequestState(State.ERROR);
        this.toastrService.showNotification('Виникла помилка під час видалення книги', 'X', 'error');
        console.log(error)
      });
    }
  }

  public triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private _initForm(): void {
    this.bookForm = this._fb.group({
      title: [this.book?.title || '', [Validators.required]],
      author: [this.book?.author || '', [Validators.required]],
      year: [this.book?.year ? new Date(+this.book?.year, 0, 1) : ''],
      description: [this.book?.description || ''],
      image: [this.book?.image || ''],
    });
  }
}
