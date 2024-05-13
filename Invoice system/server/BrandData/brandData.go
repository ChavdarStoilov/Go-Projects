package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
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

type Data struct {
	Counters struct {
		InvoiceCounter int64 `json:"invoice_counter"`
		ClientCounter  int64 `json:"client_counter"`
	} `json:"counters"`
	BrandData []BradDataConfig `json:"brandData"`
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

		var TempData Data

		errCounter := db.QueryRow("select (select count(distinct invoice_id) from Invoices) as invoicCounter, (select count(*) from Clients) as client_cnouter;").Scan(&TempData.Counters.InvoiceCounter, &TempData.Counters.ClientCounter)

		if errCounter != nil {
			http.Error(w, errCounter.Error(), http.StatusInternalServerError)
			return
		}
		for rows.Next() {
			var brand BradDataConfig
			if err := rows.Scan(&brand.ID, &brand.Name, &brand.Owner, &brand.Address, &brand.Mail); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			TempData.BrandData = append(TempData.BrandData, brand)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(TempData)
		db.Close()
		return
	}
}

func CreateBrand(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" || r.Method == "OPTIONS" {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		db = connectDB()

		data := new(BradDataConfig)

		err := json.NewDecoder(r.Body).Decode(data)
		if err != nil {
			panic(err)
		}

		sql := fmt.Sprintf("Insert into BrandConfig (Name, Owner, Address, Mail) values ('%v', '%v', '%v', '%v');", data.Name, data.Owner, data.Address, data.Mail)

		rows, err := db.Query(sql)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		json.NewEncoder(w).Encode(data)
		w.WriteHeader(http.StatusCreated)

		return

	}
}

func main() {
	http.HandleFunc("/", DisplayBrandData)
	http.HandleFunc("/create/", CreateBrand)

	log.Fatal(http.ListenAndServe(":8882", nil))

}
