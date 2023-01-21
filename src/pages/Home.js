import styles from '../styles/home.module.css';
import { Post, FriendsList, CreatePost, Loader } from "../components/index";
import { useAuth, usePost } from "../hooks";
import { useToasts } from "react-toast-notifications";
const Home = () => {
  const auth = useAuth();
  const posts = usePost();
  const { addToast } = useToasts();
  if (posts.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        <CreatePost />
        {posts.data.map((post) => (
          <Post post={post} key={`post-${post._id}`} />
        ))}
      </div>

      {auth.user && <FriendsList />}
    </div>
  );
};

//THis is  nothing but a type checkign we are doing means now our post is an array but if some send posts props as string then our component crashes . To avoid this we use propsType or we can use type script language to check the type. Flow is another option to do type checking.
// Home.propTypes = {
//   posts:PropTypes.array.isRequired,
// } 

export default Home;
