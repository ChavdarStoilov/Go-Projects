package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

// Base DB

var data []Tasks

// Tables
type Tasks struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Status_id int    `json:"status_id"`
}

var TaskID int64 = 0

// Views

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, World!")

	fmt.Printf("status: %v Method: %v", r.Response.StatusCode, r.Method)

}

func displayTasks(w http.ResponseWriter, r *http.Request) {

	if r.Method == "GET" || r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		if len(data) > 0 {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(data)

		} else {
			w.WriteHeader(http.StatusNoContent)
			json.NewEncoder(w).Encode(data)

		}

		return

	}

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(w, "Method not allowed!")

	// fmt.Printf("tatus: %v Method: %v", r.Response.StatusCode, r.Method)

}

func createTask(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" || r.Method == "OPTIONS" {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return

		}

		task := new(Tasks)

		err := json.NewDecoder(r.Body).Decode(task)
		if err != nil {
			panic(err)
		}

		task.ID = TaskID + 1

		TaskID = task.ID

		data = append(data, *task)

		w.WriteHeader(http.StatusCreated)

		return
	}
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(w, "Method not allowed!")

	// fmt.Printf("Status: %v Method: %v", r.Response.StatusCode, r.Method)

}

func modifyTask(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" || r.Method == "OPTIONS" {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
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

		status_id := r.URL.Query().Get("status_id")
		intStatus_id, err := strconv.Atoi(status_id)
		if err != nil {
			fmt.Println(err)
		}

		for i := 0; i < len(data); i++ {

			row := &data[i]

			if row.ID == intId {
				row.Status_id = intStatus_id
				json.NewEncoder(w).Encode(row)
				return
			}

		}

	}
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(w, "Method not allowed!")

}

func deleteTask(w http.ResponseWriter, r *http.Request) {

}

// Urls

func urls() {
	http.HandleFunc("/", home)
	http.HandleFunc("/tasks/", displayTasks)
	http.HandleFunc("/create_task/", createTask)
	http.HandleFunc("/modify_task", modifyTask)
	http.HandleFunc("/delete_task", deleteTask)

}

// Main server start
func main() {

	urls()
	log.Fatal(http.ListenAndServe(":8080", nil))
}
