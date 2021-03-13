import { PostContent } from './postContent';

export class User {
  username: String;
  email: String;
  password: String;
  imageURL: String;
  confirmedPassword: String;
  posts: [String];
  comments: [String];
  favoritePosts: [PostContent];
  favoriteRecipes: [String];
  isBlocked: boolean;
  likedPosts: [object];
}
