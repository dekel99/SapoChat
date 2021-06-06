import React, { useState } from 'react'
import { Button, TextField } from "@material-ui/core";
import Axios from "axios"
import "../styles/login.css"
import "../styles/App.css"


function Login() {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [logErr, setLogErr] = useState(false)
    
    function sendLoginData(e){
        e.preventDefault()

        const userDetails = {username: username, password: password}

        Axios({
            method: "POST", 
            url: "http://localhost:4000/login", 
            withCredentials: true, 
            data: userDetails}).then(res=> { console.log(res)
                if (res.data){
                    window.location.replace("http://localhost:3000/")   
                } 
        }).catch(err => {if(err){setLogErr(true)}})
    }

    return (
        <div className="login-block">
            <h3>Login</h3>
            <form onSubmit={sendLoginData}>
                {logErr && <p className="register-err">Username or password is incorrect</p>}

                <div className="username-input">
                    <TextField
                        onChange={(e)=>{setUsername(e.target.value)}}
                        autoComplete="off"
                        name="username"
                        id="standard-half-width"
                        label="Username:"
                        style={{ margin: 5 }}
                        //value={text}
                        placeholder="Enter your username.."
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
                        onChange={(e)=>{setPassword(e.target.value)}}
                        name="password"
                        id="standard-half-width"
                        label="Password:"
                        style={{ margin: 5 }}
                        //value={text}
                        placeholder="Enter your password.."
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>

                <Button onKeyDown={e => {if (e.key === "Enter") {sendLoginData()}}} variant="contained" color="primary" type="submit" value="Submit">Log In</Button>
            </form> 
        </div>
    )
}

export default Login
