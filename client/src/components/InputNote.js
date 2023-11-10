import React from "react";
import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../AppContext";

import TextField from "@mui/material/TextField";

export default function InputNote() {

  const navigate = useNavigate();

  const { searchParam, setSearchParam } = useAppContext();

  const handleSearch = function(event) {
    let lowercaseSearch = event.target.value.toLowerCase();
    setSearchParam(lowercaseSearch);
  }

  const [newNote, setNewNote] = useState({noteTitle: "", noteContent: ""});
  const updateNoteField = (fieldName, value) => {
    setNewNote({...newNote, [fieldName]: value});
  };

  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);

  function titleFocus() {
    setTitleFocused(true);
    setContentFocused(true);
  }

  function titleBlur() {
    if(contentFocused && titleFocused) {
      setContentFocused(true);
      setTitleFocused(false);
    }
  }

  const [cookies, removeCookie] = useCookies(["userID"]);
  const userId = cookies.userID;
  
  const addNote = () => {
    if(newNote.noteTitle.trim() !== "" && newNote.noteContent.trim() !== "") {
        if(newNote.noteTitle.length > 50 || newNote.noteContent.length > 150 ) {
          alert("Note needs to be shorter.");
        } else {
            try {
              const response = axios.post(`http://localhost:3001/api/notes/${userId}`, newNote);
              setNewNote({noteTitle: "", noteContent: ""});

          } catch (error) {
              console.log("Error:", error);
          }
        }
    }
  }

  function handleSignOut() {
    removeCookie("userID");
    navigate("/login");
  }

  return (
    <div className="inputNote">
      <div className="dev-links">
        <button className="btn btn-primary btn-lg" onClick={handleSignOut}><i className="fa-brands fa-github"></i> GitHub</button>
        <button className="btn btn-primary btn-lg" onClick={handleSignOut}><i className="fa-solid fa-globe"></i> Website</button>
      </div>
      <div className="input-main">
        <input className="noteName" placeholder="Title" value={newNote.noteTitle} onChange={(event) => {updateNoteField("noteTitle", event.target.value)}} />
        <textarea className="noteContent" placeholder="Take a note..." value={newNote.noteContent} onBlur={addNote} onChange={(event) => {updateNoteField("noteContent", event.target.value)}}/>
        <TextField
            value={searchParam}
            onChange={handleSearch}
            className="search"
            id="outlined-basic"
            variant="outlined"
            label="Search"
          />
      </div>
      <div className="input-buttons">
        <button className="sign-out btn btn-primary btn-lg" onClick={handleSignOut}><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
      </div>
    </div>
  );
}
