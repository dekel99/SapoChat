import React, { useState } from "react";
import "./styles/App.css"
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Axios from "axios";


function App() {

  const [isAuth, setIsAuth] = useState(false) // Global Auth state for client side

  // Checks if User is auth **
  Axios({
    method:"GET",
    withCredentials: true,
    url:"http://localhost:4000/auth"
  }).then(res => {
    if (res){
      setIsAuth(res.data)
    }
  })

  return (
    <Router>
      <main>
        <div className="App">
          <Navbar isAuth={isAuth}/>
        </div>
          <Switch> 

            <Route path="/" exact> 
              <Home/>
            </Route>

            <Route path="/Register" exact> 
              <Register/>
            </Route>

            <Route path="/Login" exact> 
              <Login/>
            </Route>

            {isAuth && <Route path="/Profile" exact> 
              <Profile/>
            </Route>}

          </Switch> 
        <Footer/>     
      </main>
    </Router> 
  );
}

export default App;