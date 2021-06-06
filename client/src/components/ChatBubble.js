import React from 'react'
import "../styles/chatBubble.css"

function ChatBubble(props) {

    const localStorageName = localStorage.getItem("nameKey")

    return (
        <div className={props.name==="Alert" ? "alert-container" : props.name===localStorageName ? "container self-container" : "container"}>
            {/* <img src={props.loggedUsers.profilePic} alt="Avatar"/> */}
            <p className={props.name==="Alert" ? "alert-name" :"sender-name"}>{props.name}:</p>
            <p className={props.name==="Alert" && "alert-text"}>{props.message}</p>
            <span className="time-right">{props.time}</span>
        </div>
    )
}

export default ChatBubble
