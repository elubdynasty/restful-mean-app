import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; //using framwork for NgModel directive
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent

  ],
  imports: [

    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule

  ]
})

export class AuthModule{}
