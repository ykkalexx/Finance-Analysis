package routes

import (
	"context"
	"encoding/json"
	"os"
	"strconv"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/ykkalexx/nameless/model"
	"go.mongodb.org/mongo-driver/mongo"
)

func ApiRoutes(app *fiber.App, db *mongo.Client) {
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

        var tempSummaries []model.TempSummary
        err = json.Unmarshal(result.Payload, &tempSummaries)
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }

		var summaries []model.MonthlySummary
        for _, tempSummary := range tempSummaries {
            sum, err := strconv.ParseFloat(tempSummary.Sum, 64)
            if err != nil {
                return c.Status(500).SendString(err.Error())
            }
            customerID, err := strconv.Atoi(tempSummary.CustomerID)
            if err != nil {
                return c.Status(500).SendString(err.Error())
            }
            summaries = append(summaries, model.MonthlySummary{
                Sum:        sum,
                CustomerID: customerID,
            })
        }

        collection := db.Database("financereturns").Collection("monthly_summaries")
        
        for _, summary := range summaries {
            _, err := collection.InsertOne(context.Background(), summary)
            if err != nil {
                return c.Status(500).SendString(err.Error())
            }
        }

        return c.Status(200).SendString(string(result.Payload))
    })
}