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

type InvoiceFromDB struct {
	ID        int     `json:"id"`
	Item      string  `json:"items"`
	Quantity  int     `json:"quantity"`
	Status    string  `json:"status"`
	FirstName string  `json:"first_name"`
	LastName  string  `json:"last_name"`
	Amount    float64 `json:"amount"`
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
	if r.Method == "GET" || r.Method == "OPTIONS" {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		db = connectDB()

		rows, err := db.Query(`
			select t.ID, t.Items, t.Quantity, t.Amount, s.status, c.first_name, c.last_name 
		 	from Invoices t 
		 	Inner join status_type s on t.status = s.id 
		 	Inner join Clients c on t.owner = c.id;
		`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempData []InvoiceFromDB
		for rows.Next() {
			var item InvoiceFromDB
			if err := rows.Scan(&item.ID, &item.Item, &item.Quantity, &item.Amount, &item.Status, &item.FirstName, &item.LastName); err != nil {
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
