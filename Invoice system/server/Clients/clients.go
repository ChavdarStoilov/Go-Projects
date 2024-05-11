package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type Clients struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
}

var db *sql.DB

func connectDB() *sql.DB {
	// Change username / password  / DB name
	connectionString := "test:qweqwe__@tcp(localhost:3306)/TestDB"
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func DisplayAllClients(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" || r.Method == "OPTIONS" {

		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		db = connectDB()
		rows, err := db.Query("SELECT * FROM Clients;")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempData []Clients
		for rows.Next() {
			var cli Clients
			if err := rows.Scan(&cli.ID, &cli.FirstName, &cli.LastName, &cli.Phone); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			tempData = append(tempData, cli)
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(tempData)
		db.Close()
	}

}

func CreateNewClient(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" || r.Method == "OPTIONS" {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {

			w.WriteHeader(http.StatusOK)
			return
		}

		data := new(Clients)

		err := json.NewDecoder(r.Body).Decode(data)

		if err != nil {
			panic(err)
		}

		quary := fmt.Sprintf("Insert into Clients (First_name, Last_name, Phone) values ('%v', '%v' , '%v')", data.FirstName, data.LastName, data.Phone)

		db = connectDB()

		cursor, errInsert := db.Query(quary)

		if errInsert != nil {
			http.Error(w, errInsert.Error(), http.StatusInternalServerError)
			return
		}

		cursor.Close()

		json.NewEncoder(w).Encode(data)
		w.WriteHeader(http.StatusCreated)

	}

}

func main() {

	http.HandleFunc("/", DisplayAllClients)
	http.HandleFunc("/create/", CreateNewClient)

	log.Fatal(http.ListenAndServe(":8881", nil))
}
