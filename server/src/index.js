const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const User = require("./models/Users.js");

const dotenv = require("dotenv");
dotenv.config(); 

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/auth/check/:email", async function(req, res) {
    const { email } = req.params;
    const user = await User.findOne({email});
    if(user) {
        res.json({exists: true});
    } else {
        res.json({exists: false});
    }
});

app.post("/auth/register", async function (req, res) {
    const { firstName, lastName, email, password } = req.body;

    try {
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      newUser
        .save()
        .then(function (savedUser) {
          console.log("User registered:", savedUser);
          res.json(savedUser._id);
        })
        .catch(function (error) {
          console.log("An error occurred while registering the user:", error);
          res.status(500).send("Error registering the user");
        });
    } catch (error) {
      console.log("An error occurred while hashing the password:", error);
      res.status(500).send("Error registering the user");
    }
});

app.post("/auth/login", async function(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const userId = user._id;
            res.json(userId);
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
        

    } catch(error) {
        console.log("Error:", error);
    }

});

app.post("/api/notes/:userID", async function(req, res) {
    const userId = req.params.userID;
    const {noteTitle, noteContent} = req.body;

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const note = {title: noteTitle, content: noteContent};
        user.notes.push(note);

        await user.save();
        res.status(201).json(note);

    } catch (error) {
        console.log("Error:", error);
    }
});

app.post("/api/edit/:userID", async function (req, res) {
    const userId = req.params.userID;
    const { id, title, content } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const note = user.notes.id(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
        
      if(note) {
        if(note.title === title && note.content === content) {
          res.json(false);
        } else {
          note.title = title;
          note.content = content;
          note.edited = true;

          await user.save();
      
          res.json(true); 
        }
      } else {
        return res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error updating the note", error: error.message });
    }
  });
  
app.post("/delete/:userID/:noteID", async function(req, res) {
    const userId = req.params.userID;
    const noteId = req.params.noteID;

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        user.notes = user.notes.filter(note => note._id != noteId);
        await user.save();
        res.status(201).json({message: "Note deletes successfully"});
        
    } catch(error) {
        console.log("Error:", error);
    }
});

app.get("/users/:userID", async function(req, res) {
    const userId = req.params.userID;

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.json(user);

    } catch(error) {
        console.log("Error:", error);
    }
});

app.post("/users/label/:userID/:noteID", async function(req, res) {
  
  const userID = req.params.userID;
  const noteID = req.params.noteID;
  const label = req.body.label;

  try {
    const user = await User.findById(userID);

    if(!user) {
      return res.status(404).json({message: "User not found"});
    } 

    const note = user.notes.id(noteID);
    if(!note) {
      res.status(404).json({message: "Note not found"});
    }

    const isLabelExists = note.labels.includes(label);
    if(isLabelExists) {
      res.json({message: "label exists"});
    } else {
        if(note && label != "") {
          note.labels.push(label);
          await user.save();
          res.json(true);
        } else {
          res.json(false);
        } 
    }

  } catch(error) {
    console.log("Error:", error);
  }

});

app.post("/users/label/remove/:userID/:noteID", async function(req, res) {

  const userId = req.params.userID;
  const noteId = req.params.noteID;
  const label = req.body.label;

  try {

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const note = user.notes.id(noteId);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
    } else {
      note.labels = note.labels.filter((labell) => labell !== label);
      await user.save();
      res.json(true);
    }

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});

const port = 3001;
app.listen(port, function (req, res) {
    console.log("Server listening on port", port);
});
