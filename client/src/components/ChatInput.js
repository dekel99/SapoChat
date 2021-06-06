import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import { Button } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
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
          <Button id="send-massage-button" variant="contained" color="primary" style={{ borderRadius: "80px", }} onClick={submitText}>
            <SendIcon/>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChatInput
