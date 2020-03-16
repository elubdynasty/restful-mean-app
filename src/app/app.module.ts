import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //using framwork for NgModel directive
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';  //need to explicitly register this component so that the build process will able to scan the ts with app-post-create selector on it
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule

  ],
  //any collection of services is for providers.
  //allows Angular to find the service
  //Option 1 if you're not using @Injectable Decorator for the Service
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent] //informs Angular that this comp is going to get used, eventhough Ang can't see it
})
export class AppModule { }

//it defines the feature
