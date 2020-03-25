import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean>{
    const isAuth = this.authService.getisAuth();
    if(!isAuth){
      this.router.navigate(['./auth/login']);
    }
    return isAuth;
    //throw new Error('Method not implemented');
  }
}
