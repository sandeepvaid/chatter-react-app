import { Link } from "react-router-dom";

import styles from "../styles/home.module.css";
import { useAuth } from "../hooks";

const FriendsList = () => {
  const auth = useAuth();
  const { friends = [] } = auth.user;
  console.log(friends);
  return (
    <div className={styles.friendsList}>
      <div className={styles.header}>Friends</div>

      {friends && friends.length === 0 && (
        <div className={styles.noFriends}>No friends found!</div>
      )}

      {friends &&
        friends.map((friend) => (
          <div key={`friend-${friend.to_user._id}`}>
            <Link
              className={styles.friendsItem}
              to={`/user/${friend.to_user._id}`}
            >
              <div className={styles.friendsImg}>
                <img
                  src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
                  alt=""
                />
              </div>
              <div className={styles.friendsName}>{friend.to_user.name}</div>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default FriendsList;
