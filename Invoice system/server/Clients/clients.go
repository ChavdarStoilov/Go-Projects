package main

import (
	"database/sql"
	"encoding/json"
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
	connectionString := "username:password@tcp(localhost:3306)/DB name"
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func DisplayAllClients(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		db = connectDB()

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

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

func main() {

	http.HandleFunc("/", DisplayAllClients)
	log.Fatal(http.ListenAndServe(":8881", nil))
}
