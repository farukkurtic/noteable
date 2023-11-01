import React, { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import InputNote from "./InputNote";
import Note from "./Note";
import NoNotes from "./NoNotes";
import Footer from "./Footer";

import { useAppContext } from "../AppContext";

export default function Dashboard(props) {
  const [selectedNote, setSelectedNote] = useState({id: null, title: "", content: ""});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cookies] = useCookies(["userID"]);
  const userId = cookies.userID;

  const { searchParam } = useAppContext();

  const [userData, setUserData] = useState();
  useEffect(function () {
    if (userId) {
      const fetchUserData = async function () {
        try {
          const response = await axios.get(`http://localhost:3001/users/${userId}`);
          setUserData(response.data);
        } catch (error) {
          console.log("Error:", error);
        }
      };
      fetchUserData();
    }
  }, [cookies.userID, userData?.notes]);

  function openModal(note) {
    setSelectedNote({
      id: note._id,
      title: note.title,
      content: note.content
    });
    setIsModalOpen(true);
  }

  const closeModal = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/api/edit/${userId}`, selectedNote); 
      console.log(selectedNote);
    } catch (error) {
      console.log("Error:", error);
    }
    setIsModalOpen(false);
  }

  async function handleClick(note_id) {
    try {
      const response = await axios.post(`http://localhost:3001/delete/${userId}/${note_id}`);
      console.log(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function handleTitleChange(event) {
    const updatedNote = { ...selectedNote };
    updatedNote.title = event.target.value;
    setSelectedNote(updatedNote);
  }

  function handleContentChange(event) {
    const updatedNote = { ...selectedNote };
    updatedNote.content = event.target.value;
    setSelectedNote(updatedNote);
  }

  const filteredNotes = userData?.notes.filter(function(note) {
    const title = note.title ? note.title.toLowerCase() : ""; // Check if note.title is defined
    const content = note.content ? note.content.toLowerCase() : ""; // Check if note.content is defined
    const searchItem = searchParam ? searchParam.toLowerCase() : ""; // Check if searchParam is defined
  
    return title.includes(searchItem) || content.includes(searchItem);
  });
  

  return (
    <div className="dashboard">
      <InputNote />
      {userData?.notes.length !== 0 ? (
        <div className="grid-container">
          {filteredNotes?.map(function (userObj, index) {
            return (
              <div key={userObj._id} className="grid-item">
                <Note
                  title={userObj.title}
                  content={userObj.content}
                  date={userObj.createdAt}
                  onTrashClick={() => handleClick(userObj._id)}
                  onModalClick={() => openModal(userObj)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <NoNotes />
      )}
      <Footer/>

      <div className="modal" tabIndex="-1" role="dialog" style={{ display: isModalOpen ? "block" : "none" }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
          <div className="modal-header">
            <input
              type="text"
              value={selectedNote ? selectedNote.title : ""}
              onChange={handleTitleChange}
            />
            <button type="button" className="close" onClick={closeModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <textarea
              value={selectedNote ? selectedNote.content : ""}
              onChange={handleContentChange}
            />
          </div>
          </div>
        </div>
      </div>

      <div className={`modal-backdrop fade ${isModalOpen ? "show" : ""}`} style={{ display: isModalOpen ? "block" : "none" }}></div>
    </div>
  );
}
