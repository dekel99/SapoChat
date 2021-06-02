import React, { useState } from 'react'
import "../styles/App.css"
import "../styles/register.css"
import { Button } from "@material-ui/core";
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
                    url: "http://localhost:4000/register", 
                    withCredentials: true, 
                    data: userDetails}).then(res=> {
                        if (res.data.name==="UserExistsError"){
                            setUserExistErr(true)
                            setRegisterErr(false)
                            setShortErr(false)
                        } else {
                            window.location.replace("http://localhost:3000/")
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
                {UserExistErr && <p className="register-err">This username allready exist</p>}
                {shortErr && <p className="register-err">Name must be at least 3 charecters</p>}
                {registerErr && <p className="register-err" >Passwords does not match</p>} 
                {minReqPasswordErr && <p className="register-err" >Password needs to be at least 6 digits</p>}
                <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </form> 
        </div>
    )
}

export default Register
