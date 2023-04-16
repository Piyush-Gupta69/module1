import React from 'react'
import "./Success.css";

const Success = ({text}) => {
  console.log(text)
  return (
    <div>
      <div className="container-suc">
        <div className={text==="PRESENT!"? "wrapper-suc" : "wrapper-abs"}>
            <h1>{text}</h1>
        </div>
      </div>
    </div>
  )
}

export default Success
