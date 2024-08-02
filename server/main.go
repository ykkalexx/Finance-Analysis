package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/ykkalexx/nameless/routes"
)

func main() {
	fmt.Println("Starting server");
	app := fiber.New()
	
	routes.ApiRoutes(app);

	log.Fatal(app.Listen(":3000"));
}