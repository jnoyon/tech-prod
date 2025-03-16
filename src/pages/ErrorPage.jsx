import React from 'react'
import notfound  from '../assets/notfound.json'
import Lottie from "lottie-react";
import { Link } from 'react-router-dom';
export default function ErrorPage() {
  return (
    <div>
        <div className='container mx-auto flex min-h-screen items-center flex-col justify-center'>
            <Lottie animationData={notfound} loop={true} className='w-1/2'  />
            <Link to='/'  className='bg-green-400 small-button px-5 py-2'> Back to Home </Link>
        </div>
    </div>
  )
}
