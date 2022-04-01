import { useAuth } from "../hooks";
import { useLocation } from "react-router-dom";
import styles from "../styles/settings.module.css";
const UserProfile = () => {
  const auth = useAuth();
  const location = useLocation();
  console.log("location", location);

  const { user = {} } = location.state;

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="dp"
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
        <button className={`button ${styles.saveBtn}`}>Add Friend </button>
        <button className={`button ${styles.saveBtn}`}>Remove Friend </button>
      </div>
    </div>
  );
};

export default UserProfile;
