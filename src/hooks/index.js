import {useContext, useEffect, useState } from "react"
import {
  updateProfile,
  getUserFriends,
  register,
  login as userLogin,
} from "../api";
import { AuthContext } from "../providers/AuthProvider";
import { getItemFromLocalStorage, LOCALSTORAGE_TOKEN_KEY } from "../utils";
import { setItemInLocalStorage, removeItemFromLocalStorage } from "../utils";
import jwt from "jwt-decode";

export const useAuth=()=>{
    return useContext(AuthContext);   
}
export const useProvideAuth=()=>{
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
      const getUser=async ()=>{
        const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
        const user = jwt(userToken);
        if (userToken) {
          const response =await getUserFriends();
          let friends = [];
          if(response.success) {
            friends = response.data.friends;
          }
          setUser({
            ...user,
            friends
          });
        }
        setLoading(false);
      }
       getUser(); 
    },[])

    const updateUserFriend=(addFriend,friend)=>{
      if(addFriend){
        setUser({
          ...user,
          friends:[...user.friends,friend]
        })
      }else{
        const newFriends = user.friends.filter(
          (f)=>f.to_user._id!=friend.to_user._id
        )
          setUser({
            ...user,
            friends:newFriends
          })
      }
    }

    const login= async (email,password)=>{
        const response = await userLogin(email, password);
        console.log("hooks",response)
        if(response.success){
            setItemInLocalStorage(
              LOCALSTORAGE_TOKEN_KEY,
              response.data.token ? response.data.token : null
            );
            setUser(response.data.user);
            return{
                success:true
            }
        }else{
            return {
              success: false,
              message: response.message,
            };
        }
    }

    const logout =()=>{
        setUser(null);
        removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    }

    const updateUser = async (email, name, password, confirmPassword) => {
      const response = await updateProfile(
        name,
        email,
        password,
        confirmPassword
      );
      if (response.success) {
        setUser(response.data.user);
        setItemInLocalStorage(
          LOCALSTORAGE_TOKEN_KEY,
          response.data.token ? response.data.token : null
        );
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          message: response.message,
        };
      }
    };



    const signup =async (name,email,password,confirmpassword)=>{
        const response =await register(name, email, password, confirmpassword);
        if (response.success) {
        return {
            success: true,
        };
        } else {
        return {
            success: false,
            message: response.message,
        };
        }
  };

    return {
      user,
      loading,
      login,
      logout,
      signup,
      updateUser,
      updateUserFriend,
    };
}