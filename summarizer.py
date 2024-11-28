import sys
import json
from transformers import pipeline


def convert_to_string(file_path: str):
    text: str = ''
    if file_path.endswith('.txt'):
        with open(file_path, 'r') as f:
            text = f.read()
    else:
        import csv
        with open(file_path, mode ='r') as file:
            csv_file = csv.reader(file)
            for line in csv_file:
                text += ' ' + line
    return text

def summarize_file(text):
    summarizer = pipeline("summarization", model='facebook/bart-large-cnn')
    summary = summarizer(text, max_length=150, min_length=40, do_sample=False)[0]['summary_text']
    # return result as JSON
    return json.dumps({"status": "success", "summary": summary})

if __name__ == "__main__":
    # get the file path command line arguments
    input_file = sys.argv[1]
    
    # summarize input file
    output = summarize_file(convert_to_string(input_file))
    
    # print result to stdout for app.js
    print(output)
