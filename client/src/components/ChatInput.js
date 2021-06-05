import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import { Button } from "@material-ui/core";
import "../styles/chatInput.css"


const ChatInput = (props) => {

  const [text, setText] = useState("");

  // Saves text value **
  function handleTextInput(event){
      setText(event.target.value)
  }

  // Trigers when send is clicked and fires functions on parent components that handle sending text to server **
  function submitText(){
    if (text!==""){
      props.handleSendText(text)
      props.sendMessToServer(text)
      setText("")
    }
  }

  return (
    <form noValidate autoComplete="off" className="chat-input" onKeyDown={e => {if (e.key === "Enter") {submitText()
     e.preventDefault()}}}>
      <div >
        <TextField
          onChange={handleTextInput}
          id="standard-full-width"
          label="Chat text"
          style={{ margin: 8 }}
          value={text}
          fullWidth
          placeholder="Write here.."
          margin="normal"
          required={true}
          InputLabelProps={{
          shrink: true,
          }}
        />
        <div className="send-button">
          <Button id="send-massage-button" variant="contained" color="primary" onClick={submitText}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" class="bi bi-arrow-bar-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
            </svg>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChatInput
