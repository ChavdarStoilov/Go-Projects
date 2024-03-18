package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
)

//  HTTP request Info

type HTTPReqInfo struct {
	method    string
	uri       string
	referer   string
	ipaddr    string
	code      int
	userAgent string
}

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

func displayTasks(w http.ResponseWriter, r *http.Request) {

	request := &HTTPReqInfo{
		method:    r.Method,
		uri:       r.URL.String(),
		referer:   r.Header.Get("Referer"),
		userAgent: r.Header.Get("User-Agent"),
	}

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

		request.code = http.StatusOK

		fmt.Printf("%v: %v %v %v %v\n", time.Now().Format("2006-01-02 15:04:05"), request.uri, request.method, request.code, request.userAgent)

		return

	}

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(w, "Method not allowed!")

	fmt.Printf("%v: %v %v %v %v\n", time.Now().Format("2006-01-02 15:04:05"), request.uri, request.method, request.code, request.userAgent)

}

func createTask(w http.ResponseWriter, r *http.Request) {

	request := &HTTPReqInfo{
		method:    r.Method,
		uri:       r.URL.String(),
		referer:   r.Header.Get("Referer"),
		userAgent: r.Header.Get("User-Agent"),
	}

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

		fmt.Printf("%v: %v %v %v %v\n", time.Now().Format("2006-01-02 15:04:05"), request.uri, request.method, request.code, request.userAgent)

		return
	}
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(w, "Method not allowed!")

	fmt.Printf("%v: %v %v %v %v\n", time.Now().Format("2006-01-02 15:04:05"), request.uri, request.method, request.code, request.userAgent)

}

func modifyTask(w http.ResponseWriter, r *http.Request) {

	request := &HTTPReqInfo{
		method:    r.Method,
		uri:       r.URL.String(),
		referer:   r.Header.Get("Referer"),
		userAgent: r.Header.Get("User-Agent"),
	}

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

				fmt.Printf("%v: %v %v %v %v\n", time.Now().Format("2006-01-02 15:04:05"), request.uri, request.method, request.code, request.userAgent)

				return
			}

		}

	}
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(w, "Method not allowed!")

	fmt.Printf("%v: %v %v %v %v\n", time.Now().Format("2006-01-02 15:04:05"), request.uri, request.method, request.code, request.userAgent)

}

func deleteTask(w http.ResponseWriter, r *http.Request) {

}

// Urls

func urls() {
	http.HandleFunc("/tasks/", displayTasks)
	http.HandleFunc("/create_task/", createTask)
	http.HandleFunc("/modify_task", modifyTask)
	http.HandleFunc("/delete_task", deleteTask)

}

// Main server start
func main() {

	urls()
	log.Fatal(http.ListenAndServe(":8888", nil))
}
