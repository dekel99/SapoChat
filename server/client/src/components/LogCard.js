import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import "../styles/logCard.css"

function LogCard() {

    const [logOrRegMenu, setLogOrRegMenu] = useState(false)

    function googleAuth(){
        window.location.replace( process.env.REACT_APP_SERVER_URL + "/auth/google")
    }
  
      function facebookAuth(){
        window.location.replace( process.env.REACT_APP_SERVER_URL + "/auth/facebook")
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
                <Button variant="contained" color="primary" type="submit"><a href={process.env.REACT_APP_FRONT_URL + "/login"} className="login-button">Login</a></Button>
                </div>

                <div className="register">
                    <p>don't have an account? <a href={process.env.REACT_APP_FRONT_URL + "/register"} className="register-button" id="register-btn">Register</a></p>
                </div>
            </div>}
        </div>
    )
}

export default LogCard
