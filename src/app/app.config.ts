import {ApplicationConfig} from "@angular/platform-browser";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {importProvidersFrom} from "@angular/core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule)
  ],
};
