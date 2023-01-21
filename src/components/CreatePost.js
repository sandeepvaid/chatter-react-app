import { useState } from "react";
import styles from "../styles/home.module.css";
import { addPost } from "../api";
import { useToasts } from "react-toast-notifications";
import { usePost } from "../hooks";
const CreatePost = () => {
  const [post, setPost] = useState("");
  const [addingPost, setAddingPost] = useState(false);
  const { addToast } = useToasts();
  const posts = usePost();
  const handleAddPostClick = async () => {
    const response = await addPost(post);
    setAddingPost(true);
    if (response.success) {
      setPost("");
      posts.updatePost(response.data.post);
      addToast("Thought is shared successfully...", {
        appearance: "success",
      });
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }
    setAddingPost(false);
    console.log("Create post component ", response);
  };

  return (
    <div className={styles.createPost}>
      <textarea
        placeholder="Share your thoughts..."
        className={styles.addPost}
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <div>
        <button
          className={styles.addPostBtn}
          onClick={handleAddPostClick}
          disabled={addingPost}
        >
          {addingPost ? "Adding post..." : "Add post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
