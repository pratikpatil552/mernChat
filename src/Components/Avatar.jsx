import React from 'react'

const colors = ['bg-red-200','bg-green-200', 'bg-purple-200', 
    'bg-blue-200','bg-yellow-200','bg-teal-200'];

const Avatar = ({userId,username}) => {
  if(!userId || !username){
    return (<></>)
  }
    const userIdBase10 = parseInt(userId,16);
    const colorind = userIdBase10%colors.length;
    const color = colors[colorind];
  return (
    <div className={'w-8 h-8 rounded-full text-center flex items-center '+color}>
      <div className='text-center w-full opacity-70'>{username[0]}</div>
    </div>
  )
}

export default Avatar
