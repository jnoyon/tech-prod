import Lottie from 'lottie-react';
import authentication from '../assets/authentication.json';
import { Helmet } from 'react-helmet';
import Heading from '../shared/Heading';
import { useContext, useState } from 'react';
import { AuthContext } from '../firebase/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const notify = (msg) => toast.error(msg);
  const success = (msg) => toast.success(msg);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      notify('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email, password);
      success('User Logged In Successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL || '',
        isMember: true,
        isModerator: false,
        isAdmin: false,
      };

      await fetch('https://tech-prod-server.vercel.app/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      success('Google Sign-In Successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/user-not-found':
        notify('No user found with this email.');
        break;
      case 'auth/wrong-password':
        notify('Incorrect password. Please try again.');
        break;
      case 'auth/too-many-requests':
        notify('Too many failed attempts. Try again later.');
        break;
      default:
        notify(error.message);
    }
  };

  return (
    <section className="flex items-center min-h-screen justify-center flex-col">
      <ToastContainer position="top-right" autoClose={1000} theme="light" />

      <Helmet>
        <title>Login - TechProd</title>
      </Helmet>

      <div className="container mx-auto w-11/12 flex items-center justify-between">
        
        <div className="md:w-1/2">
          <Lottie animationData={authentication} loop={true} />
        </div>

       
        <div className="md:w-1/2">
          <Heading heading="Login" />

          <form onSubmit={handleLogin} className="md:w-1/2 flex flex-col gap-3">
            <label className="input input-bordered flex items-center gap-2">
              Email
              <input type="email" name="email" className="grow" placeholder="Enter Email" required />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Password
              <input type="password" name="password" className="grow" placeholder="Enter Password" required />
            </label>

            <input
              type="submit"
              className={`py-2 bg-green-400 rounded-lg text-white cursor-pointer ${loading ? 'opacity-50' : ''}`}
              value={loading ? 'Logging in...' : 'Login'}
              disabled={loading}
            />
          </form>

          <button
            className="btn btn-wide mt-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in with Google...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </section>
  );
}
