import React, { useState } from 'react'
import "../App.css"
import Axios from "axios"
import { Button } from "@material-ui/core";

let fileName = ""
var i = 0
const defaultUserPic="https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg"

function Profile() {
  const [name, setName] = useState()
  const [newName, setNewName] = useState()
  const [usedNameErr, setUsedNameErr] = useState(false)
  const [shortErr, setShortErr] = useState(false)
  const [file, setFile] = useState()
  const [currentImg, setCurrentImg] = useState(defaultUserPic)

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

  // Update img file in client when pick img from computer **
  function fileChange(e) {
    if (e.target.files[0]){
      fileName = e.target.files[0].name
      setFile(e.target.files[0])
    }
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
          console.log(res.data.codeName)
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
  function uploadFile(e) {
    const data = new FormData()
    data.append("name", fileName)
    data.append("file", file)

    Axios({method: "POST", url: "http://localhost:4000/upload", data: data, withCredentials: true
    }).then(res => {
      setCurrentImg("http://localhost:4000/public/uploads/" + res.data) // Gets callback from server of img name and update it **
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="register-block">
      <form onSubmit={changeName}>
        <p>current name: {name}</p>
        <label for="fname">Change Name:</label><br/>
        <input type="text" placeholder="Your new name.." value={newName} onChange={e => {setNewName(e.target.value)}}/><br/>
        {shortErr && <p className="register-err">Name must be at least 3 charecters</p>}
        {usedNameErr && <p className="register-err">This name allready in use</p>}
        <Button className="change-user-name-submit" variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
      </form>
        <p>Upload your picture: </p>
        <input type="file" id="myFile" name="filename" onChange={fileChange} hidden></input>
        <label for="myFile"><img className="default-user-pic-profile" src={currentImg} alt="profile-picture"/></label><br/>
        {currentImg ? <Button variant="contained" color="primary" value="Upload" onClick={uploadFile}>Click to upload</Button> : null}
    </div>
  )
}

export default Profile
