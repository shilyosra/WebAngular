import { Component, OnInit } from '@angular/core';
import { Interactions } from '../models/interactions';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../models/post';


@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post: Post | undefined;
  comments: Interactions[] = [];
 
  interaction: Interactions = {
    id: '',
    commentaire: '',
    replay: [],
  };
  submitted = false;
  replies: Interactions[] = [];
  currentCommentId: string | null = null;
  replyText: string = '';
  showReplyInput: { [key: string]: boolean } = {};
  currentCommentReplies: Interactions[] = [];
  badWordsList = ['badword1', 'badword2', 'badword3'];
  constructor(private postService: PostService, private route: ActivatedRoute) { }




  ngOnInit(): void {
    this.getPostById();
    this.getCommentaires();
    // this.getRepliesForComment(this.currentCommentId!);


  }

  getPostPhotoUrl(photoName: any): string {
    // Assuming getPhotoUrl is a method in your PostService
    return this.postService.getPhoto(photoName);
  }

  getPostById(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPost(postId).subscribe(
        (post) => {
          this.post = post;
          this.getCommentaires();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  getCommentaires(): void {
    const postId = this.route.snapshot.paramMap.get('id');

    if (postId) {
      this.postService.getComment(postId).subscribe(
        (comments) => {
          this.comments = Array.isArray(comments) ? comments : [];

          console.log(this.comments);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  addInteraction(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    const confirm = window.confirm('Warning: The comment contains inappropriate language.') || window.close;
    if (postId) {
      // Check for bad words in the comment before proceeding
      if (this.containsBadWords(this.interaction.commentaire) && confirm) {
        return;

      }

     
      this.postService.addComment(postId, this.interaction).subscribe(
        (response) => {
          console.log('Interaction ajoutée avec succès', response);
          this.interaction.commentaire = '';
          this.getCommentaires();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'interaction', error);
        }
      );
    }
  }

  // New method to check for bad words in a comment
  containsBadWords(comment: string): boolean {
    const lowerCaseComment = comment.toLowerCase();
    return this.badWordsList.some(badWord => lowerCaseComment.includes(badWord));
  }

  toggleReplyInput(commentId: string): void {
    this.showReplyInput[commentId] = !this.showReplyInput[commentId];
    this.currentCommentId = this.showReplyInput[commentId] ? commentId : null;
  }

  getRepliesForComment(commentId: string): void {
    if (commentId) {
      this.postService.getReplies(commentId).subscribe(
        (replies) => {
          this.currentCommentReplies = Array.isArray(replies) ? replies : [];
          console.log("hedhy" + this.currentCommentReplies);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  // addReply(): void {
  //   const commentId = this.currentCommentId;
  //   if (commentId) {
  //     const reply: Interactions = {
  //       id: uuid.v4(),
  //       commentaire: this.replyText, // Set the text from the replyText property
  //     };

  //     this.blogService.addReply(commentId, reply).subscribe(
  //       (response) => {
  //         console.log('Réponse ajoutée avec succès', response);
  //         this.replyText = ''; // Clear the replyText
  //         this.getCommentaires();
  //         this.getRepliesForComment(commentId); // Update the list of replies for the parent comment
  //       },
  //       (error) => {
  //         console.error('Erreur lors de l\'ajout de la réponse', error);
  //       }
  //     );
  //   }
  // }
  addReply(commentId: string): void {
    if (commentId) {
      const reply: Interactions = {
        id: '',
        commentaire: this.replyText,
        replay: [],  // Ensure that each reply has its own array for potential nested replies
      };

      // Assuming your server-side logic correctly associates the reply with the selected comment
      this.postService.addReply(commentId, reply).subscribe(
        (response) => {
          console.log('Réponse ajoutée avec succès', response);
          this.replyText = '';
          this.getCommentaires();
          this.getRepliesForComment(commentId);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la réponse', error);
        }
      );
    }
  }
}




