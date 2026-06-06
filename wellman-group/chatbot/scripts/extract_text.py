import fitz
import os
from tqdm import tqdm

# Folder containing PDFs
PDF_FOLDER = "../data/raw_pdfs"

# Output folder
OUTPUT_FOLDER = "../data/extracted"

# Create output folder if not exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def extract_text_from_pdf(pdf_path):
    """
    Extract text page by page from PDF
    """

    doc = fitz.open(pdf_path)

    full_text = ""

    for page_num, page in enumerate(doc):

        text = page.get_text("text")

        # Add page separator
        full_text += f"\n\n===== PAGE {page_num + 1} =====\n\n"

        full_text += text

    return full_text


def process_all_pdfs():

    pdf_files = [f for f in os.listdir(PDF_FOLDER) if f.endswith(".pdf")]

    for pdf_file in tqdm(pdf_files):

        pdf_path = os.path.join(PDF_FOLDER, pdf_file)

        print(f"\nProcessing: {pdf_file}")

        extracted_text = extract_text_from_pdf(pdf_path)

        # Create txt filename
        txt_filename = pdf_file.replace(".pdf", ".txt")

        output_path = os.path.join(OUTPUT_FOLDER, txt_filename)

        # Save extracted text
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(extracted_text)

        print(f"Saved: {txt_filename}")


if __name__ == "__main__":
    process_all_pdfs()