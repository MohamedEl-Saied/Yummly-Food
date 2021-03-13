export class PostContent {
  _id: string;
  title: string;
  content: string;
  author: string;
  imageURL: string;
  comments: [{ comment: string; author: object }];
  createdAt: Date;
  likes: { users: [object], like: number };
}
