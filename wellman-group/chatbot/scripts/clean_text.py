import os
import re
from tqdm import tqdm

# Input folder
INPUT_FOLDER = "../data/extracted"

# Output folder
OUTPUT_FOLDER = "../data/extracted_cleaned"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def clean_text(text):

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove multiple blank lines
    text = re.sub(r"\n\s*\n+", "\n\n", text)

    # Fix broken words caused by PDF extraction
    text = text.replace("-\n", "")

    # Preserve page separators
    text = re.sub(
        r"===== PAGE (\d+) =====",
        r"\n\n===== PAGE \1 =====\n\n",
        text
    )

    # Remove weird unicode characters
    text = text.replace("￾", "")
    text = text.replace("•", "\n• ")

    return text.strip()


def process_all_files():

    txt_files = [f for f in os.listdir(INPUT_FOLDER) if f.endswith(".txt")]

    for txt_file in tqdm(txt_files):

        file_path = os.path.join(INPUT_FOLDER, txt_file)

        with open(file_path, "r", encoding="utf-8") as f:
            raw_text = f.read()

        cleaned_text = clean_text(raw_text)

        output_path = os.path.join(OUTPUT_FOLDER, txt_file)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(cleaned_text)

        print(f"Cleaned: {txt_file}")


if __name__ == "__main__":
    process_all_files()