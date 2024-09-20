import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
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
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  imports: [CommonModule, MatDialogModule, MatCardModule, MatIconModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatButtonModule, RippleHoverDirective, MatRippleModule],
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  public book: IBook | undefined;
  public isEditMode: boolean = false;
  public isAddBook: boolean = false;
  public bookForm!: FormGroup;
  public imageSrc: string | ArrayBuffer | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { book?: IBook, isAddBook?: boolean },
    public dialogRef: MatDialogRef<BookModalComponent>,
    private _fb: FormBuilder,
    private _bookService: BooksService,
  ) {}

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
    if (this.isEditMode) {
      this._initForm();
    }
  }

  public setYear(normalizedYear: Date, datepicker: MatDatepicker<any>) {
    this.bookForm?.get('year')?.setValue(normalizedYear);
    datepicker.close();
  }

  public onSubmit(): void {
    const body: IBookApi = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      year: this.bookForm.value.year ? this.bookForm.value.year.getFullYear() : '',
      description: this.bookForm.value.description,
      image: this.imageSrc,
    }

    if (this.isAddBook) {
      this._bookService.addBook(body).subscribe(res => {
        this._bookService.getBooksList();
        this.dialogRef.close();
        this.imageSrc = null;
      })
    } else {
      if (this.book?.id) {
        this._bookService.editBook(this.book.id, body).subscribe(res => {
          this._bookService.getBooksList();
          this.dialogRef.close();
          this.imageSrc = null;
        })
      }
    }
  }

  public deleteBook(): void {
    if (this.book?.id) {
      this._bookService.deleteBook(this.book.id).subscribe(() => {
        this._bookService.getBooksList();
        this.dialogRef.close();
      }, error => {
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
      console.log(this.bookForm)
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
