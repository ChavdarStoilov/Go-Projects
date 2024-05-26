package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

type InvoiceItems struct {
	ID         int64   `json:"id"`
	Item       string  `json:"items"`
	Quantity   int     `json:"quantity"`
	Price      float64 `json:"price"`
	Amount     float64 `json:"amount"`
	Status     int     `json:"status"`
	FirstName  string  `json:"first_name"`
	LastName   string  `json:"last_name"`
	Invoice_id int64   `json:"invoice_id"`
	Owner      int64   `json:"owner"`
	DateField  string  `json:"date"`
}

type InvoiceFromDB struct {
	ID int64 `json:"id"`

	Item       string  `json:"items"`
	Quantity   int     `json:"quantity"`
	Status     string  `json:"status"`
	FirstName  string  `json:"first_name"`
	LastName   string  `json:"last_name"`
	Amount     float64 `json:"amount"`
	Invoice_id int64   `json:"invoice_id"`
}

type ErrorDesc struct {
	Description string `json:"description"`
}

var db *sql.DB

func connectDB() *sql.DB {
	// Change username / password  / DB name
	connectionString := "test:qweqwe__@tcp(localhost:3306)/InvoiceSystem"
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
		var port = strings.Split(r.Header.Get("Origin"), ":")

		if port[2] == "81" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:81")
		} else if port[2] == "5173" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:5173")

		}

		w.Header().Add("Access-Control-Allow-Headers", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		db = connectDB()

		rows, err := db.Query(`
			select i.id, i.invoice_id, i.Items, i.Quantity, sum(i.Amount), s.status, c.first_name, c.last_name 
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
			if err := rows.Scan(&item.ID, &item.Invoice_id, &item.Item, &item.Quantity, &item.Amount, &item.Status, &item.FirstName, &item.LastName); err != nil {
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

		var port = strings.Split(r.Header.Get("Origin"), ":")

		if port[2] == "81" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:81")
		} else if port[2] == "5173" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:5173")

		}

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
			sql += fmt.Sprintf("(%d, '%v', %d, %f, %d, %f, %d)%v", idx+1, data[item].Item, data[item].Quantity, data[item].Price, data[item].Status, data[item].Amount, data[item].Owner, sing)
		}

		rows, errSql := db.Query(sql)

		if errSql != nil {
			http.Error(w, errSql.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var tempInvoiceData InvoiceFromDB

		queryInvoiceData := db.QueryRow(fmt.Sprintf(`
			select i.id, i.invoice_id, i.Items, i.Quantity, sum(i.Amount), s.status, c.first_name, c.last_name 
			from Invoices i 
			Inner join status_type s on i.status = s.id 
			Inner join Clients c on i.owner = c.id 
			where invoice_id = %d 
			GROUP BY i.invoice_id;`, idx+1)).Scan(&tempInvoiceData.ID, &tempInvoiceData.Invoice_id, &tempInvoiceData.Item, &tempInvoiceData.Quantity, &tempInvoiceData.Amount, &tempInvoiceData.Status, &tempInvoiceData.FirstName, &tempInvoiceData.LastName)

		if queryInvoiceData != nil {
			http.Error(w, queryInvoiceData.Error(), http.StatusInternalServerError)
			return
		}

		db.Close()

		json.NewEncoder(w).Encode(tempInvoiceData)
		w.WriteHeader(http.StatusCreated)

		return
	}
}

func GetinvoiceData(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" || r.Method == "OPTIONS" {
		var port = strings.Split(r.Header.Get("Origin"), ":")

		if port[2] == "81" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:81")
		} else if port[2] == "5173" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:5173")

		}

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

		sql := fmt.Sprintf(`
			select i.id, i.invoice_id, i.Items, i.Quantity, i.Price, i.Amount, c.first_name, c.last_name, i.date
				from Invoices i 
				Inner join Clients c on i.owner = c.id 
				where invoice_id = %d;`, intId)

		rows, err := db.Query(sql)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempData []InvoiceItems
		for rows.Next() {
			var item InvoiceItems
			if err := rows.Scan(&item.ID, &item.Invoice_id, &item.Item, &item.Quantity, &item.Price, &item.Amount, &item.FirstName, &item.LastName, &item.DateField); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
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

func DeleteInvoice(w http.ResponseWriter, r *http.Request) {

	if r.Method == "DELETE" || r.Method == "OPTIONS" {

		var port = strings.Split(r.Header.Get("Origin"), ":")

		if port[2] == "81" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:81")
		} else if port[2] == "5173" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:5173")

		}

		w.Header().Add("Access-Control-Allow-Headers", "*")
		w.Header().Add("Access-Control-Allow-Methods", "DELETE")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		id := r.URL.Query().Get("id")

		intId, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			fmt.Println(err)
		}

		queryInvoices := fmt.Sprintf("Delete from Invoices where invoice_id = %d;", intId)

		db = connectDB()

		rowsinvoices, err := db.Query(queryInvoices)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rowsinvoices.Close()
		db.Close()

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("Deleted")

	}

}

func errorHandlerLog(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" || r.Method == "OPTIONS" {
		var port = strings.Split(r.Header.Get("Origin"), ":")

		if port[2] == "81" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:81")
		} else if port[2] == "5173" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:5173")

		}

		w.Header().Add("Access-Control-Allow-Headers", "*")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		var data = new(ErrorDesc)

		err := json.NewDecoder(r.Body).Decode(data)

		if err != nil {
			panic(err)
		}

		db = connectDB()

		rows, err := db.Query(fmt.Sprintf("Insert into error_handler (description) Values ('%v')", data.Description))

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		db.Close()
		json.NewEncoder(w).Encode(data)
		w.WriteHeader(http.StatusCreated)

		return

	}
}

func UpdateStatusInvoice(w http.ResponseWriter, r *http.Request) {
	if r.Method == "PUT" || r.Method == "OPTIONS" {
		var port = strings.Split(r.Header.Get("Origin"), ":")

		if port[2] == "81" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:81")
		} else if port[2] == "5173" {
			w.Header().Add("Access-Control-Allow-Origin", "http://localhost:5173")

		}

		w.Header().Add("Access-Control-Allow-Headers", "*")
		w.Header().Add("Access-Control-Allow-Methods", "PUT")

		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		id := r.URL.Query().Get("id")
		stat := r.URL.Query().Get("stat")

		intId, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			fmt.Println(err)
		}
		intStat, err := strconv.ParseInt(stat, 10, 64)
		if err != nil {
			fmt.Println(err)
		}

		db = connectDB()

		rows, err := db.Query(fmt.Sprintf("Update Invoices set status = %d where invoice_id = %d;", intStat, intId))

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer rows.Close()

		var tempInvoiceData InvoiceFromDB

		invoice := db.QueryRow(fmt.Sprintf(`
		select i.id, i.invoice_id, i.Items, i.Quantity, sum(i.Amount), s.status, c.first_name, c.last_name 
		from Invoices i 
		Inner join status_type s on i.status = s.id 
		Inner join Clients c on i.owner = c.id 
		where invoice_id = %d 
		GROUP BY i.invoice_id;`, intId)).Scan(&tempInvoiceData.ID, &tempInvoiceData.Invoice_id, &tempInvoiceData.Item, &tempInvoiceData.Quantity, &tempInvoiceData.Amount, &tempInvoiceData.Status, &tempInvoiceData.FirstName, &tempInvoiceData.LastName)

		if invoice != nil {
			http.Error(w, invoice.Error(), http.StatusInternalServerError)
			return
		}

		db.Close()
		json.NewEncoder(w).Encode(tempInvoiceData)
		w.WriteHeader(http.StatusCreated)

		return

	}

}
func main() {

	http.HandleFunc("/", DisplayAllInvoices)
	http.HandleFunc("/create/", CraeteNewInvoice)
	http.HandleFunc("/get_invoice", GetinvoiceData)
	http.HandleFunc("/delete", DeleteInvoice)
	http.HandleFunc("/error/", errorHandlerLog)
	http.HandleFunc("/update-status", UpdateStatusInvoice)

	log.Fatal(http.ListenAndServe(":8883", nil))
}
