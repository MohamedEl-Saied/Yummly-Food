import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'app/services/community.service';
import { PostContent } from './../models/postContent';

@Component({
  selector: 'app-post-table',
  templateUrl: './post-table.component.html',
  styleUrls: ['./post-table.component.css']
})

export class PostTableComponent implements OnInit {
  posts: PostContent[] = [];
  beforSearch: PostContent[] = [];
  isResponsDone = false;
  constructor(private _communityService: CommunityService) { }

  ngOnInit() {
    // get all posts
    this._communityService.getAll('post/show').subscribe(
      response => {
        this.isResponsDone = true;
        this.posts = response["Data"]
        this.beforSearch = response["Data"]

        console.log(this.posts);

      })

  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  // delete post
  deletePost(postID, title, index) {
    let isConfirmed = confirm(`Are u sure that u want to delete ${title} ?`);
    if (isConfirmed) {
      this._communityService.delete(`post/delete/${postID}`)
        .subscribe(response => {
          console.log(response);
          this.posts.splice(index, 1)
          this.beforSearch.splice(index, 1);
        }, error => {
          console.log(error)
        }

        )
    }
  }
  search(event) {

    if (event.target.value.length == 0) {
      return this.posts = this.beforSearch;

    }
    else {
      this.posts = this.posts.filter((post, index) => {
        if ((post.author['username'].includes(event.target.value)) || (post.title.includes(event.target.value))) {
          return this.posts[index];
        }

      })
    }


  }
}
