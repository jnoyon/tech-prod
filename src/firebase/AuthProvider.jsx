import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react"
import { auth } from "./firebase.config";

export const AuthContext = createContext(null);

export default function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const provider = new GoogleAuthProvider();

    // create User
    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // SignIn
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

     // SignInWith Google
     const signInWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, provider)
    }

       // Update User
       const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    }

    // Logout 
    const signOutUser = () => {
        setLoading(true)
        return signOut(auth)
    }

    useEffect(()=> {
       const unsubscribe = onAuthStateChanged(auth, currentUser => {
             setUser(currentUser)
             setLoading(false)
        })
        return () => {
            return unsubscribe()
        }
    } ,[])



    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        signOutUser,
        updateUser,
        signInWithGoogle
    }
  return (
    <AuthContext.Provider value={authInfo} >
        {children}
    </AuthContext.Provider>
  )
}
