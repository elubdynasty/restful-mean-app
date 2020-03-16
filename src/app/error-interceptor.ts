import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {MatDialog /*, MatDialogRef, MAT_DIALOG_DATA*/} from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private dialog: MatDialog){} //inject the dialog service and import it from @angular mat

  intercept(req: HttpRequest<any>, next: HttpHandler){ //Angular will call this method for req leaving the App. Interceptor works a lot like middleware, just for outgoing instead of incoming requests.

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)=>{
        let errorMessage = 'An unknown error occurred!';

        //console.log(error);
        //alert(error.error.message);

        if(error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error); //returning an observable
      })
    );
  }
}
