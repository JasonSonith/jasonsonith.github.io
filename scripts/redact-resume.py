#!/usr/bin/env python3
"""Copy a resume PDF with every phone number (and its leading separator) removed.

Usage: redact-resume.py <input.pdf> <output.pdf>
"""
import re
import sys

import pymupdf

PHONE = re.compile(r"(?:\|\s*)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b")


def redact(src: str, dst: str) -> int:
    doc = pymupdf.open(src)
    hits = 0
    for page in doc:
        for match in PHONE.finditer(page.get_text()):
            for rect in page.search_for(match.group(0).strip()):
                page.add_redact_annot(rect, fill=(1, 1, 1))
                hits += 1
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE)
    doc.set_metadata({})
    doc.save(dst, garbage=4, deflate=True)
    doc.close()
    return hits


def leftovers(path: str) -> int:
    with pymupdf.open(path) as doc:
        return sum(len(PHONE.findall(page.get_text())) for page in doc)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    hits = redact(sys.argv[1], sys.argv[2])
    left = leftovers(sys.argv[2])
    if hits == 0 or left:
        sys.exit(f"redaction failed: hits={hits} leftover={left}")
    print(f"redacted {hits} phone occurrence(s) -> {sys.argv[2]}")
