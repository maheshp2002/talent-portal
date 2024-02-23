from transformers import BertTokenizer, BertModel
import torch
import sys
import os

def calculate_similarity(user_answer, db_answer):
    # Path to the directory containing the BERT model files
    model_dir = os.path.join(os.path.dirname(__file__), "Models")

    # Load tokenizer and model from local directory
    tokenizer = BertTokenizer.from_pretrained(model_dir)
    model = BertModel.from_pretrained(model_dir)

    # Tokenize inputs
    user_tokens = tokenizer(user_answer, return_tensors='pt')
    db_tokens = tokenizer(db_answer, return_tensors='pt')

    # Get embeddings
    with torch.no_grad():
        user_output = model(**user_tokens)
        db_output = model(**db_tokens)

    # Compute similarity score (e.g., cosine similarity)
    similarity_score = torch.nn.functional.cosine_similarity(user_output.last_hidden_state.mean(dim=1),
                                                              db_output.last_hidden_state.mean(dim=1)).item()

    return similarity_score

if __name__ == "__main__":
    # Read user answer and db answer from command line arguments
    user_answer = sys.argv[1]
    db_answer = sys.argv[2]

    # Calculate similarity score
    similarity_score = calculate_similarity(user_answer, db_answer)

    # Print similarity score to stdout
    print(similarity_score)
