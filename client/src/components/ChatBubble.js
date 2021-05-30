import React from 'react'
import "../App.css"

function ChatBubble(props) {

    return (
        <div className="container">
            {/* <img src={props.loggedUsers.profilePic} alt="Avatar"/> */}
            <p className="sender-name">{props.name}:</p>
            <p>{props.message}</p>
            <span class="time-right">{props.time}</span>
        </div>
    )
}

export default ChatBubble
