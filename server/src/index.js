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

// check if user exists
app.get("/auth/check/:email", async function(req, res) {
    const { email } = req.params;
    const user = await User.findOne({email});
    if(user) {
        res.json({exists: true});
    } else {
        res.json({exists: false});
    }
});

// registration
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

// login
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

// add note 
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
  
      const note = user.notes.id(id); // Find the note by its _id
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      // Ensure that the note object exists before accessing its properties
      if (note) {
        note.title = title;
        note.content = content;
  
        await user.save();
  
        res.json({ message: "Note updated successfully" });
      } else {
        return res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error updating the note", error: error.message });
    }
  });
  
  

// delete note
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

// get user data
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


// start the server
const port = 3001;
app.listen(port, function (req, res) {
    console.log("Server listening on port", port);
});
