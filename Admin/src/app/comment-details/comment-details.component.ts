import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from 'app/services/community.service';
import { UserService } from 'app/services/user.service';
import { Comment } from './../models/comments';

@Component({
  selector: 'app-comment-details',
  templateUrl: './comment-details.component.html',
  styleUrls: ['./comment-details.component.css']
})
export class CommentDetailsComponent implements OnInit {

  isResponseDone = false;
  comment: Comment;
  isViewDetials = false;
  commentID;
  constructor(
    private _userService: UserService,
    private _communityService: CommunityService,
    // private _flashMessagesService: FlashMessagesService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log(this._router.url)

    this._activatedRoute.params.subscribe(params => {
      this.commentID = params['id'];
      this.getComment();

    });


  }
  getComment() {
    this._communityService.showCommentDetails(`post/get-comment`, this.commentID).subscribe(
      (response) => {
        this.comment = response['Data'];
        console.log('comment deatials:', this.comment);
        if (this._router.url == `/dashboard/comment/${this.commentID}/details`) {
          this.isViewDetials = true;
        }
        this.isResponseDone = true;
      },
      (error) => {
        console.log(error)
        // let errorMessage = error['error'].Error;
        // this._flashMessagesService.show(errorMessage, {
        //   cssClass: 'alert alert-danger',
        //   timeout: 2000,
        // });
      }
    );
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    console.log("URL!!", imageUrl)
    if (imageUrl != '') {
      return this._sanitizer.bypassSecurityTrustUrl(
        `http://127.0.0.1:5000/${imageUrl}`
      );
    } else return '';
  }
  // cancleEditing() {
  //   let isCancled = confirm('Cancle Editing Operation ?');
  //   if (isCancled) {
  //     this._router.navigate([`/dashboard/comment/${this.commentID}`]);
  //   }
  // }
  clearForm(form: FormGroup) {
    form.reset();
  }



  updateComment(comment) {
    const formData = new FormData();
    formData.append('comment', comment);


    this._communityService
      .editPostDetails(`post/edit-comment/${this.commentID}`, formData)
      .subscribe(
        (response) => {

          console.log(response);
          this._router.navigate(['/dashboard/comments-table'])
          let successMessage = response['Message'];
          // this._flashMessagesService.show(successMessage, {
          //   cssClass: 'alert alert-success',
          //   timeout: 2000,
          // });
          //   setTimeout(() => {
          //     this._router.navigate([`/community/profile/${this.userID}`]);
          //   }, 2000);
          // },
        },
        (error) => {
          console.log(error);
          let errorMessage = error['error'].Error;
          // this._flashMessagesService.show(errorMessage, {
          //   cssClass: 'alert alert-danger',
          //   timeout: 2000,
          // });
        }
      );
  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }

}
