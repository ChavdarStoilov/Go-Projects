package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type BradDataConfig struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	Owner   string `json:"owner"`
	Mail    string `json:"mail"`
}

var brand = &BradDataConfig{
	ID:      1,
	Name:    "Volvo",
	Address: "Sofia, Pliska 2",
	Owner:   "Pesho Peevski",
	Mail:    "pesho.peevski@gmail.com",
}

func DisplayBrandData(w http.ResponseWriter, r *http.Request) {

	if r.Method == "GET" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(brand)
	}
}

func main() {

	http.HandleFunc("/", DisplayBrandData)

	log.Fatal(http.ListenAndServe(":8882", nil))
}
