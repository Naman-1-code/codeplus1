
const express =require("express");
const path = require("path");
const app=express();

const port =8080;

app.listen(port,()=>{
    console.log("hey boss!! server is working");
});


app.set("view engiune","ejs");
app.set("views",path.join(__dirname,"view"));
app.use (express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting up mysql
const mysql = require('mysql2');
const db = require('./db'); // adjust path if in different folder






// session for hiii uername
const session = require("express-session");

app.use(session({
  secret: 'yourSecretKey123',
  resave: false,
  saveUninitialized: true
}));




app.get("/",(req,res)=>{
     const username = req.session.username || null;
   
  res.render("index.ejs", { username });
      
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [[user]] = await db.promise().query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (!user) {
      return res.send(" Invalid username or password.");
    }

    req.session.username = user.username;

     //  Show register.ejs after login
    res.render("register.ejs", { username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal Server Error");
  }
});
   





let leaf = 0;  // Server-side storage (global for now)

app.get("/update-leaf", (req, res) => {
    leaf = parseInt(req.query.leaf) || 0;
    console.log(leaf);
    console.log("Received leaf value from client:", leaf);
   res.send("Leaf value updated successfully.");
});

app.get("/reward", async (req, res) => {
  const username = req.session.username;
  if (!username) return res.redirect("/login");

  try {
    const [[user]] = await db.promise().query(
      "SELECT id, leaf FROM users WHERE username = ?",
      [username]
    );

    // Reset leaf to 0 if it reached 5
    if (user.leaf >= 5) {
      await db.promise().query(
        "UPDATE users SET leaf = 0 WHERE id = ?",
        [user.id]
      );
      return res.render("reward2.ejs");
    } else {
      return res.render("reward1.ejs");
    }
  } catch (err) {
    console.error("Error rendering reward:", err);
    res.status(500).send("Internal Server Error");
  }
});



    




// storing data from resgister
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    await db.promise().query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    // Set session
    req.session.username = username;
    res.redirect("/profile");
  } catch (err) {
    console.error(" Registration error:", err);
    res.status(500).send("Registration failed. Username may already exist.");
  }
});



// route for earned-leaf
app.get("/earned-leaf", (req, res) => {
  if (!req.session.username) return res.redirect("/login");
  
  res.render("earned-leaf.ejs", {
    username: req.session.username
  });
});


//  Route to set test session manually (for testing)
// app.get("/settestuser", (req, res) => {
//   req.session.username = "naman";
//   res.send(" Test user session set!");
// });


app.post("/submit-progress", async (req, res) => {
  const username = req.session.username;
  const workdone = parseInt(req.body.workdone);

  if (!username) return res.redirect("/login");

  try {// 1. Get user ID from username
    const [[user]] = await db.promise().query(
      "SELECT id, leaf FROM users WHERE username = ?",
      [username]
    );
    const userId = user.id;
    
    // 2. Get the latest day number
    const [[lastProgress]] = await db.promise().query(
      "SELECT MAX(day) as lastDay FROM progress WHERE user_id = ?",
      [userId]
    );
   
    const nextDay = (lastProgress.lastDay || 0) + 1;

     // 3. Insert new progress entry
    await db.promise().query(
      "INSERT INTO progress (user_id, day, workdone) VALUES (?, ?, ?)",
      [userId, nextDay, workdone]
    );
   // on click in progress =100% (getting leaf)
    if (workdone === 100) {
      await db.promise().query(
        "UPDATE users SET leaf = leaf + 1 WHERE id = ?",
        [userId]
      );
      // Redirect to a celebration page
      return res.redirect("/earned-leaf");
    }
  
    //redirect to profile
    res.redirect("/profile");
  } catch (err) {
    console.error("Error submitting progress:", err);
    res.status(500).send("Internal Server Error");
  }
});


   
/// profile working  -
app.get("/profile", async (req, res) => {
  const username = req.session.username;

  if (!username) {
    return res.redirect("/login");
  }

  try {
    const [user] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    //  Check if user was found
    if (user.length === 0) {
      return res.status(404).send("User not found");
    }

    const [progress] = await db.promise().query(
      "SELECT day, workdone FROM progress WHERE user_id = ? ORDER BY day ASC",
      [user[0].id]
    );

    res.render("profile.ejs", {
      username: username,
      leaf: user[0].leaf,
      rewards: user[0].reward_collected,
      progressData: progress,
    });
  } catch (err) {
    console.error(" Error fetching profile data:", err);
    res.status(500).send("Internal Server Error");
  }
});

// reseting profile graph 
app.get("/reset-progress", async (req, res) => {
  const username = req.session.username;
  if (!username) return res.redirect("/login");

  const [user] = await db.promise().query(
    "SELECT id FROM users WHERE username = ?",
    [username]
  );
  const userId = user[0].id;

  await db.promise().query("DELETE FROM progress WHERE user_id = ?", [userId]);
  res.send(" Progress reset. Start from Day 1!");
});
