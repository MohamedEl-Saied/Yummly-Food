import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { PostContent } from 'src/app/models/postContent';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  postContent = new PostContent();
  userID = this._userService.getUserID();
  postID;
  form: FormGroup;
  constructor(
    private _communityService: CommunityService,
    private _userService: UserService,
    private route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe((params: Params) => {
      this.postID = params['id'];
      console.log(this.postID);
      this._communityService
        .showPostDetails('post/show', this.postID)
        .subscribe(
          (response) => {
            this.spinner.hide();
            if (response['Data'].author != this.userID) {
              this._router.navigate(['/community/show-posts']);
            }
            console.log(response);
            this.postContent = response['Data'];
            console.log(this.postContent);
          },
          (error) => {
            this._router.navigate(['/community/show-posts']);
          }
        );
    });
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

          this._router.navigate(['/community/show-posts']);
        },
        (error) => {
          console.log(error);
          this._router.navigate([`/community/edit-post/${this.postID}`]);
        }
      );
  }
}