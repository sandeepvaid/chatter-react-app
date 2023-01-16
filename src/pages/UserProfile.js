import styles from "../styles/settings.module.css";
import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { fetchUserProfile, createFriendship, removeFriendship } from "../api";
import { useToasts } from "react-toast-notifications";
import { Loader } from "../components";

const UserProfile = () => {
    const [user,setUser]= useState({});
    const [loading,setLoading] = useState(true);
    const [inProgess,setInProgess] = useState(false);
    const {addToast} = useToasts();
    const auth = useAuth();
    const {userId} = useParams();

    useEffect(()=>{
        const getUserInfo=async ()=>{
            const response = await fetchUserProfile(userId);
            console.log("res",response)
            if(response.success) {
                console.log("User info",response);
                setUser(response.data.user)
            }else{
                addToast(response.message, {
                appearance: "error",
                });
                return Navigate("/");
            }
            setLoading(false);
        }
        getUserInfo();
    },[])

const checkIfUserIsFriend=()=>{
    const friends = auth.user.friends;
    const friendIds = friends.map((friend) => friend.to_user._id);
    const index = friendIds.indexOf(userId);
    if(index !=-1){
        return true;
    }
    return false;
}
const addFriend =async ()=>{
  setInProgess(true);
  const response = await createFriendship(userId);
  
  if(response.success){
    console.log("success",response);
    const {friendship} = response.data;
    auth.updateUserFriend(true,friendship);
    addToast("Friend added successfully", {
      appearance: "success",
    });
  }else{
    addToast(response.message, {
      appearance: "error",
    });
   
  }
  setInProgess(false);
}

const removeFriend = async () =>{
  
  setInProgess(true);
  const response = await removeFriendship(userId);
  if(response.success){
    const friendship = auth.user.friends.filter(
      (friend) => friend.to_user._id === userId
    );
    console.log(friendship);
    auth.updateUserFriend(false,friendship[0]);
    addToast("Friend removed successfully", {
      appearance: "success",
    });
  }else{
    addToast(response.message, {
      appearance: "error",
    });
  }
  setInProgess(false)
}

if(loading){
    return (
        <Loader/>
    )
}

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
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
        {checkIfUserIsFriend() ? (
          <button className={`button ${styles.saveBtn}`} onClick={removeFriend}>
            {inProgess ? "Removing Friend" : "Remove Friend"}
          </button>
        ) : (
          <button className={`button ${styles.saveBtn}`} onClick={addFriend}>
            {inProgess ? "Adding Friend" : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
