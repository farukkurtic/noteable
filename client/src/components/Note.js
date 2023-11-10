import Dots from "./mui/Dots";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { useAppContext } from "../AppContext";

export default function Note(props) {

    const user_id = props.user_id;
    const note_id = props.note_id;
    const { selectedLabel, setSelectedLabel } = useAppContext();

    const handleDelete = (event) => {
        try {
          const label = event.target.closest('[data-label]').dataset.label;
          const response = axios.post(`http://localhost:3001/users/label/remove/${user_id}/${note_id}`, { label: label });
          console.log(response.data);
        } catch (error) {
          console.log("Error:", error);
        }
    }

    const handleClick = (label) => {
        try {
            if(label === selectedLabel) {
                setSelectedLabel("");
            } else {
                setSelectedLabel(label);
            }
        } catch(error) {
            console.log("Error:", error);
        }
    }

    return (
        <div className="note">
            <div className="note-header">
                <div className="dot-container">
                    <h1>{props.title}</h1>
                    <Dots userId={user_id} noteId={note_id} />
                </div>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    <i class="fa-regular fa-trash-can" onClick={props.onTrashClick}></i>
                    <span class="visually-hidden">unread messages</span>
                </span>
            </div>
            <div className="note-content" onClick={props.onModalClick}>
                <p>{props.content}</p>
                <p className="note-date">{props.date}</p>
                <p className="note-edited">{props.edited && "Edited"}</p>
            </div>
            <div className="note-labels">
                {props.labels.map(function(labelName) {
                    return (
                        <Chip
                            label={`${labelName}`}
                            data-label={labelName}
                            variant="outlined"
                            clickable
                            onDelete={(event) => handleDelete(event)}
                            onClick={() => handleClick(labelName)}
                            className="chip"
                        />
                    );
                })}
            </div>
        </div>
    );
}