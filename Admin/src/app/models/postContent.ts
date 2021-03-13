export class PostContent {
  title: string;
  content: string;
  author: string;
  imageURL: string;
  comments: [{ comment: string; author: object }];
  createdAt: Date;
}
