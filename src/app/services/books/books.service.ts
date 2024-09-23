import {Injectable} from '@angular/core';
import {delay, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IBook, IBookApi} from "../../interfaces/book";
import {StateService} from "../state/state.service";
import {State} from "../../constants/request-state";

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  public booksList: IBook[] = [];
  private apiUrl = 'http://localhost:3000/books';

  constructor(
    public _stateService: StateService,
    private http: HttpClient
  ) {
  }

  public getBooksList(): void {
    this._stateService.setRequestState(State.PROCESSING);
    this._getBooksList().subscribe(res => {
      this.booksList = res;
      this._stateService.setRequestState(State.SUCCESS);
    }, error => {
      if (error.status === 0) {
        alert('Запустіть у терміналі "npm run server"');
      }
      this._stateService.setRequestState(State.ERROR);
      console.log(error)
    });
  }

  public getBook(id: number): Observable<IBook> {
    return this.http.get<IBook>(`${this.apiUrl}/${id}`);
  }

  public addBook(book: IBookApi): Observable<IBook> {
    return this.http.post<IBook>(this.apiUrl, book).pipe(delay(500));
  }

  public editBook(id: number, book: IBookApi): Observable<IBook> {
    return this.http.put<IBook>(`${this.apiUrl}/${id}`, book).pipe(delay(500));
  }

  public deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(delay(500));
  }

  private _getBooksList(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl).pipe(delay(500));
  }
}
