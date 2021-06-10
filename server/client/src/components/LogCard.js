import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import "../styles/logCard.css"

function LogCard() {

    const [logOrRegMenu, setLogOrRegMenu] = useState(false)

    function googleAuth(){
        window.location.replace("http://localhost:4000/auth/google")
    }
  
      function facebookAuth(){
        window.location.replace("http://localhost:4000/auth/facebook")
    }

    return (
        <div className="cardd">
            <p id="log-reg-header" className={logOrRegMenu ? "card-header" : "card-header card-header-remove"} onClick={() => {logOrRegMenu ? setLogOrRegMenu(false) : setLogOrRegMenu(true)}}>Login or Register</p>

            {logOrRegMenu && 
            <div className="">
                <div className="google-auth">
                <button className="loginBtn loginBtn--google" onClick={googleAuth}>Google login</button> <button className="loginBtn loginBtn--facebook" onClick={facebookAuth}>Facebook login</button><br/><br/>      
                </div>

                <div className="local-auth-boutton">
                <Button variant="contained" color="primary" type="submit"><a href={ "https://sapochat.herokuapp.com/login" || "http://localhost:3000/login"} className="login-button">Login</a></Button>
                </div>

                <div className="register">
                    <p>don't have an account? <a href="http://localhost:3000/register" className="register-button" id="register-btn">Register</a></p>
                </div>
            </div>}
        </div>
    )
}

export default LogCard
