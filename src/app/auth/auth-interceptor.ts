import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler){ //Angular will call this method for req leaving the App. Interceptor works a lot like middleware, just for outgoing instead of incoming requests.
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + authToken) //extracting the token from Authorization on the back-end (check-auth)
    });
    return next.handle(authRequest);
  }
}
