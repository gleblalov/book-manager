import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  public snackBar = inject(MatSnackBar);

  showNotification(message: string, action: string, type: 'success' | 'error') {
    let panelClass = '';
    switch (type) {
      case 'success':
        panelClass = 'snack-success';
        break;
      case 'error':
        panelClass = 'snack-error';
        break;
    }

    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: panelClass,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
