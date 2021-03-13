import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from 'app/services/community.service';
import { UserService } from 'app/services/user.service';
import { PostContent } from './../models/postContent';
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  isResponseDone = false;
  post: PostContent;
  isViewDetials = false;
  postID;
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
      this.postID = params['id'];

      this.getPost();

    });


  }
  getPost() {
    this._communityService.showPostDetails(`post/show`, this.postID).subscribe(
      (response) => {
        this.post = response['Data'];
        console.log('post:', this.post);
        if (this._router.url == `/dashboard/post/${this.postID}/details`) {
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
    if (imageUrl != '') {
      return this._sanitizer.bypassSecurityTrustUrl(
        `http://127.0.0.1:5000/${imageUrl}`
      );
    } else return '';
  }
  cancleEditing() {
    let isCancled = confirm('Cancle Editing Operation ?');
    if (isCancled) {
      this._router.navigate([`/community/profile/${this.postID}`]);
    }
  }
  clearForm(form: FormGroup) {
    form.reset();
  }
  slectedFile: File = null;
  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      this.slectedFile = <File>event.target.files[0];
      console.log(this.slectedFile);
    }
  }

  updatePost(title, content) {
    const formData = new FormData();
    if (this.slectedFile != null) {
      formData.append('image', this.slectedFile, this.slectedFile.name);
    }
    formData.append('title', title);
    formData.append('content', content);
    console.log("data", formData);
    this._communityService
      .editPostDetails(`post/edit/${this.postID}`, formData)
      .subscribe(
        (response) => {

          console.log(response);
          this._router.navigate(['/dashboard/posts-table'])
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
