import { Helmet } from "react-helmet";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoleContext } from "../shared/RoleContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("https://tech-prod-server.vercel.app/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, []);

  const handleMakeModerator = (id) => {
    fetch(`https://tech-prod-server.vercel.app/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isModerator: true, isAdmin: false })
    })
      .then((res) => {
        if (res.ok) {
          toast.success("User is now a Moderator!");
          setUsers(users.map(user => user._id === id ? { ...user, isModerator: true, isAdmin: false } : user));
        } else {
          throw new Error("Failed to update user role.");
        }
      })
      .catch((err) => {
        console.error("Failed to toggle moderator role:", err);
        toast.error("Failed to update user role.");
      });
  };
  
  const handleMakeAdmin = (id) => {
    fetch(`https://tech-prod-server.vercel.app/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAdmin: true, isModerator: false })
    })
      .then((res) => {
        if (res.ok) {
          toast.success("User is now an Admin!");
          setUsers(users.map(user => user._id === id ? { ...user, isAdmin: true, isModerator: false } : user));
        } else {
          throw new Error("Failed to update user role.");
        }
      })
      .catch((err) => {
        toast.error("Failed to update user role.");
      });
  };
  

  if (loading) return <p className="flex justify-center min-h-screen"><div className="loading loading-lg loadiner-spinner"></div></p>;
  const {isAdmin} = useContext(RoleContext)
  if(!isAdmin){
    return <p className="p-5"> Admin Access Only </p>
  }
  return (
    <div className="mx-auto w-11/12">
      <Helmet>
        <title>Users - TechProd</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={1000} theme="light" />
      <h2 className="md:text-3xl text-center font-bold py-5">All Users</h2>
      <div className="overflow-x-auto">
        <table className="table my-3 w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">User Name</th>
              <th className="border p-2">User Email</th>
              <th className="border p-2">Make Moderator</th>
              <th className="border p-2">Make Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {user.isModerator ? (
                    <span className="text-green-600">Moderator</span>
                  ) : (
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleMakeModerator(user._id)}
                    >
                      Make Moderator
                    </button>
                  )}
                </td>
                <td className="border p-2">
                  {user.isAdmin ? (
                    <span className="text-red-600">Admin</span>
                  ) : (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleMakeAdmin(user._id)}
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
