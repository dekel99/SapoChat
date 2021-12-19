import React, { useState } from 'react'
import "../styles/App.css"
import "../styles/register.css"
import { Button, TextField } from "@material-ui/core";
import Axios from "axios"

function Register() {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [confirm, setConfirm] = useState()
    const [registerErr, setRegisterErr] = useState(false)
    const [shortErr, setShortErr] = useState(false)
    const [UserExistErr, setUserExistErr] = useState(false)
    const [minReqPasswordErr, setMinReqPasswordErr] = useState(false)

    // Send entered details to server after validtion ** 
    function sendRegister(e){
        e.preventDefault()
        const userDetails = {username: username, password: password }

        if (username.length>2){
            if (password.length < 6){
                setRegisterErr(false)
                setShortErr(false)
                setUserExistErr(false)
                setMinReqPasswordErr(true)
            }
            else if(password === confirm){
                Axios({
                    method: "POST", 
                    url: process.env.REACT_APP_SERVER_URL + "/register", 
                    withCredentials: true, 
                    data: userDetails}).then(res=> {
                        if (res.data.name==="UserExistsError"){
                            setUserExistErr(true)
                            setRegisterErr(false)
                            setShortErr(false)
                            setMinReqPasswordErr(false)
                        } else {
                            window.location.replace( process.env.REACT_APP_FRONT_URL + "/")
                        }
                    }).catch(err => {console.log(err)})
            } else {
                setRegisterErr(true)
                setShortErr(false)
                setUserExistErr(false)
                setMinReqPasswordErr(false)
            }
        } else {
            setShortErr(true)
            setUserExistErr(false)
            setRegisterErr(false)
            setMinReqPasswordErr(false)
        }
    }

    return (
        <div className="register-block">
            <h3>Register</h3>
            <form onSubmit={sendRegister}>

                <div className="username-input">
                    <TextField
                        onChange={(e) => {setUsername(e.target.value)}}
                        autoComplete="off"
                        name="username"
                        id="standard-half-width"
                        label="Username:"
                        style={{ margin: 5 }}
                        //value={text}
                        placeholder="Your name.."
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                <div className="password-input">
                    <TextField
                        type="password"
                        onChange={(e) => {setPassword(e.target.value)}}
                        name="password"
                        id="standard-half-width"
                        label="Password:"
                        style={{ margin: 5 }}
                        //value={text}
                        placeholder="Your password.."
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                <div className="password-input">
                    <TextField
                        type="password"
                        onChange={(e) => {setConfirm(e.target.value)}}
                        name="confirmPassword"
                        id="standard-half-width"
                        label="Confrim password:"
                        style={{ margin: 5 }}
                        //value={text}
                        placeholder="Confirm your password.."
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                {UserExistErr && <p className="register-err">This username allready exist</p>}
                {shortErr && <p className="register-err">Name must be at least 3 charecters</p>}
                {registerErr && <p className="register-err" >Passwords does not match</p>} 
                {minReqPasswordErr && <p className="register-err" >Password needs to be at least 6 digits</p>}
                <Button onKeyDown={e => {if (e.key === "Enter") {sendRegister()}}} variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </form> 
        </div>
    )
}

export default Register
