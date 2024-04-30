package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Invoice struct {
	ID int `json:"id"`
}

type InvoiceItems struct {
	Invoice  Invoice `json:"invoice_id"`
	ID       int     `json:"id"`
	Item     string  `json:"item"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
	Amount   float64 `json:"amount"`
}

var invoices = []InvoiceItems{
	{Invoice: Invoice{ID: 1}, ID: 1, Item: "Oil filter", Quantity: 1, Price: 20.10, Amount: 20.10},
	{Invoice: Invoice{ID: 2}, ID: 1, Item: "Oil filter", Quantity: 1, Price: 20.10, Amount: 20.10},
}

func DisplayAllInvoices(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(invoices)

	}
}

func main() {

	http.HandleFunc("/", DisplayAllInvoices)

	log.Fatal(http.ListenAndServe(":8883", nil))
}
