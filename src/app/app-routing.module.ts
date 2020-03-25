import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent }, //'' means main page
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]}, //localhost:4200/create
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'} //lazily loads the child module located at AuthModule
    //alternative path () => import('./auth/auth.module').then(m => m.AuthModule)
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})

export class AppRoutingModule {  }
