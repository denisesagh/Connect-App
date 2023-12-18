import {CommentI} from "./Comment";

export interface Post{
  postID: string;
  userID: string;
  username: string | undefined;
  contentText: string;
  contentImage: string;
  postDate: number;
  formattedPostDate?: string;
  likes?: string[];
  comments?: CommentI[];
  haveILiked?: boolean;
  likeCount?: number;
}
