package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type Invoice struct {
	ID int `json:"id"`
}

type InvoiceItems struct {
	Invoice  Invoice `json:"invoice_id"`
	ID       int     `json:"id"`
	Item     string  `json:"items"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
	Amount   float64 `json:"amount"`
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

func DisplayAllInvoices(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		db = connectDB()

		rows, err := db.Query("SELECT * FROM Invoices;")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempData []InvoiceItems
		for rows.Next() {
			var item InvoiceItems
			if err := rows.Scan(&item.Invoice.ID, &item.ID, &item.Item, &item.Quantity, &item.Price, &item.Amount); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			tempData = append(tempData, item)
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(tempData)

		db.Close()

	}
}

func main() {

	http.HandleFunc("/", DisplayAllInvoices)

	log.Fatal(http.ListenAndServe(":8883", nil))
}
