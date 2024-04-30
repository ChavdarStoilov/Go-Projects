package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Clients struct {
	ID        int    `json:"id"`
	FirstName string `json:"first name"`
	LastName  string `json:"last name"`
	Phone     string `json:"phone"`
}

var clients = []Clients{
	{ID: 1, FirstName: "Blue", LastName: "Coltrane", Phone: "+359 888 112 424"},
	{ID: 2, FirstName: "Jeru", LastName: "Mulligan", Phone: "+359 888 542 314"},
	{ID: 3, FirstName: "Sarah", LastName: "Vaughan", Phone: "+359 888 416 214"},
}

func DisplayAllClients(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(clients)

	}
}

func main() {
	http.HandleFunc("/", DisplayAllClients)
	log.Fatal(http.ListenAndServe(":8881", nil))
}
