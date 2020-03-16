import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({

  templateUrl:'./signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService){}

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    this.authService.createUser(form.value.email, form.value.password); //after putting the subscribe method w/ error handling arg,
    //.subscribe error method removed and put it back into the auth service
  }

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isLoading = false;
    });
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
