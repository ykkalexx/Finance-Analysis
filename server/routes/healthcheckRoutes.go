package routes

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func HealthCheck (app *fiber.App, db *mongo.Client) {
    app.Get("/health", func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
        defer cancel()

        err := db.Ping(ctx, nil)
        if err != nil {
            return c.Status(503).JSON(fiber.Map{"status": "error", "message": "Database not reachable"})
        }
		
        return c.JSON(fiber.Map{"status": "success", "message": "API is healthy"})
    })
}