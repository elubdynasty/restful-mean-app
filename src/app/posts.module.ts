import { NgModule } from '@angular/core';
import { PostCreateComponent } from './posts/post-create/post-create.component';  //need to explicitly register this component so that the build process will able to scan the ts with app-post-create selector on it
import { PostListComponent } from './posts/post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { RouterModule} from '@angular/router';

@NgModule({
  declarations: [ //to be usable in another module (need to be re-exported)
    PostCreateComponent,
    PostListComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class PostsModule{}
