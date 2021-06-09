import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import { Button } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import "../styles/chatInput.css"
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';


const ChatInput = (props) => {

  const [text, setText] = useState("");
  const [emojiChartOpen, setEmojiChartOpen] = useState(true)

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
      setEmojiChartOpen(true)
    }
  }

  function addEmoji(e) {
    let emoji = e.native;
    setText(text + emoji)
    document.getElementById("standard-full-width").focus();
  }

  function scrollToBot(){
    var element = document.getElementById("chat-id");
    element.scrollTop = element.scrollHeight; 
  }

  function changeEmojiChartStatus () {
    let reverseState = !emojiChartOpen
    setEmojiChartOpen(reverseState)
    scrollToBot()
    if (emojiChartOpen === false){
      document.getElementById("standard-full-width").focus();
    }
  }
  
  return (
    <div>
      <form noValidate autoComplete="off" className="chat-input-form" onKeyDown={e => {if (e.key === "Enter") {submitText()
      e.preventDefault()}}}>
        <div >
          <div className="emoji-picker">
            <span>
              {emojiChartOpen ? null : <Picker  title="Pick Your Emoji" style={{width: "16rem", marginTop: "1rem"}} set="google" onSelect={addEmoji} />}
            </span>
          </div>
          <div className="chat-input">
            <TextField
              onChange={handleTextInput}
              id="standard-full-width"
              label="Chat text"
              multiline
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
          </div>
          <div className="send-button">
              <Button style={{paddingRight: "0", backgroundColor: "transparent", boxShadow: "none"}} variant="contained" color="secondary" onClick={changeEmojiChartStatus}>
              <EmojiEmotionsIcon style={{color: "#3f51b5"}} />
              </Button>
            <Button id="send-massage-button" variant="contained" color="primary" onClick={submitText}>
              <SendIcon/>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatInput
