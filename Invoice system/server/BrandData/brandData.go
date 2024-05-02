package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type BradDataConfig struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	Owner   string `json:"owner"`
	Mail    string `json:"mail"`
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

func DisplayBrandData(w http.ResponseWriter, r *http.Request) {

	if r.Method == "GET" || r.Method == "OPTIONS" {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)

			return
		}

		db = connectDB()

		rows, err := db.Query("SELECT * FROM BrandConfig;")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempData []BradDataConfig
		for rows.Next() {
			var brand BradDataConfig
			if err := rows.Scan(&brand.ID, &brand.Name, &brand.Owner, &brand.Address, &brand.Mail); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			tempData = append(tempData, brand)
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(tempData)
		db.Close()
		return
	}
}

func main() {
	http.HandleFunc("/", DisplayBrandData)

	log.Fatal(http.ListenAndServe(":8882", nil))
}
