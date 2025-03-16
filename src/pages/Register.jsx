import Lottie from 'lottie-react';
import authentication from '../assets/authentication.json';
import { Helmet } from 'react-helmet';
import Heading from '../shared/Heading';
import { useContext } from 'react';
import { AuthContext } from '../firebase/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const { createUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const notify = (msg) => toast.error(msg);
  const success = () => toast.success("User Created Successfully!");

  const handleRegistration = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoURL = e.target.photourl.value || "https://i.ibb.co/D0L4hKj/user.png"; 

    if (!email || !password || !name) {
        notify("Please fill out all required fields.");
        return;
    }

    try {
        const result = await createUser(email, password);
        const user = result.user;
        
        await updateUser({ displayName: name, photoURL });

        const userInfo = {
            name,
            email,
            photo: photoURL,
            isMember: true,
            isModerator: false,
            isAdmin: false
        };

        const response = await fetch('https://tech-prod-server.vercel.app/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo),
        });

        if (response.ok) {
            success();
            e.target.reset();
            setTimeout(() => navigate('/'), 1500);
        } else {
            notify("Failed to save user info to the server.");
        }
    } catch (error) {
        notify(error.message);
    }
};


  return (
    <section className="flex items-center min-h-screen justify-center flex-col">
      <ToastContainer position="top-right" autoClose={1000} theme="light" />

      <Helmet>
        <title>Registration - TechProd</title>
      </Helmet>

      <div className="container mx-auto w-11/12 flex items-center justify-between">
       
        <div className="md:w-1/2">
          <Lottie animationData={authentication} loop={true} />
        </div>

        
        <div className="md:w-1/2">
          <Heading heading="Registration" />

          <form onSubmit={handleRegistration} className="md:w-1/2 flex flex-col gap-3">
            <label className="input input-bordered flex items-center gap-2">
              Name
              <input type="text" name="name" className="grow" placeholder="Enter Your Name" required />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Email
              <input type="email" name="email" className="grow" placeholder="Enter Email" required />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Password
              <input type="password" name="password" className="grow" placeholder="Enter Password" required />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Photo URL
              <input type="url" name="photourl" className="grow" placeholder="Photo URL (Optional)" />
            </label>

            <input type="submit" className="py-2 bg-green-400 rounded-lg text-white cursor-pointer" value="Register" />
          </form>

          <p className="mt-4">Already have an account?</p>
          <Link to="/login" className="btn btn-wide btn-sm mt-2">Login</Link>
        </div>
      </div>
    </section>
  );
}
