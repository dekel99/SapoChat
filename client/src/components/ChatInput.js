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
    <form noValidate autoComplete="off" className="chat-input">
      <div >
        <TextField
          onChange={handleTextInput}
          id="standard-full-width"
          label="Chat text"
          style={{ margin: 8 }}
          value={text}
          placeholder="Write here.."
          fullWidth
          margin="normal"
          required={true}
          InputLabelProps={{
          shrink: true,
          }}
        />
        <div className="send-button">
          <Button variant="contained" color="primary" onClick={submitText}>
            Send
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChatInput
