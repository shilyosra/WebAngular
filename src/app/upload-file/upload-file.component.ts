import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  post: Post[] = [];
  private idPost: string = 'post1'; // Replace with the actual blogId
  selectedFile: File | null = null;

  constructor(private postService : PostService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    // Retrieve the blogCode from the route parameters
    this.route.params.subscribe(params => {
      this.idPost = params['id'];
      console.log('Post ID:', this.idPost);
    });
  }


  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      // Use the BlogService to upload the file
      console.log(this.idPost);
  
      this.postService.uploadPhoto(this.idPost, this.selectedFile).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            // const percentDone = Math.round((100 * event.loaded) / event.total);
            // console.log(`File is ${percentDone}% uploaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely uploaded!', event);           
          }
          this.router.navigateByUrl(`/listBlog`);
        },
        (error: any) => {
          console.error('Error uploading file:', error);          
        }
      );
      
    }
  }
  
}
