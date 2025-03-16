import { Link } from 'react-router-dom';
import tech from '../assets/tech.json'
import Lottie from "lottie-react";
import Typewriter from "react-ts-typewriter";

export default function Banner() {
  return (
    <div className='bg-gradient-to-b from-gray-50 to-yellow-100 py-5 md:py-0'>
       <div className="mx-auto min-h-screen md:flex items-center gap-5 w-11/12">
        <div className="md:w-1/2">
                <Lottie animationData={tech} loop={true} />
            </div>
            <div className='md:w-1/2'>
                <h1 className='font-bold mb-2 text-4xl'> <Typewriter text={["Innovation at Your Fingertips", "Power, Performance, Precision", "Transform Your Digital World"]} delay={1500} loop={true} speed={100} />  </h1>
                <h2 className='text-xl mb-5'> Experience the future with cutting-edge technology designed to make life simpler, faster, and smarter. </h2>
                <Link to='/products' className='small-button bg-blue-500 py-2 px-5'> See Products </Link>
            </div>
       </div>
    </div>
  )
}
