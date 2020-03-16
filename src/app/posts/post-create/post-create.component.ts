//more than just the template but it needs the template
import { Component, OnInit, OnDestroy /*EventEmitter, Output*/} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

 //Reference as the url instead to cop-paste the html body

export class PostCreateComponent implements OnInit, OnDestroy {
  //a variable within the class that doesn't need var, const or let

  //enteredTitle="";
  //enteredContent="";
  //(Commented as of 9/8/19 due to added PostsService) @Output() postCreated = new EventEmitter<Post>(); generic type with Post (we can pass addt'l data on what data type this one works with)
  //this will emit to the listener from the outside
  //newPost = 'NO CONTENT';
  isLoading=false;
  form: FormGroup;
  imgDisplay: string;
  mode ='create';
  private postId: string;
  post: Post;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService){} //this router pkg, ActivatedRoute gives us this activated route obj and this holds some important info abt the route we're currently on

  ngOnInit(){ //Good for initialization tasks
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isLoading = false;
      }
    ); //setup an AuthStatusListener
    this.form = new FormGroup({
      title: new FormControl(null,
        {
          validators: [Validators.required,Validators.minLength(3)]
        }), //first arg is beginning form state. 2nd arg to attach validators
      content: new FormControl(null,
        {
          validators: [Validators.required]
        }),

      image: new FormControl(null,
        {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        })

    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId=paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.postId).subscribe(postData=>{
          this.isLoading=false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
       });

      }
      else{
        this.mode='create';
        this.postId=null;
      }
    });  //can listen to changes in th route url or in the params.. therefore react to that & update the UI
  }

  //adding image controls to store the image
  //no need to import Event bcos its a Javascript type
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); //unlike setValue, you set the value for the single input or control
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgDisplay = reader.result as string;
    } //async code. It takes a while why the author uses callback f(x)
    reader.readAsDataURL(file); //kickoff the process w/c will lead to the event that being fired above

    //console.log(file);
    //console.log(this.form);
  }

  onSavePost(){

    //Getting user input
    //this.newPost = this.enteredValue; Instead of putting postInput.value
    if(this.form.invalid){
      return;
    }
    /*const post: Post = {
      title: form.value.title,  //this.enteredTitle
      content: form.value.content
    }; Don't need this because it's initialized already at PostsService*/
    this.isLoading=true;
    if(this.mode==='create'){
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );

    } else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset(); //auto-reset the form after addPost
    //(Commented as of 9/8/19 due to added PostsService) this.postCreated.emit(post); passes the post as an argument (but no longer needed because there;s a service already)
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe(); //to prevent memory leaks

  }
}
