import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { PostContent } from 'src/app/models/postContent';
import { CommunityService } from 'src/app/services/community.service';
import { Posts } from '../../../models/posts';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from './../../../models/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';

declare const popup: Function;

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.scss'],
})
export class ShowPostsComponent implements OnInit {
  form: FormGroup;
  isEditClicked = false;
  isCreateClicked = false;
  changeValueToCurrentIndex = null;
  isEditComment = false;
  postID;
  indexID;
  isDark = false;
  links;
  text = '';
  showFooter = false;
  isUserLikedPost;
  constructor(
    private _communityService: CommunityService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private _flashMessagesService: FlashMessagesService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) { }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (imageUrl != '') {
      return this.sanitizer.bypassSecurityTrustUrl(
        `http://127.0.0.1:5000/${imageUrl}`
      );
    } else return '';
  }

  posts: Posts[] = [];
  postContent = new PostContent();
  userID = this._userService.getUserID();
  user: User;
  ngOnInit(): void {
    this.spinner.show();
    this.getUser();
    this._communityService.getAllPosts('post/show').subscribe(
      (response) => {
        this.spinner.hide();

        this.posts = response['Data'];

        console.log('After habding', this.posts);
      },
      (error) => {
        console.log(error);
      }
    );
    this.createForm();
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
  createPost(title: string, content: string) {
    // this.postContent.title = title;
    // this.postContent.content = content;
    // this.postContent.imageURL = imageURL;
    this.spinner.show();
    const formData = new FormData();
    if (this.slectedFile != null) {
      formData.append('image', this.slectedFile, this.slectedFile.name);
    }
    formData.append('title', title);
    formData.append('content', content);
    // this.postContent.imageURL = formData;
    // console.log(this.postContent.imageURL);
    this._communityService.createPost('post/create', formData).subscribe(
      (response) => {
        this.spinner.hide();
        console.log('posts', response['Data']);
        this.user.posts.push(response['Data']);
        this.posts.unshift(response['Data']);
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
    this.isCreateClicked = false;
  }

  deletePost(postID, index) {
    this.spinner.show();
    if (confirm('Are you sure to delete ') == true) {
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
          this.spinner.hide();

          this.posts[index]['comments'].unshift(response['Data']);
          this.user.comments.push(response['Data']);
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
    this.spinner.show();
    if (confirm('Are you sure to delete ')) {
      this.commentIndex = currentCommentIndex;
      this._communityService
        .deleteComment(`post/${postID}/delete-comment/${commentID}`)
        .subscribe(
          (response) => {
            this.spinner.hide();
            console.log('This Posts from 86 :', this.posts);
            console.log(response);
            console.log("user comments,", this.user);
            this.posts[currentPosttIndex]['comments'].splice(
              currentCommentIndex, 1);
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
  btnClicked() {
    this.isCreateClicked = true;
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
  addNewPost() {
    // create here
    alert('Welcome from add !');
  }
  testUser;
  getUser() {
    this.spinner.show();
    console.log(this.userID);
    let userId = this.userID;
    this._communityService.getUser(`user/get-user/${userId}`).subscribe(
      (response) => {
        // console.log('This Posts from 86 :', this.postContent);
        this.user = response['Data'];

        this.testUser = response['ModifedData'];
        // this.checkFavAndLikes();

        this.spinner.hide();
        this.showFooter = true;
        console.log('user:', this.user);
        // console.log('The fav', this.user.favoritePosts.includes(this.posts[0]));


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
  // checkFavAndLikes() {
  //   // this.user.favoritePosts.filter((favPost) => {
  //   //   this.posts.filter((post, i) => {
  //   //     if (favPost['_id'].toString() == post['_id'].toString()) {
  //   //       this.posts[i]['isFav'] = true;
  //   //     } else {
  //   //       this.posts[i]['isFav'] = false;
  //   //     }
  //   //   });
  //   // });


  //   // this.user.likedPosts.filter((likedPost) => {
  //   //   this.posts.filter((post, i) => {
  //   //     if (likedPost.toString() == post['_id'].toString()) {
  //   //       console.log("from liked posts", likedPost.toString())
  //   //       this.posts[i]['isLiked'] = true;
  //   //     } else {
  //   //       this.posts[i]['isLiked'] = false;
  //   //     }
  //   //   })
  //   // });
  //   console.log("388", this.posts)
  // }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  searchSubmitted(searchUser: string) {
    console.log(searchUser);
    console.log('Entered');
    this.router.navigate([`community/search-results/${searchUser}`]);
  }
  favoritePosts;
  addFavorite(postID) {
    this.spinner.show();
    this._communityService
      .addToFavorite(`post/add-to-favorite/${postID}`)
      .subscribe(
        (response) => {
          this.spinner.hide();
          // console.log('This Posts from 86 :', this.postContent);
          this.favoritePosts = response['Data'];
          this.testUser.favoritePosts = response['Data'];
          console.log(this.favoritePosts);
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
  removeFavorite(postID) {
    this.spinner.show();
    this._communityService
      .removeFromFavorite(`post/remove-from-favorite/${postID}`)
      .subscribe(
        (response) => {
          this.spinner.hide();
          // console.log('This Posts from 86 :', this.postContent);
          this.favoritePosts = response['Data'];
          this.testUser.favoritePosts = response['Data'];
          console.log(this.favoritePosts);
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
  refresh() {
    this.ngOnInit();
  }
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    if (theme == 'Dark') {
      this.isDark = true;
    } else {
      this.isDark = false;
    }
  }

  // ngAfterContentChecked() {

  // }
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
