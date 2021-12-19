import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { Button } from "@material-ui/core";
import "../styles/createName.css"


function CreateName(props) {

    const [name, setName] = useState("");

    // Saves text value **
    function handleSetName(event){
        setName(event.target.value)
    }

    return (
        <div className="enter-name-form">
            <form noValidate autoComplete="off" onSubmit={(event) => {props.submitName(name); event.preventDefault()}}> {/*<< Sends name value to parent component to enter as a guest */}
                <TextField
                    onChange={handleSetName}
                    id="standard-half-width"
                    label="Your Name:"
                    style={{ margin: 8 }}
                    //value={text}
                    placeholder="Enter your name..."
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button variant="contained" color="primary" type="submit">Enter Chat</Button>
            </form>
        </div>
    )
}

export default CreateName
