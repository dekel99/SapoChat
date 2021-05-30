import React, { useState } from 'react'
import { Button } from "@material-ui/core";
import Axios from "axios"
import "../App.css"


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
        <div className="register-block">
            <h3>Login</h3>
            <form onSubmit={sendLoginData}>
                {logErr && <p className="register-err">Username or password is incorrect</p>}
                <label for="fname">Userame:</label><br/>
                <input type="text" name="username" placeholder="Your name.." onChange={(e)=>{setUsername(e.target.value)}}/><br/>
                <label for="lname">Password</label><br/>
                <input type="password" name="password" placeholder="Your password.." onChange={(e)=>{setPassword(e.target.value)}} /><br/><br/>
                <Button variant="contained" color="primary" type="submit" value="Submit">Log In</Button>
            </form> 
        </div>
    )
}

export default Login
