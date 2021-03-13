import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'app/services/community.service';
import { Comment } from './../models/comments';

@Component({
  selector: 'app-comment-table',
  templateUrl: './comment-table.component.html',
  styleUrls: ['./comment-table.component.css']
})
export class CommentTableComponent implements OnInit {

  comments: Comment[] = [];
  isResponsDone = false;
  beforSearch: Comment[] = [];
  constructor(private _communityService: CommunityService) { }

  ngOnInit() {
    // get all comments
    this._communityService.getAll('post/get-comments').subscribe(
      response => {
        this.isResponsDone = true;
        this.comments = response["Data"]
        this.beforSearch = response["Data"];
        console.log(this.comments);

      })

  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  //delete comment
  deleteComment(commentID, comment, index) {
    let isConfirmed = confirm(`Are u sure that u want to delete ${comment} ?`);
    if (isConfirmed) {
      this._communityService.delete(`post/delete-comment/${commentID}`)
        .subscribe(response => {
          console.log(response);
          this.comments.splice(index, 1)
          this.beforSearch.splice(index, 1);

        }, error => {
          console.log(error)
        }

        )
    }
  }
  search(event) {

    if (event.target.value.length == 0) {
      return this.comments = this.beforSearch;

    }
    else {
      this.comments = this.comments.filter((comment, index) => {
        if ((comment.comment.includes(event.target.value)) || (comment.author['username'].includes(event.target.value))) {
          return this.comments[index];
        }

      })
    }


  }

}
