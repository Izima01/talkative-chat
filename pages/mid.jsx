import React, { useEffect } from 'react'

const mid = () => {

  function getMiddleStr(str) {
    const middle = Math.floor(str.length/2);
    return (typeof str !== "string") ? "Sorry. That's not a string"
    : (str.length%2 == 0) ? `${str[middle-1]}${str[middle]}`
    : `${str[middle]}`
  }

    // useEffect(() => {
        console.log(getMiddleStr('dance'));
        console.log(getMiddleStr('miracle'));
        console.log(getMiddleStr('do'));
        console.log(getMiddleStr('a'));
    // }, [])

  return (
    <div>mid</div>
  )
}

export default mid