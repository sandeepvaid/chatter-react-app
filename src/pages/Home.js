import styles from '../styles/home.module.css';
import PropTypes from 'prop-types';
import { format, parse } from "date-fns";
import {Comment} from '../components/index';
import {useEffect, useState } from 'react';
import { getPosts } from "../api";
import { Link } from 'react-router-dom';
const Home = () => {
    const [posts,setPosts] = useState([]);
    // const 
    useEffect(() => {
      const fetchPosts = async () => {
        const response = await getPosts();
        if (response.success) {
          setPosts(response.data.posts);
         
        }
       
      };
      fetchPosts();
    }, []);

  return (
    <div className={styles.postsList}>
      {posts.map((post) => (
        <div className={styles.postWrapper} key={`post-${post._id}`}>
          <div className={styles.postHeader}>
            <div className={styles.postAvatar}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="user-pic"
              />
              <div>
                <Link
                  to={`/user/${post.user._id}`}
                  className={styles.postAuthor}
                >
                  {post.user.name}
                </Link>
                <span className={styles.postTime}>
                  {format(new Date(post.createdAt), "MM/dd/yyyy")}
                </span>
              </div>
            </div>
            <div className={styles.postContent}>{post.content}</div>

            <div className={styles.postActions}>
              <div className={styles.postLike}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/126/126473.png"
                  alt="likes-icon"
                />
                <span>{post.likes.length}</span>
              </div>

              <div className={styles.postCommentsIcon}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1450/1450338.png"
                  alt="comments-icon"
                />
                <span></span>
              </div>
            </div>
            <div className={styles.postCommentBox}>
              <input placeholder="Start typing a comment" />
            </div>

            <div className={styles.postCommentsList}>
              {post.comments.map((comment) => {
                return <Comment key={comment._id} comment={comment} />;
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

//THis is  nothing but a type checkign we are doing means now our post is an array but if some send posts props as string then our component crashes . To avoid this we use propsType or we can use type script language to check the type. Flow is another option to do type checking.
// Home.propTypes = {
//   posts:PropTypes.array.isRequired,
// } 

export default Home;
