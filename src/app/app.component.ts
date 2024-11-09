import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Post } from './models/post';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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




