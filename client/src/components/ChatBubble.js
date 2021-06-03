import React from 'react'
import "../styles/chatBubble.css"

function ChatBubble(props) {

    const localStorageName = localStorage.getItem("nameKey")

    return (
        <div className={props.name===localStorageName ? "container self-container" : "container"}>
            {/* <img src={props.loggedUsers.profilePic} alt="Avatar"/> */}
            <p className="sender-name">{props.name}:</p>
            <p>{props.message}</p>
            <span className="time-right">{props.time}</span>
        </div>
    )
}

export default ChatBubble
