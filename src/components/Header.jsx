import { Link, NavLink } from 'react-router-dom'
import techprod from '../assets/techprod.png'
import { useContext } from 'react'
import { AuthContext } from '../firebase/AuthProvider'
export default function Header() {
  const {user, signOutUser} = useContext(AuthContext);
    const navLinks =  <>
        <NavLink to='/'> Home </NavLink>
        <NavLink to='/products'> Products </NavLink>
    </>

    const handleLogOut = () => {
      signOutUser()
    }
  return (
    <div className='border-b'>
        <div className="navbar bg-base-100 w-11/12 mx-auto ">
        <div className="navbar-start hidden md:flex gap-5">
            {navLinks}
        </div>
  <div className="navbar-start md:hidden">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        {navLinks}
      </ul>
    </div>
  </div>
  <div className="navbar-center">
    <Link to='/' > <img src={techprod} alt="Logo" className='h-16' /> </Link>
  </div>
  <div className="navbar-end gap-5">
    {!user? <div className="visitors flex gap-5">
        <NavLink to='/login'> Login</NavLink>
        <NavLink to='/register'> Register </NavLink>
    </div>:
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img alt="User" src={user.photoURL} />
        </div>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <p className='px-2 py-1 border-b mb-2'> Hi,  {user.displayName}  </p>
        <li> <Link to='/dashboard'> Dashboard </Link> </li>
        <li><button onClick={handleLogOut}>Logout</button></li>
      </ul>
    </div> }
  </div>
</div>
    </div>
  )
}

