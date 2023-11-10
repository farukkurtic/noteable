import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TextField } from '@mui/material';
import axios from "axios";

export default function LongMenu(props) {

  const userId = props.userId;
  const noteId = props.noteId;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [label, setLabel] = React.useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleBlur = () => {
    try {
        const response = axios.post(`http://localhost:3001/users/label/${userId}/${noteId}`, { label: label });
        setLabel("");
        console.log(response.data);
    } catch(error) {
        console.log("Error:", error);
    }
  }

  return (
    <div className='dots'>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon style={{ color: 'white' }} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <TextField
            className="search"
            id="outlined-basic"
            variant="outlined"
            label="Add label"
            value={label}
            onChange={handleLabelChange}
            onBlur={handleBlur}
            style={{ width: '100%', margin: "0" }}
          />
        </MenuItem>
      </Menu>
    </div>
  );
}
