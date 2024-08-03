package routes

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func ApiRoutes(app *fiber.App) {
    app.Post("/test", func(c *fiber.Ctx) error {
        return c.Status(200).JSON(fiber.Map{"message": "Testing Route!"})
    })

    app.Post("/monthly-sum", func(c *fiber.Ctx) error {
        err := godotenv.Load()

        if err != nil {
            return c.Status(500).SendString(err.Error())
        }

		cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("eu-north-1"), config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(os.Getenv("AWS_ACCESS_KEY_ID"), os.Getenv("AWS_SECRET_ACCESS_KEY"), "")))
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }

        client := lambda.NewFromConfig(cfg)

        input := &lambda.InvokeInput{
            FunctionName: aws.String("monthly-sum"),
        }

        result, err := client.Invoke(context.TODO(), input)
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }

		return c.Status(200).SendString(string(result.Payload))
    })
}