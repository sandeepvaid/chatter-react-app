import {useContext, useEffect, useState } from "react"
import {
  updateProfile,
  getUserFriends,
  register,
  login as userLogin,
  getPosts,
  getLikes,
} from "../api";
import { AuthContext, PostContext } from "../providers";
import { getItemFromLocalStorage, LOCALSTORAGE_TOKEN_KEY } from "../utils";
import { setItemInLocalStorage, removeItemFromLocalStorage } from "../utils";
import jwt from "jwt-decode";

export const useAuth = () => {
  return useContext(AuthContext);
};
export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
      if (userToken) {
        const user = jwt(userToken);
      }

      if (userToken) {
        const response = await getUserFriends();
        let friends = [];
        if (response.success) {
          friends = response.data.friends;
        }
        setUser({
          ...user,
          friends,
        });
      }

      setLoading(false);
    };
    getUser();
  }, []);

  const updateUserFriend = (addFriend, friend) => {
    if (addFriend) {
      setUser({
        ...user,
        friends: [...user.friends, friend],
      });
    } else {
      const newFriends = user.friends.filter(
        (f) => f.to_user._id != friend.to_user._id
      );
      setUser({
        ...user,
        friends: newFriends,
      });
    }
  };

  const login = async (email, password) => {
    const response = await userLogin(email, password);
    console.log("hooks", response);
    if (response.success) {
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      setUser(response.data.user);
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const logout = () => {
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };

  const updateUser = async (email, name, password, confirmPassword) => {
    const response = await updateProfile(
      name,
      email,
      password,
      confirmPassword
    );
    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const signup = async (name, email, password, confirmpassword) => {
    const response = await register(name, email, password, confirmpassword);
    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    signup,
    updateUser,
    updateUserFriend,
  };
};

export const usePost = () => {
  return useContext(PostContext);
};

export const useProvidePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();
      if (response.success) {
        setPosts(response.data.posts);
        console.log("post", response.data.posts);
      }

      setLoading(false);
    };
    fetchPosts();
  }, []);

  const updatePost = (post) => {
    setPosts([post, ...posts]);
  };

  const updateComment = (comment, postId) => {
    let newPost = [];
    newPost = posts.map((post) => {
      if (post._id === postId) {
        return { ...post, comments: [comment, ...post.comments] };
      }
      return post;
    });
    setPosts(newPost);
  };

  const updatePostLike = async (likeId) => {
    let updatedLike = [];
    let newPosts = [];
    const response = await getLikes("Post", likeId);
    updatedLike = response.data.map((like) => {
      return like._id;
    });
    newPosts = posts.map((post) => {
      if (post._id === likeId) {
        return { ...post, likes: [...updatedLike] };
      }
      return post;
    });

    setPosts(newPosts);
  };

  const updateCommentLike = async (postId, likeId) => {
    console.log(postId, likeId);
    let updatedCommentLikes = [];
    let newPosts = [];
    const response = await getLikes("Comment", likeId);
    updatedCommentLikes = response.data.map((like) => {
      return like._id;
    });
    console.log("updatedCommentLikes", updatedCommentLikes);
    newPosts = posts.map((post) => {
      if (post._id == postId) {
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment._id == likeId) {
              return { ...comment, likes: updatedCommentLikes };
            }
            return comment;
          }),
        };
      }
      return post;
    });
    console.log("newpostcomment", newPosts);
    setPosts(newPosts);
  };

  return {
    data: posts,
    loading,
    updatePost,
    updateComment,
    updatePostLike,
    updateCommentLike,
  };
};