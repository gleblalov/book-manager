import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {BookModalComponent} from "../../modals/book-modal/book-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {IBook} from "../../interfaces/book";
import {SearchComponent} from "../search/search.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatInputModule, MatButtonModule, MatListModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  constructor(
    private dialog: MatDialog
  ) {}

  public openBookModal(book?: IBook): void {
    const config = {
      width: '400px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        ...(book ? { book: book } : {isAddBook: true})
      }
    }

    this.dialog.open(BookModalComponent, config);
  }

}
