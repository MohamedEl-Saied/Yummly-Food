import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { PostContent } from 'src/app/models/postContent';
import { CommunityService } from 'src/app/services/community.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from './../../../models/user';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userID = this._userService.getUserID();
  user: User;
  form: FormGroup;
  isEditClicked = false;
  changeValueToCurrentIndex = null;
  isEditComment = false;
  postContent = new PostContent();
  postID;
  searchParam;
  posts = [];
  indexID;
  showFooter = false;
  constructor(
    private _communityService: CommunityService,
    private _userService: UserService,
    private _router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private _flashMessagesService: FlashMessagesService,
    private spinner: NgxSpinnerService
  ) { }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (imageUrl != '') {
      return this.sanitizer.bypassSecurityTrustUrl(
        `http://127.0.0.1:5000/${imageUrl}`
      );
    } else return '';
  }
  ngOnInit(): void {
    this.getUser();
    this.createForm();
  }
  testUser;

  getUser() {
    this.spinner.show();
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.searchParam = params['id'];
      console.log(this.userID);
      let userId = this.userID;
      this._communityService
        .getUser(`user/get-user/${this.searchParam}`)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.user = response['Data'];
            this.testUser = response['ModifedData'];

            this.posts = response['Data'].posts;
            this.showFooter = true;
            console.log('user:', this.user);
          },
          (error) => {
            let errorMessage = error['error'].Error;
            this._flashMessagesService.show(errorMessage, {
              cssClass: 'alert alert-danger',
              timeout: 2000,
            });
          }
        );
    });
  }

  createForm() {
    this.form = this._formBuilder.group({
      Title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255),
        ],
      ],
      Content: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1024),
        ],
      ],
    });
  }
  slectedFile: File = null;
  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      this.slectedFile = <File>event.target.files[0];
    }
  }
  deletePost(postID, index) {
    if (confirm('Are you sure to delete ')) {
      this.spinner.show();
      this._communityService.deletePost('post/delete', postID).subscribe(
        (response) => {
          this.spinner.hide();
          this.posts.splice(index, 1);
          this.user.posts.filter((post, i) => {
            if (postID == post['_id']) {
              this.user.posts.splice(i, 1);
            }
          });
          let successMessage = response['Message'];

          this._flashMessagesService.show(successMessage, {
            cssClass: 'alert alert-success',
            timeout: 2000,
          });
        },
        (error) => {
          let errorMessage = error['error'].Error;
          this._flashMessagesService.show(errorMessage, {
            cssClass: 'alert alert-danger',
            timeout: 2000,
          });
        }
      );
    }
    else {
      this.spinner.hide();

    }
  }
  editPost(title, content) {
    this.spinner.show();
    this.postContent.title = title;
    this.postContent.content = content;
    this._communityService
      .editPostDetails(`post/edit/${this.postID}`, this.postContent)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          this.posts.filter((oldPosts, i) => {
            if (oldPosts['_id'] == this.postID) {
              console.log(this.posts[i]);
              return (this.posts[i] = response['Data']);
            }
          });
          let successMessage = response['Message'];
          this._flashMessagesService.show(successMessage, {
            cssClass: 'alert alert-success',
            timeout: 2000,
          });
        },
        (error) => {
          let errorMessage = error['error'].Error;
          this._flashMessagesService.show(errorMessage, {
            cssClass: 'alert alert-danger',
            timeout: 2000,
          });
        }
      );
  }
  addComment(comment, postID, index) {
    this.spinner.show();
    if (this.isEditComment == true) {
      return this._communityService
        .editComment(`post/${postID}/edit-comment/${this.commentid}`, {
          comment,
        })
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.isEditComment = false;
            // this.posts[index]["comments"].push(comment);
            // console.log("This Posts from 61 :", this.posts[index]["comments"]);
            this.posts[index]['comments'].filter((oldComment, i) => {
              if (oldComment._id == this.commentid) {
                console.log(this.posts[index]['comments'][i]);
                return (this.posts[index]['comments'][i] = response['Data']);
              }
            });
            console.log(response);

            let successMessage = response['Message'];
            this._flashMessagesService.show(successMessage, {
              cssClass: 'alert alert-success',
              timeout: 2000,
            });
          },
          (error) => {
            let errorMessage = error['error'].Error;
            this._flashMessagesService.show(errorMessage, {
              cssClass: 'alert alert-danger',
              timeout: 2000,
            });
          }
        );
    }
    this._communityService
      .createComment(`post/${postID}/create-comment`, { comment })
      .subscribe(
        (response) => {
          this.spinner.hide()
          console.log('from 71', response);
          this.posts[index]['comments'].unshift(response['Data']);
          this.user.comments.push(response['Data']);
          this.spinner.hide();
          // this.posts[index]["comments"][this.commentIndex].author =  ;
          let successMessage = response['Message'];
          this._flashMessagesService.show(successMessage, {
            cssClass: 'alert alert-success',
            timeout: 2000,
          });
        },
        (error) => {
          let errorMessage = error['error'].Error;
          this._flashMessagesService.show(errorMessage, {
            cssClass: 'alert alert-danger',
            timeout: 2000,
          });
        }
      );
  }
  commentIndex;
  deleteComment(postID, commentID, currentPosttIndex, currentCommentIndex) {
    if (confirm('Are you sure to delete ')) {
      this.spinner.show();

      this.commentIndex = currentCommentIndex;
      this._communityService
        .deleteComment(`post/${postID}/delete-comment/${commentID}`)
        .subscribe(
          (response) => {
            this.spinner.hide();
            console.log('This Posts from 86 :', this.posts);
            console.log(response);
            this.posts[currentPosttIndex]['comments'].splice(
              currentCommentIndex,
              1
            );
            for (let [index, comment] of this.user.comments.entries()) {
              if (comment['_id'] == commentID)
                this.user.comments.splice(index, 1);
            }

            let successMessage = response['Message'];
            this._flashMessagesService.show(successMessage, {
              cssClass: 'alert alert-success',
              timeout: 2000,
            });
          },
          (error) => {
            let errorMessage = error['error'].Error;
            this._flashMessagesService.show(errorMessage, {
              cssClass: 'alert alert-danger',
              timeout: 2000,
            });
          }
        );
    }
    else {
      this.spinner.hide();

    }

  }
  commentid = '';
  commentValue = '';
  getCommentValue(value) {
    this.isEditComment = true;
    this.commentValue = value.comment;
    this.commentid = value._id;
  }

  setCurrentIndexValue(index) {
    if (this.changeValueToCurrentIndex != index) {
      this.changeValueToCurrentIndex = index;
    } else {
      this.changeValueToCurrentIndex = null;
    }
  }
  editButtonClicked(postID, index) {
    this.spinner.show();
    this.postID = postID;
    this.indexID = index;
    this._communityService.showPostDetails('post/show', this.postID).subscribe(
      (response) => {
        this.spinner.hide();
        console.log(response);
        this.postContent = response['Data'];
        console.log(this.postContent);
        let successMessage = response['Message'];
        this._flashMessagesService.show(successMessage, {
          cssClass: 'alert alert-success',
          timeout: 2000,
        });
      },
      (error) => {
        let errorMessage = error['error'].Error;
        this._flashMessagesService.show(errorMessage, {
          cssClass: 'alert alert-danger',
          timeout: 2000,
        });
      }
    );
    this.isEditClicked = true;
  }
  editCommentClicked() {
    this.isEditComment = true;
  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  isDark;
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    console.log(theme);
    console.log(this.isDark);
    if (theme == 'Dark') {
      this.isDark = true;
      console.log(this.isDark);
    } else {
      this.isDark = false;
    }
  }
  isUserLikedPost;

  likeOrUnlikePost(postID, index) {
    console.log("include?", this.user.likedPosts.includes(postID));
    if (this.user.likedPosts.includes(postID) == true) {
      this.isUserLikedPost = false;
    }
    else {
      this.isUserLikedPost = true;
    }
    // let like = this.posts[index]['likes'];
    console.log("like,", this.isUserLikedPost)
    this.spinner.show()
    this._communityService.likeOrUnlikePost(`post/like/${postID}`, this.isUserLikedPost).subscribe(response => {
      this.spinner.hide()
      console.log(this.posts[index]['likes']);
      this.posts[index]['likes'] = response['Data']['foundPost'].likes;
      console.log("likedPosts:", response['Data']['user'].likedPosts);
      this.user.likedPosts = response['Data']['user'].likedPosts;
      // this.isUserLikedPost = !this.isUserLikedPost;
      // this.user = response['Data']['user'];
      console.log(response);
    }), error => {
      console.log(error)
    }
  }
}
