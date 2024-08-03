package model

type MonthlySummary struct {
	ID int `json:"_id" bson:"_id"`
	Date string `json:"date"`
	CustomerID int `json:"customer_id"`
	Sum float64 `json:"sum"`
}