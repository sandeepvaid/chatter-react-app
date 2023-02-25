import { useParams, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { Loader } from "../components";
import styles from "../styles/settings.module.css";
import { useAuth } from "../hooks";
import { useEffect, useState } from "react";
import { addFriend, fetchUserProfile, breakUp } from "../api";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const { userId } = useParams();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserProfile(userId);

      if (response.success) {
        setUser(response.data.user);
      } else {
        addToast(response.message, {
          appearance: "error",
        });
        return navigate("/");
      }

      setLoading(false);
    };

    getUser();
  }, [userId, navigate, addToast]);

  if (loading) {
    return <Loader />;
  }

  const checkIfUserIsAFriend = () => {
    const friends = auth.user.friends;

    const friendIds = friends.map((friend) => friend.to_user._id);
    const index = friendIds.indexOf(userId);

    if (index !== -1) {
      return true;
    }

    return false;
  };

  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);

    const response = await breakUp(userId);
    console.log("response", response);
    if (response.success) {
      const friendship = auth.user.friends.filter(
        (friend) => friend.to_user._id === userId
      );
      console.log("frndship", friendship);

      auth.updateUserFriends(false, friendship[0]);
      addToast("Friend removed successfully", {
        appearance: "success",
      });
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }

    setRequestInProgress(false);
  };

  const handleAddFriendClick = async () => {
    setRequestInProgress(true);

    const response = await addFriend(userId);
    console.log("response", response);
    if (response.success) {
      const { friendship } = response.data;
      console.log("frndship", friendship);

      auth.updateUserFriends(true, friendship);
      addToast("Friend added successfully", {
        appearance: "success",
      });
    } else {
      addToast(response.message, {
        appearance: "error",
      });
    }

    setRequestInProgress(false);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>

        <div className={styles.fieldValue}>{user.name}</div>
      </div>

      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleRemoveFriendClick}
          >
            {requestInProgress ? "Removing Friend" : "Remove Friend"}
          </button>
        ) : (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleAddFriendClick}
          >
            {requestInProgress ? "Adding Friend" : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
