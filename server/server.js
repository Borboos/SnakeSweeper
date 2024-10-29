import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const port = 5000;

env.config();
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

async function cookieAuth(req, res, next) {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(400).json({ error: "No token" });
  }
  const userQ = await db.query(
    `SELECT * FROM users WHERE token= '${cookies.jwt}';`
  );
  if (userQ.rows.length === 0) {
    return res.status(400).json({ error: "No user with cookie token" });
  }
  jwt.verify(cookies.jwt, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Cookie expired" });
    }
    req.user = decoded;
    next();
  });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/leaderboard", async (req, res) => {
  const snakeScoreQ = await db.query(
    `SELECT users.username, snakescores.score
    FROM snakescores 
    INNER JOIN users ON snakescores.email=users.email
    ORDER BY snakescores.score DESC;`
  );
  const mineScoreQ = await db.query(
    `SELECT users.username, minesweeperscores.score
    FROM minesweeperscores
    INNER JOIN users ON minesweeperscores.email=users.email
    ORDER BY minesweeperscores.score ASC;`
  );
  const scoreData = {
    snakeScores: snakeScoreQ.rows,
    minesweeperScores: mineScoreQ.rows,
  };
  return res.status(200).json(scoreData);
});

app.post("/register", async (req, res) => {
  const checkEmail = await db.query(
    `SELECT * FROM users WHERE email = '${req.body.email}';`
  );
  if (checkEmail.rows.length > 0) {
    return res.status(400).json({ error: "Email already taken" });
  }
  const checkUsername = await db.query(
    `SELECT * FROM users WHERE username = '${req.body.username}';`
  );
  if (checkUsername.rows.length > 0) {
    return res.status(400).json({ error: "Username already taken" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await db.query(
    `INSERT INTO users (email, username, password)
     VALUES('${req.body.email}', '${req.body.username}', '${hashedPassword}')`
  );
  return res.status(200).json({ message: "User added" });
});

app.post("/login", async (req, res) => {
  const userQ = await db.query(
    `SELECT * FROM users WHERE email= '${req.body.email}';`
  );
  if (userQ.rows.length === 0) {
    return res
      .status(400)
      .json({ error: "Account associated with given email does not exist" });
  }
  const user = userQ.rows[0];
  const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordsMatch) {
    return res.status(400).json({
      error: "Entered password does not match that of associated email",
    });
  }
  const token = jwt.sign(
    { email: user.email, username: user.username },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  await db.query(
    `UPDATE users
    SET token = '${token}'
    WHERE email = '${user.email}';`
  );
  return res
    .cookie("jwt", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60,
    })
    .json({ message: "Login successful" });
});

app.get("/logout", cookieAuth, async (req, res) => {
  const user = req.user;
  await db.query(
    `UPDATE users 
    SET token = NULL
    WHERE email = '${user.email}';`
  );
  return res
    .status(204)
    .clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
    .json({ message: "User token cleared, cookie cleared" });
});

app.get("/account", cookieAuth, async (req, res) => {
  const user = req.user;
  const minesweeperScoresQ = await db.query(
    `SELECT score
    FROM minesweeperscores
    INNER JOIN users ON minesweeperscores.email=users.email
    WHERE users.email = '${user.email}'
    ORDER BY score ASC;`
  );
  const snakeScoresQ = await db.query(
    `SELECT score
    FROM snakescores 
    INNER JOIN users ON snakescores.email=users.email 
    WHERE users.email = '${user.email}'
    ORDER BY score DESC;`
  );
  const minesweeperScores =
    minesweeperScoresQ.rows.length > 0
      ? minesweeperScoresQ.rows.map(e => e.score)
      : [];
  const snakeScores =
    snakeScoresQ.rows.length > 0 ? snakeScoresQ.rows.map(e => e.score) : [];
  let scores = { minesweeperScores, snakeScores };
  return res
    .status(200)
    .json({ email: user.email, username: user.username, scores });
});

app.post("/account", cookieAuth, async (req, res) => {
  const user = req.user;
  const alreadyExistsQ = await db.query(
    `SELECT * FROM users WHERE username='${req.body.username}'`
  );
  console.log(req.body.username);
  if (!req.body.username) {
    return res.status(400).json({ error: "Username field is required" });
  }
  if (alreadyExistsQ.rows.length > 0) {
    return res.status(400).json({ error: "Username already taken" });
  }
  await db.query(
    `UPDATE users 
    SET username='${req.body.username}' 
    WHERE email='${user.email}'`
  );
  return res.status(200).json({ message: "Username updated" });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
