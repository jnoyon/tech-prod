import { Link, NavLink, Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { Helmet } from "react-helmet";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/AuthProvider";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const { user, signOutUser } = useContext(AuthContext);

  useEffect(() => {
    fetch("https://tech-prod-server.vercel.app/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);

        const foundUser = data.find(u => u.email === user?.email);
        if (foundUser) {
          setCurrentUser(foundUser);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div className="flex justify-center min-h-screen"> <div className="loading loading-lg loading-spinner"></div> </div>;
  if (!currentUser) return <p>User not found or not logged in!</p>;

  const { isMember, isModerator, isAdmin } = currentUser;

  const handleLogOut = () => {
    signOutUser();
  };
  console.log(currentUser)
  return (
    <>
      <Helmet>
        <title> Dashboard - TechProd </title>
      </Helmet>

      <header className="flex justify-between mx-auto w-11/12 items-center bg-gray-200 rounded-md my-5 md:hidden">
        <p className="text-xl font-bold pl-5"> Dashboard </p>
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <FaBars />
        </label>
      </header>

      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Outlet />
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <h2 className="font-bold px-3 py-1 border-b text-lg"> Panel </h2>
            <li><Link onClick={() => document.getElementById('my-drawer-2').checked = false} to="/"> Homepage </Link></li>
            {isAdmin && (
              <li><Link onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard"> Dashboard </Link></li>
            )}

            <h2 className="font-bold px-3 py-1 border-b text-lg mt-2"> Products </h2>
            {isMember && (
              <>
                <li><NavLink onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard/add-product"> Add Product </NavLink></li>
                <li><NavLink onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard/my-products"> My Products </NavLink></li>
              </>
            )}
            {(isModerator || isAdmin) && (
              <>
                <li><NavLink onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard/all-products"> Review Products  </NavLink></li>
                <li><NavLink onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard/reported-products"> Reported Products </NavLink></li>
              </>
            )}
            {isAdmin && <li><NavLink onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard/coupons"> Coupons </NavLink></li>}

            <h2 className="font-bold px-3 py-1 border-b text-lg mt-2"> Users </h2>
            <li><NavLink onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard/profile"> My Profile </NavLink></li>
            {isAdmin && <li><Link onClick={() => document.getElementById('my-drawer-2').checked = false} to="/dashboard/users"> All Users </Link></li>}
            <li><button onClick={handleLogOut} className="btn text-white btn-error w-full mt-4"> Logout </button></li>
          </ul>
        </div>
      </div>
    </>
  );
}
