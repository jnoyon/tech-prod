import { useContext } from "react"
import { AuthContext } from "../firebase/AuthProvider"
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MdVerified } from "react-icons/md";
export default function Profile() {
  const {user} = useContext(AuthContext);
  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h2 className="loading loading-infinity"></h2>
        </div>
    );
    }
  const profileName = user?.displayName;
  const profilePhoto = user?.photoURL;
  const profileEmail = user?.email;
  const subscriptionStatus = true;;
  return (
    <div className="mx-auto w-11/12 py-3">
      <Helmet>
        <title> My Profile - TechProd </title>
      </Helmet>
        <h2 className="md:text-3xl text-center font-bold py-5"> My Profile </h2>
        <div className="card w-96 flex flex-col items-center justify-center mx-auto py-5 border">
          <img src={profilePhoto} alt="Photo" className="w-24 rounded-xl" />
          <h2 className="font-bold mt-2"> {profileName} </h2>
          <p className="text-sm"> Email: {profileEmail} </p>
          {!subscriptionStatus && <Link className="btn btn-error text-white btn-sm mt-2"> Subscribe (4000 Taka) </Link>}
          {subscriptionStatus && <p className="mt-1 text-sm flex items-center gap-2"> Status: <span className="flex items-center gap-1 text-green-600"> <MdVerified /> <span> Varified </span> </span> </p>}
        </div>
    </div>
  )
}
