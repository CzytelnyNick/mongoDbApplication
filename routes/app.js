const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");

// Adres połączenia z MongoDB
const uri = "mongodb://localhost:27017/";

// Tworzymy instancję MongoClient, aby połączyć się z MongoDB
const client = new MongoClient(uri);

// Utrzymywanie połączenia z MongoDB
let db;
let usersCollection;

client.connect()
  .then(() => {
    console.log("Połączono z MongoDB");
    db = client.db("ludzie");
    usersCollection = db.collection("users");
  })
  .catch((error) => {
    console.error("Błąd połączenia z MongoDB:", error);
  });

// Strona główna
router.get("/", (req, res) => {
  res.render("home", { title: "Strona główna" });
});

// Formularz dodawania użytkownika
router.get("/add", (req, res) => {
  res.render("add");
});

// Funkcja dodająca użytkownika
router.post("/addFunc", async (req, res) => {
  const user = req.body.user; // Pobieramy użytkownika z formularza
  console.log("Dane użytkownika:", user);

  try {
    // Wstawienie danych do MongoDB
    await usersCollection.insertOne({ name: user});
    console.log("Użytkownik dodany do bazy");
    
    // Przekierowanie na stronę 'load'
    res.redirect("/load");
  } catch (error) {
    console.error("Błąd podczas dodawania użytkownika:", error);
    res.status(500).send("Wystąpił błąd podczas dodawania użytkownika");
  }
});

// Ładowanie użytkowników
router.get("/load", async (req, res) => {
  try {
    // Pobieramy wszystkich użytkowników z bazy
    const users = await usersCollection.find().toArray();
    console.log("Załadowani użytkownicy:", users);

    // Renderowanie widoku 'load' z danymi użytkowników
    res.render("load", { userTab: users });
  } catch (error) {
    console.error("Błąd podczas ładowania użytkowników:", error);
    res.status(500).send("Wystąpił błąd podczas ładowania użytkowników");
  }
});

module.exports = router;