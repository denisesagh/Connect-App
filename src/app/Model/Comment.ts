export interface CommentI{
  commentID: string;
  userID: string;
  username: string | undefined;
  commentText: string;
  postDate: number;
  formatedPostDate?: string;
}
