import React from 'react'
import "../App.css"
import { Button } from "@material-ui/core";

function Register() {
    
    return (
        <div className="register-block">
            <h3>Register</h3>
            <form action="http://localhost:4000/register" method="post">
                <label for="fname">Username:</label><br/>
                <input type="text" id="nameId" name="username" placeholder="Your name.."/><br/>
                <label for="lname">Password</label><br/>
                <input type="password" id="passwordId" name="password" placeholder="Your password.."/><br/>
                <label for="lname">Confirm Password</label><br/>
                <input type="password" id="passwordIdConfirm" name="confirmPassword" placeholder="Your password.."/><br/><br/>
                <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </form> 
        </div>
    )
}

export default Register
