import { useState } from "react";
import Axios from "axios"
import "../App.css"
import ChatContanier from '../components/ChatContainer';
import CreateName from "../components/CreateName";
import {GoogleLogin} from "react-google-login"
import { Button } from "@material-ui/core";

function Home() {

    const [id, setId] = useState()
    const [mapTrigger, setmapTrigger] = useState(false)

    // Runs when guest enters his name **
    function submitName(name){
      setId(name)
      localStorage.setItem("nameKey", name)  
      setmapTrigger(true)
    }
  
    // Takes name from google user **
    function googleRes(res){
      console.log(res.Ft.yV)
      setId(res.Ft.yV)
      setmapTrigger(true)
    }

    // Checks if user is auth and update his username if he is **
    Axios({
        method:"GET",
        withCredentials: true,
        url:"http://localhost:4000/profile"
      }).then(res => {
        if (res){
          setId(res.data[0].username)
          setmapTrigger(true)
        }
      })

    function googleAuth(){
      window.location.replace("http://localhost:4000/auth/google")
      // Axios({
      //   method:"GET",
      //   withCredentials: true,
      //   url:"http://localhost:4000/auth/google"
      // }).then(res => {
      //   if (res){
      //     console.log(res)
      //   }
      // })
    }

    return (
        <div className="App">
            {id ? <ChatContanier mapTrigger={mapTrigger} name={id}/> : 
            <div>
                <h3>Enter as a guest</h3>
                <div>
                    <CreateName submitName={submitName}/>
                    <hr/><p className="or" >optional</p><hr/>
                    <div className="google-auth">
                      <button onClick={googleAuth}>Google auth test</button>
                      <GoogleLogin
                        clientId="1068259986849-lovbdof3dq79667qn70qjoufsu4cb96s.apps.googleusercontent.com"
                        onSuccess={googleRes}
                        onFailure={googleRes}
                      /><br/>
                    </div>
                    <div className="local-auth-boutton">
                        <Button variant="contained" color="primary" type="submit"><a href="http://localhost:3000/login" className="login-button">Login</a></Button>
                        <p className="or"> or </p> 
                        <Button variant="contained" color="primary" type="submit"><a href="http://localhost:3000/register" className="register-button">Register</a></Button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Home
