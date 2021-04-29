package main

import (
	"log"
	"net/http"

	"github.com/darinmilner/gowebsocketschat/internal/handlers"
)

func main() {
	routes := routes()

	log.Println("Starting channel listener")
	go handlers.ListenToWebSocketChannel()

	log.Println("Starting server on port 3001")

	err := http.ListenAndServe(":3001", routes)
	log.Println(err)
}
