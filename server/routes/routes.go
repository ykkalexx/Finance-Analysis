package routes

import "github.com/gofiber/fiber/v2"

func ApiRoutes(app *fiber.App) {
	app.Post("/test", func(c *fiber.Ctx) error {
        return c.Status(200).JSON(fiber.Map{"message": "Testing Route!"})
    })

    app.Post("/monthly-sum", func(c *fiber.Ctx) error {
        return c.SendString("Monthly sum!")
    })
}