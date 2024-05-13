package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

type InvoiceItems struct {
	ID         int64   `json:"id"`
	Item       string  `json:"items"`
	Quantity   int     `json:"quantity"`
	Price      float64 `json:"price"`
	Amount     float64 `json:"amount"`
	Status     int     `json:"status"`
	Invoice_id int64   `json:"invoice_id"`
}

type InvoiceFromDB struct {
	Item       string  `json:"items"`
	Quantity   int     `json:"quantity"`
	Status     string  `json:"status"`
	FirstName  string  `json:"first_name"`
	LastName   string  `json:"last_name"`
	Amount     float64 `json:"amount"`
	Invoice_id int64   `json:"invoice_id"`
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

func GetLastInvoiceIdx() (int64, error) {
	var idx int64
	err := db.QueryRow("select ifnull(max(invoice_id), 0) from Invoices;").Scan(&idx)
	if err != nil {
		return -1, fmt.Errorf(err.Error())
	}

	return idx, nil
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
			select i.invoice_id, i.Items, i.Quantity, sum(i.Amount), s.status, c.first_name, c.last_name 
				from Invoices i 
				Inner join status_type s on i.status = s.id 
				Inner join Clients c on i.owner = c.id 
				GROUP BY i.invoice_id;
		`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempData []InvoiceFromDB
		for rows.Next() {
			var item InvoiceFromDB
			if err := rows.Scan(&item.Invoice_id, &item.Item, &item.Quantity, &item.Amount, &item.Status, &item.FirstName, &item.LastName); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			tempData = append(tempData, item)
		}

		if len(tempData) > 0 {
			json.NewEncoder(w).Encode(tempData)
			w.WriteHeader(http.StatusOK)

		}
		w.WriteHeader(http.StatusNoContent)

		db.Close()

	}
}

func CraeteNewInvoice(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" || r.Method == "OPTIONS" {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		var data []InvoiceItems

		body, err := io.ReadAll(r.Body)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		errJson := json.Unmarshal(body, &data)

		if errJson != nil {
			http.Error(w, errJson.Error(), http.StatusInternalServerError)
			return
		}

		db = connectDB()

		idx, errIdx := GetLastInvoiceIdx()

		if errIdx != nil {
			http.Error(w, errIdx.Error(), http.StatusInternalServerError)
			return
		}

		var sql = "Insert into Invoices (invoice_id, Items, Quantity, Price , status, Amount, owner) values "

		for item := range data {
			var sing string
			if item+1 == len(data) {
				sing = ";"
			} else {
				sing += ","
			}
			sql += fmt.Sprintf("(%d, '%v', %d, %f, %d, %f, %d)%v", idx+1, data[item].Item, data[item].Quantity, data[item].Price, data[item].Status, data[item].Amount, 1, sing)
		}

		rows, errSql := db.Query(sql)

		if errSql != nil {
			http.Error(w, errSql.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		json.NewEncoder(w).Encode(data)
		w.WriteHeader(http.StatusCreated)

		return
	}
}

func GetinvoiceData(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" || r.Method == "OPTIONS" {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		id := r.URL.Query().Get("id")

		intId, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			fmt.Println(err)
		}

		db = connectDB()

		sql := fmt.Sprintf("select i.ID, i.invoice_id, i.Items, i.Quantity, i.Price, i.Amount from Invoices i where i.invoice_id = %d;", intId)

		rows, err := db.Query(sql)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempData []InvoiceItems
		for rows.Next() {
			var item InvoiceItems
			if err := rows.Scan(&item.ID, &item.Invoice_id, &item.Item, &item.Quantity, &item.Price, &item.Amount); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			tempData = append(tempData, item)
		}

		if len(tempData) > 0 {
			json.NewEncoder(w).Encode(tempData)
			w.WriteHeader(http.StatusOK)

		}

		w.WriteHeader(http.StatusNoContent)

		db.Close()
	}
}

func main() {

	http.HandleFunc("/", DisplayAllInvoices)
	http.HandleFunc("/create/", CraeteNewInvoice)
	http.HandleFunc("/get_invoice", GetinvoiceData)

	log.Fatal(http.ListenAndServe(":8883", nil))
}
