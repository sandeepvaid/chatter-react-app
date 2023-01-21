import { usePost } from "../hooks";
import styles from "../styles/home.module.css";
import { format } from "date-fns";
import { useState } from "react";
import { addComment, addLike } from "../api";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
const Post = ({ post }) => {
  const posts = usePost();
  const [comment, setComment] = useState("");
  const { addToast } = useToasts();
  const handleAddComment = async (event, postId) => {
    if (event.key == "Enter") {
      setComment("");
      const response = await addComment(postId, comment);
      if (response.success) {
        posts.updateComment(response.data.comment, postId);
        addToast("Comment added successfully..", {
          appearance: "success",
        });
      } else {
        addToast(response.message, {
          appearance: "error",
        });
      }
    }
  };

  const handlelike = async () => {
    const response = await addLike("Post", post._id);
    console.log(response, "LIke respo");
    if (response.success) {
      posts.updatePostLike(post._id);
      if (response.data.deleted) {
        addToast("Post Like removed successfully..", {
          appearance: "error",
        });
      } else {
        addToast("Post Like added successfully..", {
          appearance: "success",
        });
      }
    }
  };

  return (
    <div className={styles.postWrapper} key={`post-${post._id}`}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="user-pic"
          />
          <div>
            <Link to={`/user/${post.user._id}`} className={styles.postAuthor}>
              {post.user.name}
            </Link>
            <span className={styles.postTime}>
              {format(new Date(post.createdAt), "MM/dd/yyyy")}
            </span>
          </div>
        </div>
        <div className={styles.postContent}>{post.content}</div>

        <div className={styles.postActions}>
          <button
            style={{ border: "none", borderRadius: "20%" }}
            onClick={handlelike}
          >
            <div className={styles.postLike}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/126/126473.png"
                alt="likes-icon"
              />
              <span>{post.likes.length}</span>
            </div>
          </button>
          <div className={styles.postCommentsIcon}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1450/1450338.png"
              alt="comments-icon"
            />
            <span></span>
          </div>
        </div>
        <div className={styles.postCommentBox}>
          <input
            onKeyDown={(e) => handleAddComment(e, post._id)}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
            placeholder="Start typing a comment"
          />
        </div>

        <div className={styles.postCommentsList}>
          {post.comments.map((comment) => {
            return (
              <Comment key={comment._id} comment={comment} postId={post._id} />
            );
          })}
        </div>
      </div>
    </div>
  );
};
Post.propTypes = {
  post: PropTypes.object.isRequired,
};
export default Post;
