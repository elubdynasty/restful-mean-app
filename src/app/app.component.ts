import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
//import { Post } from './posts/post.model';

//Decorator starts with @
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor (private authService: AuthService){}
  //title = 'vincemeanprac1';
  /*storedPosts: Post[]=[];

  onPostAdded(post: Post){
    this.storedPosts.push(post);
  } Commented 9/8/19 bec. event-prop binding no longer needed*/
  ngOnInit(){
    this.authService.autoAuthUser();
  }
}
