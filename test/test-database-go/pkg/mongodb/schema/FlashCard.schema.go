package schema

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// SRS is a placeholder for your SRS schema
// Define the SRS struct according to its fields
type SRS struct {
    // Define your SRS fields here
}

// FlashCard represents the MongoDB flash card document
type FlashCard struct {
    ID          primitive.ObjectID `bson:"_id,omitempty"` // MongoDB ObjectID
    Front       interface{}        `bson:"front"`         // Mixed type, use interface{} for any type
    Back        interface{}        `bson:"back"`          // Mixed type
    SRS         *SRS              `bson:"SRS,omitempty"` // Optional reference to SRS
    InCollection primitive.ObjectID `bson:"inCollection"`  // Reference to Collection
}