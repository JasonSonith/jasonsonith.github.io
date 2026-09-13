#!/usr/bin/env python3
"""Copy a resume PDF with every phone number redacted.

Removes phone-shaped text (generic detection: separated, compact, +1/1 prefix,
unicode dashes), deletes any tel: or phone-shaped hyperlink, and clears all
document metadata and XMP metadata.

Usage: redact-resume.py <input.pdf> <output.pdf>
"""
import re
import sys

import pymupdf

DASH = "‐-―−"
# '-' stays last in every character class below: Python's re (unlike JS) rejects
# it as an ambiguous range endpoint next to \d or another escape.
SEP_CHARS = rf".\s{DASH}-"
SEP = f"[{SEP_CHARS}]"
SEPARATED = rf"(?:\+?1{SEP}?)?\(?\b\d{{3}}\)?{SEP}?\d{{3}}{SEP}\d{{4}}\b"
COMPACT = rf"\+?\b(?:1)?[2-9]\d{{2}}[2-9]\d{{2}}\d{{4}}\b"
TEL_URI = rf"\btel:\+?[\d(){SEP_CHARS}]{{7,15}}"
PHONE = re.compile(f"(?:{SEPARATED})|(?:{COMPACT})|(?:{TEL_URI})", re.IGNORECASE)

# Glyphs that separate header fields (e.g. "email | phone | github"); only the
# separator trailing a redacted phone is removed, so the leading one stays and
# the header reads cleanly instead of showing a wide gap before a stray pipe.
SEPARATOR_WORD = re.compile(r"^[|•·:-]+$")


def _line_groups(page):
    groups: dict[tuple[int, int], list] = {}
    for w in page.get_text("words"):
        groups.setdefault((w[5], w[6]), []).append(w)
    return groups.values()


def _phone_rects(page):
    rects = []
    for words in _line_groups(page):
        text = ""
        spans = []
        for i, w in enumerate(words):
            if i > 0:
                text += " "
            start = len(text)
            text += w[4]
            spans.append((start, len(text)))
        for match in PHONE.finditer(text):
            covered = [i for i, (s, e) in enumerate(spans) if s < match.end() and e > match.start()]
            if not covered:
                continue
            last = covered[-1]
            if last + 1 < len(words) and SEPARATOR_WORD.match(words[last + 1][4]):
                covered.append(last + 1)
            rect = pymupdf.Rect(words[covered[0]][:4])
            for i in covered[1:]:
                rect |= pymupdf.Rect(words[i][:4])
            rects.append(rect)
    return rects


def _phone_links(page):
    links = []
    for link in page.get_links():
        uri = link.get("uri") or ""
        if uri.startswith("tel:") or PHONE.search(uri):
            links.append(link)
    return links


def redact(src: str, dst: str) -> int:
    doc = pymupdf.open(src)
    hits = 0
    for page in doc:
        for link in _phone_links(page):
            page.delete_link(link)
            page.add_redact_annot(link["from"], fill=(1, 1, 1))
            hits += 1
        for rect in _phone_rects(page):
            page.add_redact_annot(rect, fill=(1, 1, 1))
            hits += 1
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE)
    doc.set_metadata({})
    doc.del_xml_metadata()
    doc.save(dst, garbage=4, deflate=True)
    doc.close()
    return hits


def leftovers(path: str) -> list[str]:
    problems = []
    doc = pymupdf.open(path)
    for i, page in enumerate(doc):
        if PHONE.search(page.get_text()):
            problems.append(f"page {i}: phone-shaped text remains")
        for link in page.get_links():
            uri = link.get("uri") or ""
            if uri.startswith("tel:") or PHONE.search(uri):
                problems.append(f"page {i}: phone-shaped link remains ({uri!r})")
    # 'format' and 'encryption' are inherent PDF properties, not user metadata set_metadata() clears.
    for key, value in doc.metadata.items():
        if key in ("format", "encryption"):
            continue
        if value and PHONE.search(str(value)):
            problems.append(f"metadata[{key}] contains a phone-shaped string")
        elif value:
            problems.append(f"metadata[{key}] not cleared: {value!r}")
    xmp = doc.get_xml_metadata()
    if xmp:
        problems.append("XMP metadata not cleared")
    doc.close()
    return problems


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--check":
        problems = leftovers(sys.argv[2])
        if problems:
            sys.exit(f"phone-shaped content found in {sys.argv[2]}: {len(problems)} problem(s)")
        print(f"no phone-shaped content in {sys.argv[2]}")
        sys.exit(0)
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    hits = redact(sys.argv[1], sys.argv[2])
    problems = leftovers(sys.argv[2])
    if hits == 0 or problems:
        sys.exit(f"redaction failed: hits={hits} problems={problems}")
    print(f"redacted {hits} phone occurrence(s) -> {sys.argv[2]}")
