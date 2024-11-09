import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Post } from '../models/post';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.css']
})
export class PostAddComponent implements OnInit{
  Postsaveform = new FormGroup({
    
    datePost: new FormControl(),
    
    content: new FormControl()
  });

  post: Post = {
    idPost: '',
    datePost: '',
    content: '',
    image: '',
    interactions:[],
    
  };
  submitted = false;
  public Editor = ClassicEditor as any;

  constructor(private postService: PostService, private router: Router) { }

  savePost(): void {
    if (this.Postsaveform.invalid) {
      return;
    }

    const data = {
      
      datePost: this.Postsaveform.get('datePost')!.value,
      
      content: this.Postsaveform.get('content')!.value
    };

    this.postService.createPost(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        this.router.navigateByUrl(`/upload/${res.idPost}`);
        console.log("ahawa: ", res.idPost);
      },
      error: (e) => console.error(e)
    });
  }

  newPost(): void {
    this.submitted = false;
    this.post = {
      idPost: '',
      datePost: '',
      content: '',
      image: '',
      interactions:[],
  
    };
  }

  ngOnInit(): void {
  }
}

