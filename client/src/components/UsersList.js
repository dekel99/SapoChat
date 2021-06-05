import React from 'react'
import "../styles/usersList.css"

const defPic="https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg"

function UsersList(props) {

    return (
        <div>
            <h4>Logged users:</h4>
            <div className="div-users">
                <ul className="ul-users">
                    {props.loggedUsers && props.loggedUsers.map((user, index) => {
                        return(
                            <div className="user-n-img" key={index}>  
                                <img className="default-user-pic" src={user.profilePic ? user.profilePic : defPic} alt="profile-pic"/>
                                <li className="user-name"><h5>{user.name}</h5></li>
                            </div>
                        )
                    }).catch(err => console.log(err))
                    }
                </ul>
            </div>
        </div>
    )
}

export default UsersList
