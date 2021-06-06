import React, { useState } from 'react';
import Axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import UsersList from './UsersList';
import GroupIcon from '@material-ui/icons/Group';
import "../styles/navbar.css"



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar(props) {

  const { isAuth } = props

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loggedUsersBox, setLoggedUsersBox] = useState(false)
  const open = Boolean(anchorEl);

  // --------------------------------------------HANDLE MENU FUNCTIONALITY-----------------------------------------

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Sends user to server to logout **
  function logout(){
    handleClose()
    window.location.replace("http://localhost:4000/logout");
  }

  // Checks if user is auth and redirect to profile page **
  function profilePage(){
    handleClose()

    Axios({
      method:"GET",
      withCredentials: true,
      url:"http://localhost:4000/profile"
    }).then(res => {
      if (res){
        window.location.replace("http://localhost:3000/profile")
      }
    })  
  }


  return (
    <div className={classes.root}>

      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">

          <div className="users-list-btn">
            <GroupIcon onClick={() => {loggedUsersBox ? setLoggedUsersBox(false) : setLoggedUsersBox(true)}}/> 
            {props.loggedUsers && <p className="users-number">{props.loggedUsers.length}</p>} {/*Number of logged users */}
          </div>

          </IconButton>
          
          <Typography variant="h6" className={classes.title}>
            <a href="http://localhost:3000/">SapoChat V 1.0</a>
          </Typography>
          
          {isAuth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
              <AccountCircle />
              </IconButton>
              {isAuth && <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={profilePage}>Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>}
            </div>
          )}
        </Toolbar>
      </AppBar>
      {loggedUsersBox && <div className="users-list"><UsersList loggedUsers={props.loggedUsers}/></div>}
    </div>
  );
}

