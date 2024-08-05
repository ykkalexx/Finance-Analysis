package model

type TempSummary struct {
	Sum          string `json:"monthly_sum"`
    CustomerID   string    `json:"customer_number"`
}

type MonthlySummary struct {
    Sum          float64 `json:"monthly_sum" bson:"monthly_sum"`
    CustomerID   int     `json:"customer_number" bson:"customer_number"`
}

type TempCommonTransaction struct {
    CustomerID   int     `json:"customer_number" bson:"customer_number"`
    Transaction  string `json:"common_transaction_type" bson:"common_transaction_type"`
}

type CommonTransaction struct {
    CustomerID   string     `json:"customer_number" bson:"customer_number"`
    Transaction  string `json:"common_transaction_type" bson:"common_transaction_type"`
}