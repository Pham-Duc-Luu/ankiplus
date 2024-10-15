package main

import "test-database-go/pkg/mongodb/schema"

func main() {
	 // Here you can interact with the MongoDB collection
    // For example, you could query documents or insert data into the collection
    var result schema.Collection
    err = schema.collection.FindOne(context.TODO(), bson.M{"name": "some collection name"}).Decode(&result)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            log.Println("No document found")
        } else {
            log.Fatal("Error querying collection:", err)
        }
    }

    log.Println("Found collection:", result)
}
