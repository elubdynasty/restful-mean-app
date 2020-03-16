import { Component,OnInit,OnDestroy } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit, OnDestroy {
  userisAuthenticated = false;

  private authListenerSubs: Subscription;
  constructor(private authService: AuthService){}


  ngOnInit(){ //setting up the subscription to that AuthStatusListener
    this.userisAuthenticated=this.authService.getisAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userisAuthenticated = isAuthenticated;
    });
  }

  onLogout(){
    this.authService.logout(); //should clear the token and inform the interested part of the page,
                               //it's about to change the authentication status
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
