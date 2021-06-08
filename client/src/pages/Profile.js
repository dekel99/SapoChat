import React, { useState } from 'react'
import "../styles/App.css"
import "../styles/profile.css"
import Axios from "axios"
import { Button, TextField } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';

let fileName = ""
var i = 0
const defaultUserPic="https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg"

function Profile() {
  const [name, setName] = useState()
  const [newName, setNewName] = useState()
  const [usedNameErr, setUsedNameErr] = useState(false)
  const [shortErr, setShortErr] = useState(false)
  const [currentImg, setCurrentImg] = useState(defaultUserPic)
  const reader = new FileReader();
  
  // Update img file in client when pick img from computer **
  function fileChange(e) {
    if (e.target.files[0]){
      const fileVar = e.target.files[0]
      fileName = fileVar.name

      if (fileVar.type.match('image.*')) {
        reader.readAsDataURL(fileVar);
      }

      reader.onload = function (e) {
        setCurrentImg(reader.result)
        uploadFile(fileVar)
      }
    }
  }

  // Auth user and return hes username **
  if (i<1){
    Axios({
      method:"GET",
      withCredentials: true,
      url:"http://localhost:4000/profile"
    }).then(res => {
      if (res){
       setName(res.data[0].username)
       setCurrentImg(res.data[0].profilePic)
       i++
      }
    }).catch(err => {console.log(err)})
  }


  // Sends new name to server and change it in DB **
  function changeName(e){
    e.preventDefault()

    if (newName.length<3){
      setShortErr(true)
      setUsedNameErr(false)
    } else {
      setShortErr(false)
      Axios({
        method: "POST", 
        url: "http://localhost:4000/change-name", 
        withCredentials: true, 
        data: {changeName: newName}}).then(res=> {
          if(res.data.codeName==="DuplicateKey"){
            setUsedNameErr(true)
          } else {
            setName(res.data)
            setUsedNameErr(false)
            setNewName("")          
          }
        })
    }
  }

  // Trigger when upload button clicked and send img file and name to server **
  function uploadFile(fileVar) {
    const data = new FormData()
    data.append("name", fileName)
    data.append("file", fileVar)

    Axios({method: "POST", url: "http://localhost:4000/upload", data: data, withCredentials: true
    }).then(res => {
      setCurrentImg("http://localhost:4000/public/uploads/" + res.data) // Gets callback from server of img name and update it **
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="register-block">

      <div class="img-text-container">
        <h3>Profile</h3>

        <div class="avatar-upload">
          <div class="avatar-edit">
            <input type='file' id="imageUpload" accept=".png, .jpg, .jpeg" onChange={fileChange}/>
            <label for="imageUpload" ><CreateIcon/></label>
          </div>

          <div class="avatar-preview">
            <div id="imagePreview" style={{backgroundImage: 'url(' + currentImg + ')'}}></div>
          </div>
        </div>
      </div>

      <form onSubmit={changeName}>
        <h3>Hi, {name}</h3>

        <div className="new-name-input">
          <TextField
            type="text"
            onChange={e => {setNewName(e.target.value)}}
            value={newName}
            id="standard-half-width"
            label="Change your name here:"
            style={{ margin: 5 }}
            placeholder="Your new name.."
            fullWidth
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
          />
        </div>
        {shortErr && <p className="register-err">Name must be at least 3 charecters</p>}
        {usedNameErr && <p className="register-err">This name allready in use</p>}
        <Button className="change-user-name-submit" variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
      </form>
    </div>
  )
}

export default Profile
