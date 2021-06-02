import { useState } from "react";
import Axios from "axios"
import "../styles/home.css"
import "../styles/App.css"
import ChatContanier from '../components/ChatContainer';
import CreateName from "../components/CreateName";
import LogCard from "../components/LogCard";


function Home() {

    const [id, setId] = useState()
    const [mapTrigger, setmapTrigger] = useState(false)

    // Runs when guest enters his name **
    function submitName(name){
      setId(name)
      localStorage.setItem("nameKey", name)  
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

    return (
      <div className="App">
        {id ? <ChatContanier mapTrigger={mapTrigger} name={id}/> : 
        <div className="home-login">
          <div className="title-guest-input">
            <h3 className="guest-title" >Enter as a guest</h3>
            <CreateName submitName={submitName}/>
            <LogCard/>
          </div>
        </div>}
      </div>
    )
}

export default Home
