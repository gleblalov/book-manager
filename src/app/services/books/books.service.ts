import {Injectable} from '@angular/core';
import {IBook, IBookApi} from "../../interfaces/book";
import {BOOKS} from "../../mock/books";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  public booksList: IBook[] = [];
  private apiUrl = 'http://localhost:3000/books';

  constructor(
    private http: HttpClient
  ) {
  }

  public getBooksList(): void {
    this._getBooksList().subscribe(res => {
      this.booksList = res;
    }, error => {
      if (error.status === 0) {
        alert('Запустіть у терміналі "npm run server"');
      }
      console.log(error)
    });
  }

  public getBook(id: number): Observable<IBook> {
    return this.http.get<IBook>(`${this.apiUrl}/${id}`);
  }

  public addBook(book: IBookApi): Observable<IBook> {
    return this.http.post<IBook>(this.apiUrl, book);
  }

  public editBook(id: number, book: IBookApi): Observable<IBook> {
    return this.http.put<IBook>(`${this.apiUrl}/${id}`, book);
  }

  public deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private _getBooksList(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl);
  }
}
