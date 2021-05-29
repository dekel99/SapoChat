import React, { useState } from 'react'
import "../App.css"
import { Button } from "@material-ui/core";
import Axios from "axios"

function Register() {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [confirm, setConfirm] = useState()
    const [registerErr, setRegisterErr] = useState(false)

    function sendRegister(e){
        e.preventDefault()
        const userDetails = {username: username, password: password }
        console.log(userDetails)

        if (password===confirm){
            Axios({
                method: "POST", 
                url: "http://localhost:4000/register", 
                withCredentials: true, 
                data: userDetails}).then(res=> {
                    if (res){
                        window.location.replace("http://localhost:3000/")
                    }
                })
        } else {
            setRegisterErr(true)
        }
    }

    return (
        <div className="register-block">
            <h3>Register</h3>
            <form onSubmit={sendRegister}>
                <label for="fname">Username:</label><br/>
                <input type="text" id="nameId" name="username" placeholder="Your name.." onChange={(e) => {setUsername(e.target.value)}}/><br/>
                <label for="lname">Password</label><br/>
                <input type="password" id="passwordId" name="password" placeholder="Your password.." onChange={(e) => {setPassword(e.target.value)}}/><br/>
                <label for="lname">Confirm Password</label><br/>
                <input type="password" id="passwordIdConfirm" name="confirmPassword" placeholder="Your password.." onChange={(e) => {setConfirm(e.target.value)}}/><br/><br/>
                {registerErr && <p className="register-err" >passwords does not match</p>} 
                <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </form> 
        </div>
    )
}

export default Register
