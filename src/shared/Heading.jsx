import React from 'react'

export default function Heading({heading, subHeading}) {
  return (
    <div>
        <h1 className='font-bold md:text-5xl text-3xl md:mb-5'> {heading} </h1>
        <p className='text-gray-600 md:text-2xl'> {subHeading} </p>
    </div>
  )
}
