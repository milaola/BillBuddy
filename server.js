const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const path = require("path");

const PORT = 3000;


app.use(express.json());

app.use(express.static(__dirname));


app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "bill-buddy-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);


const db = new sqlite3.Database("./billbuddy.db", (error) => {

    if (error) {

        console.error("Database error:", error);

    } else {

        console.log("Connected to SQLite database.");

    }

});


db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`, (error) => {

    if (error) {

        console.error(
            "Could not create users table:",
            error
        );

    } else {

        console.log("Users table ready.");

    }

});

app.get("/", (req, res) => {

    res.sendFile(
        __dirname + "/login.html"
    );

});



app.post("/api/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;


      

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill in all fields."
            });

        }

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message: "Please enter your email and password."
        });

    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (error, user) => {

            if (error) {

                console.error(error);

                return res.status(500).json({
                    message: "Database error."
                });

            }

            if (!user) {

                return res.status(401).json({
                    message: "Invalid email or password."
                });

            }

            try {

                const passwordMatches =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!passwordMatches) {

                    return res.status(401).json({
                        message: "Invalid email or password."
                    });

                }

                req.session.userId = user.id;
                req.session.userName = user.name;

                return res.status(200).json({
                    message: "Login successful."
                });

            } catch (error) {

                console.error(error);

                return res.status(500).json({
                    message: "Something went wrong."
                });

            }

        }
    );

});



      
        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });

        }


     

        db.get(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (error, user) => {

                if (error) {

                    console.error(error);

                    return res.status(500).json({
                        message: "Database error."
                    });

                }


                if (user) {

                    return res.status(409).json({
                        message: "An account with that email already exists."
                    });

                }


              

                const hashedPassword =
                    await bcrypt.hash(password, 12);



                db.run(
                    `
                    INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)
                    `,
                    [name, email, hashedPassword],
                    function (error) {

                        if (error) {

                            console.error(error);

                            return res.status(500).json({
                                message: "Could not create account."
                            });

                        }


                  

                        req.session.userId = this.lastID;

                        req.session.userName = name;


                        return res.status(201).json({
                            message: "Account created successfully."
                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});


app.listen(PORT, () => {

    console.log(
        `Bill Buddy server running at http://localhost:${PORT}`
    );

});
