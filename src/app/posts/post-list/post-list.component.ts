import { Component, /*Input,*/ OnInit,OnDestroy} from '@angular/core';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import {AuthService} from '../../auth/auth.service';
import { Subscription } from 'rxjs'; //store subscription in the new property

@Component({
  selector: 'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

 //Reference as the url instead to cop-paste the html body

export class PostListComponent implements OnInit, OnDestroy { //lifecycle hooks
//  posts = [
//    {title: '1st Post', content: 'This is the 1st post\'s content'},
//    {title: '2nd Post', content: 'This is the 2nd post\'s content'},
//    {title: '3rd Post', content: 'This is the 3rd post\'s content'}
//  ];

  /*@Input()*/
  posts: Post[]=[];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userId: string;
  userisAuthenticated = false;

//bind the post from the outside by adding another Decorator Input
//Dependency injection from PostsService to the components

//postsService: PostsService; (long method of accessing PostsService class)
  private postsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService){}

  ngOnInit(){
    this.isLoading = true;
  //Angular f(x) that automatically executes for me when it creates this component
  //recommended for basic initialization tasks on ngOnInit
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number})=>{
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      }); //has 3 args (function executed whenever the new event is emitted,called when error is emitted, f(x) is called whenever the observable is completed)
      this.userisAuthenticated = this.authService.getisAuth();
      this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userisAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent){
    //console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId: string){

    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe(); //to prevent memory leaks
    this.authListenerSubs.unsubscribe();
  }
}
