import { format, parse } from "date-fns";
import styles from "../styles/home.module.css";
const Comment = ({ comment }) => {
  return (
    <div className={styles.postCommentsItem}>
      <div className={styles.postCommentHeader}>
        <span className={styles.postCommentAuthor}>{comment.user.name}</span>
        <span className={styles.postCommentTime}>
          {format(new Date(comment.createdAt), "MM/dd/yyyy")}
        </span>
        <span className={styles.postCommentLikes}>{comment.likes.length}</span>
      </div>
      <div className={styles.postCommentContent}>{comment.content}</div>
    </div>
  );
};

export default Comment;
