import express from "express";
import cors from "cors";
//import mongoose in nodejs in es6?
import mongoose from "mongoose";

//create express app?
const app = express();
//use cors in nodejs?
app.use(cors());
//app.use(express.json()) is used in Express to automatically parse incoming JSON data in the body of HTTP requests. It converts the JSON data into a JavaScript object, which you can then access using req.body. This is helpful when you want to handle data sent by clients in JSON format, like from a frontend form or API request.
app.use(express.json());
const PORT = process.env.PORT || 3000;

//give mongoose connect in nodejs but dont give useNewUrlParser and unified topology as it is deprecated?
const dbURI =
  "mongodb+srv://borateadwait:jlCp3VJP4RzIuH7Q@cluster0.3gzsx.mongodb.net/userdb?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

//create a schema using mongoose having name :string,email:string,mobile:number,and also give me timestamp true?
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//now create the model for the above schema mentioned?
const User = mongoose.model("User", userSchema);

//give me an api async method to find  and return json object?
//read data in db
//create a user and save in db
app.post("/create", async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and mobile",
      });
    }

    const newUser = new User({
      name,
      email,
      mobile,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({
      success: false,
      message: "Error saving user",
      error: err.message,
    });
  }
});

//give me api with update endpoint that updates the as per above schema and model?
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  try {
    // Trim any extra spaces or newlines from the ID
    const updatedUser = await User.findByIdAndUpdate(
      id.trim(),
      { name, email, age },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // Print success message in console if user updated successfully
    console.log(`User with ID: ${id}updated successfully!`);

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error); 
    res.status(400).send({ message: "Error updating user", error });
  }
});

// Read user by ID
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id.trim()); // Trim any extra spaces or newlines

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error); 
    res.status(400).json({ message: "Error fetching user", error });
  }
});

// Read all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error to the console
    res.status(400).json({ message: "Error fetching users", error });
  }
});

//delete api
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id.trim());
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(400).json({ message: "Error deleting user", error });
  }
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
