import { createContext } from "react";
import { useProvidePost } from "../hooks";
const initialState = {
  posts: [],
  updatePost: () => {},
  updateComment: () => {},
  updatePostLike: () => {},
  updateCommentLike: () => {},
};
export const PostContext = createContext(initialState);

export const PostProvider = ({ children }) => {
  const posts = useProvidePost();
  return <PostContext.Provider value={posts}>{children}</PostContext.Provider>;
};
