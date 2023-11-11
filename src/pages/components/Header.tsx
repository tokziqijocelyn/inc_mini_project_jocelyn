import React from 'react'

type Props = {}

const Header = (props: Props) => {
  return (
    <div className='bg-red-100 flex justify-around'>
        <h1>This is the header</h1>
        <img src="https://media.istockphoto.com/id/1470130937/photo/young-plants-growing-in-a-crack-on-a-concrete-footpath-conquering-adversity-concept.webp?b=1&s=170667a&w=0&k=20&c=IRaA17rmaWOJkmjU_KD29jZo4E6ZtG0niRpIXQN17fc="
        className='w-10 h-10'/>
    </div>
  )
}

export default Header