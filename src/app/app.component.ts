import { Component } from '@angular/core';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {BooksListComponent} from "./components/books-list/books-list.component";
import {SpinnerComponent} from "./components/spinner/spinner.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, BooksListComponent, SpinnerComponent]
})
export class AppComponent {
  title = 'book-manager';
}
