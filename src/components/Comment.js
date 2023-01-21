import { format, parse } from "date-fns";
import styles from "../styles/home.module.css";
import { addLike } from "../api";
import { useToasts } from "react-toast-notifications";
import { usePost } from "../hooks";
const Comment = ({ comment, postId }) => {
  const posts = usePost();
  const { addToast } = useToasts();
  const handlelike = async () => {
    const response = await addLike("Comment", comment._id);
    if (response.success) {
      posts.updateCommentLike(postId, comment._id);
      if (response.data.deleted) {
        addToast("Comment Like removed successfully..", {
          appearance: "error",
        });
      } else {
        addToast("Comment Like added successfully..", {
          appearance: "success",
        });
      }
    }
  };
  return (
    <div className={styles.postCommentsItem}>
      <div className={styles.postCommentHeader}>
        <span className={styles.postCommentAuthor}>{comment.user.name}</span>
        <span className={styles.postCommentTime}>
          {format(new Date(comment.createdAt), "MM/dd/yyyy")}
        </span>

        <div className={styles.postActions}>
          <div
            className={styles.postLike}
            onClick={handlelike}
            style={{ backgroundColor: "whitesmoke" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/126/126473.png"
              alt="likes-icon"
            />
            <span>{comment.likes.length}</span>
          </div>
        </div>
      </div>
      <div className={styles.postCommentContent}>{comment.content}</div>
    </div>
  );
};

export default Comment;


