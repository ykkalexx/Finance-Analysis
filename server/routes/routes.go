package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ykkalexx/nameless/handlers"
	"go.mongodb.org/mongo-driver/mongo"
)

func ApiRoutes(app *fiber.App, db *mongo.Client) {
    app.Post("/test", func(c *fiber.Ctx) error {
        return c.Status(200).JSON(fiber.Map{"message": "Testing Route!"})
    })

    app.Post("/monthly-sum", func(c *fiber.Ctx) error {
        return handlers.MonthlySumHandler(c, db)
    })

    app.Post("/common-transaction", func(c *fiber.Ctx) error {
        return handlers.CommonTransactionHandler(c, db)
    })
}