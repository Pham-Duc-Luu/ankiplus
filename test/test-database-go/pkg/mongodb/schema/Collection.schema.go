package schema

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Collection represents the MongoDB collection document
type Collection struct {
    ID          primitive.ObjectID   `bson:"_id,omitempty"`        // MongoDB ObjectID
    Name        string               `bson:"name"`                 // Required and unique field
    Description string               `bson:"description,omitempty"`// Optional field
    Thumbnail   string               `bson:"thumbnail,omitempty"`  // Optional field (note the typo fix from "thumnail")
    Icon        string               `bson:"icon,omitempty"`       // Default value "Icon" (but handled in the code, not struct)
    IsPublic    bool                 `bson:"isPublic"`             // Default value true
    Language    string               `bson:"language"`             // Default value "en"
    Cards       []primitive.ObjectID `bson:"cards"`                // Array of references to FlashCards (ObjectID references)
    Owner       primitive.ObjectID   `bson:"owner"`                // Reference to the User schema (ObjectID)
}

