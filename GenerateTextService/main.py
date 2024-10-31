from typing import Union
from transformers import T5Tokenizer, T5ForConditionalGeneration



from fastapi import FastAPI

app = FastAPI()

@app.get("/{word}")
def read_root(word: str):
    tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-large")
    model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-large")

    input_text = "Give me a sentence using the word {}".format(word)
    input_ids = tokenizer(input_text, return_tensors="pt").input_ids

    outputs = model.generate(input_ids)
    print(tokenizer.decode(outputs[0]).replace("<pad>" ,""))

    return {"output": tokenizer.decode(outputs[0])}