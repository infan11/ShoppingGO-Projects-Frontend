import { createContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import app from "../../../Firebase/firebase.config";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../AuthSlice/AuthSlice";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();
    const dispatch = useDispatch();
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        dispatch(setLoading(true))
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        dispatch(setLoading(true))
        return signOut(auth);
    };

    const googleAuth = () => {
        dispatch(setLoading(true))
        return signInWithPopup(auth, googleProvider);
    };

    const resetPassword = (email) => {
        dispatch(setLoading(true))
        return sendPasswordResetEmail(auth, email);
    };

    const updateUserProfile = async ({ displayName, photoURL }) => {
        if (auth.currentUser) {
            try {
                // Update Firebase Auth
                await updateProfile(auth.currentUser, {
                    displayName,
                    photoURL,
                });
    
                // Refresh user data
                await auth.currentUser.reload();
    
                const updatedUser = {
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email,
                    displayName: auth.currentUser.displayName,
                    photoURL: auth.currentUser.photoURL,
                };
    
                // Update user state
                setUser(updatedUser);
    
                // Send updated info to your database
                await axiosPublic.put(`/users/${updatedUser.email}`, {
                    uid: updatedUser.uid,
                    name: updatedUser.displayName,
                    photo: updatedUser.photoURL,
                    email: updatedUser.email,
                    date: Date.now()
                });
                toast.success("Profile updated successfully");
            } catch (error) {
                // console.error("Profile update failed:", error);
                toast.error("Failed to update profile");
            }
        }
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            dispatch(setLoading(false))
            // console.log("User found:", currentUser);
            if (currentUser) {
                const userInfo = { email: currentUser.email };
                axiosPublic.post("/jwt", userInfo)
                    .then((res) => {
                        if (res.data.token) {
                            localStorage.setItem("jwt-token", res.data.token);
                        } else {
                            localStorage.removeItem("jwt-token");
                        }
                    })
                    // .catch((error) => console.error("JWT Error:", error));
            } else {
                localStorage.removeItem("jwt-token");
            }
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        setUser,
        createUser,
        login,
        logout,
        googleAuth,
        updateUserProfile,
        resetPassword,
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
