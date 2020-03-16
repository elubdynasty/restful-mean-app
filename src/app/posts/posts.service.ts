//centralized some tasks and
//have easy access to data from within the different
//components without the need of event & prop. binding

import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'; //event emitter from rxjs on a broader scale
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
//The pckage rxjs is all about Observables. Objects that help us pass data around

@Injectable({providedIn: 'root'}) //Angular doesn't only find it but it
//creates the instance of service for the entire app
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>(); //eventemitter

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number){
      //return [...this.posts];
      const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
      this.http
      .get<{message: string, posts: any, maxPosts: number}>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return { posts: postData.posts.map((post: any) => { //return to array of posts
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      })) //a method that accepts multiple operators
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
    }

    getPostUpdateListener(){ //listening on the Subject
      return this.postsUpdated.asObservable();
    }

    getPost(id: string){
      return this.http.get<{_id: string; title:string; content: string; imagePath: string; creator: string;}>('http://localhost:3000/api/posts/'+ id);
    }

    addPost(title: string, content: string, image: File){
      //const post: Post = {id: null,title: title, content: content};
      const postData = new FormData(); //JSON can't include a file. So, instead of sending JSON, I'll send FormData
      //Prop. that we're trying to access on the backend, 'post.js'
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      this.http
      .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData) //instead of PostId: string
      .subscribe((myData) => {
        /*const post: Post = {
          id: myData.post.id,
          title: title,
          content: content,
          imagePath: myData.post.imagePath
        };
        //const id = myData.postId; //adding post with an ID
        //post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);*/ //emits a new value
        this.router.navigate(['/']); //nav back to the homepage
      });

    }

    updatePost(id: string, title: string, content: string, image: File | string){
        //const post: Post = {id: id,title: title, content: content, imagePath: null};
        let postData: Post | FormData;
        if(typeof(image)==='object'){
          postData = new FormData();
          postData.append('id', id);
          postData.append('title', title);
          postData.append('content', content);
          postData.append('image', image, title);
        } else{
          postData = {
            id: id,
            title: title,
            content: content,
            imagePath: image,
            creator: null
          };
        }

        this.http
        .put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe(response => { //console.log(response)
          /*const updatedPosts = [...this.posts];
          const oldPostIndex = updatedPosts.findIndex(p => p.id===id);
          const post: Post = {
            id: id,
            title: title,
            content: content,
            imagePath: ''
          }
          updatedPosts[oldPostIndex] = post;
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);*/
          this.router.navigate(['/']);
      });
    }

    deletePost(postId: string){

      return this.http
      .delete('http://localhost:3000/api/posts/' + postId);
      /*.subscribe(() => {
       const updatedPosts = this.posts.filter(post => post.id !== postId);
       //allows us to only return a subset of that posts array and we pass an arg, a f(x) to the filter
       //this f(x) will be executed for every post in the array, and if it returns true, then this element
       //will be kept. False, then this ele will not be part of the new filtered post array (aka post will not appear at frontend when deleted)
       this.posts = updatedPosts;
       this.postsUpdated.next([...this.posts]);
       //send a new posts updated notice to the rest of the app
     });*/

    }
}
