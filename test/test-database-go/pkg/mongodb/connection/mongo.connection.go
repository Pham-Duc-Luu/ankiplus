package connection

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// mongoClient connects to the MongoDB server and returns a MongoDB collection.
func mongoClient() *mongo.Collection {
    clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

    // Create a new client and connect to the server
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    // Disconnect client when function ends
    defer func() {
        if err = client.Disconnect(context.TODO()); err != nil {
            log.Fatal(err)
        }
    }()

    // Access a collection in the database
    collection := client.Database("testdb").Collection("mycollection")

    // Return the collection
    return collection
}

// GetCollectionByName returns a MongoDB collection by its name
func GetCollectionByName(dbName, collectionName string) (*mongo.Collection, error) {
    // Connect to MongoDB
    clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        return nil, err
    }
    defer client.Disconnect(context.TODO())

    // Get the database and collection by name
    database := client.Database(dbName)
    collection := database.Collection(collectionName)

    return collection, nil
}
