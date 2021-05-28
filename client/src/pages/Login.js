import React from 'react'
import { Button } from "@material-ui/core";

function Login() {

    
    
    return (
        <div className="register-block">
            <h3>Login</h3>
            <form action="http://localhost:4000/login" method="post">
                <label for="fname">Userame:</label><br/>
                <input type="text" name="username" placeholder="Your name.."/><br/>
                <label for="lname">Password</label><br/>
                <input type="password" name="password" placeholder="Your password.."/><br/><br/>
                <Button variant="contained" color="primary" type="submit" value="Submit">Log In</Button>
            </form> 
        </div>
    )
}

export default Login
