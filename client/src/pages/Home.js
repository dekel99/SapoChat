import { useState } from "react";
import Axios from "axios"
import "../styles/home.css"
import "../styles/App.css"
import ChatContanier from '../components/ChatContainer';
import CreateName from "../components/CreateName";
import LogCard from "../components/LogCard";


function Home(props) {

    const [id, setId] = useState()
    const [mapTrigger, setmapTrigger] = useState(false)
    const [nameExistErr, setNameExistErr] = useState(false)

    // Runs when guest enters his name **
    function submitName(name){
      Axios.get( process.env.REACT_APP_SERVER_URL + "/check-user-exist/" + name).then(res => {
        if (res.data===true){
          setNameExistErr(true)
        } else {
          setId(name)
          localStorage.setItem("nameKey", name)  
          setmapTrigger(true)
        }
      })
    }

    // Checks if user is auth and update his username if he is **
    Axios({
      method:"GET",
      withCredentials: true,
      url: process.env.REACT_APP_SERVER_URL + "/profile"
    }).then(res => {
      if (res.data[0].username){
        setId(res.data[0].username)
        localStorage.setItem("nameKey", res.data[0].username)  
        setmapTrigger(true)
      }
    })

    return (
      <div className="App">
        {id ? <ChatContanier catchLoggedUsers={props.catchLoggedUsers} mapTrigger={mapTrigger} name={id}/> : 
        <div className="home-login">
          <div className="title-guest-input">
            <h3 className="guest-title" >Enter as a guest</h3>
            <CreateName submitName={submitName}/>
            {nameExistErr && <p className="register-err">Name allready exists</p>}
            <LogCard/>
          </div>
        </div>}
      </div>
    )
}

export default Home
