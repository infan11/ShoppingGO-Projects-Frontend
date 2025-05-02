import { createContext, useEffect } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../../../Firebase/firebase.config";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useDispatch, useSelector } from "react-redux";
import {
  setToken,
  setUser,
  setLoading,
} from "../../AuthSlice/AuthSlice";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const axiosPublic = useAxiosPublic();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  // Create user
  const createUser = (email, password) => {
    dispatch(setLoading(true));
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const login = (email, password) => {
    dispatch(setLoading(true));
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = () => {
    dispatch(setLoading(true));
    return signOut(auth).then(() => {
      dispatch(setUser(null));
      dispatch(setToken(null));
      dispatch(setLoading(false));
    });
  };

  // Google Auth
  const googleAuth = () => {
    dispatch(setLoading(true));
    return signInWithPopup(auth, googleProvider);
  };

  // Reset Password
  const resetPassword = (email) => {
    dispatch(setLoading(true));
    return sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = async ({ displayName, photoURL }) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL,
        });

        await auth.currentUser.reload();
        dispatch(setUser({ ...auth.currentUser }));

        console.log("Updated user profile:", auth.currentUser);
      } catch (error) {
        console.error("Profile update failed:", error);
      }
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
      dispatch(setLoading(false));

      if (currentUser) {
        axiosPublic
          .post("/jwt", { email: currentUser.email })
          .then((res) => {
            if (res.data.token) {
              dispatch(setToken(res.data.token));
            } else {
              dispatch(setToken(null));
            }
          })
          .catch((error) => console.error("JWT Error:", error));
      } else {
        dispatch(setToken(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch, axiosPublic]);

  const authInfo = {
    user,
    loading,
    createUser,
    login,
    logout,
    googleAuth,
    updateUserProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
