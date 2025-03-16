import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../firebase/AuthProvider";


export default function PrivateRoute({children}) {

    const {user, loading} = useContext(AuthContext)
   
    const location = useLocation()
    if(loading){

       return (<div className='container mx-auto w-11/12 flex items-center justify-center min-h-lvh'>
        <span className="loading loading-ring loading-lg"></span>
    </div>)
    }
    if(user){
        return children;
    }

  return (
    
    
    <Navigate state={location.pathname} to='/login'></Navigate>
  )
}