import argparse
import json
from pathlib import Path

from rules import RULES


LOW_LEVEL = "Low / no strong indicators"
MEDIUM_LEVEL = "Medium review priority"
HIGH_LEVEL = "High review priority"


def read_source(path):
    return path.read_text(encoding="utf-8", errors="replace")


def match_rule(normalized_text, rule):
    matched_tokens = [
        token for token in rule["tokens"] if token.lower() in normalized_text
    ]

    if not matched_tokens:
        return None

    return {
        "id": rule["id"],
        "title": rule["title"],
        "weight": rule["weight"],
        "matched_tokens": matched_tokens,
        "explanation": rule["explanation"],
    }


def review_level(score):
    if score >= 70:
        return HIGH_LEVEL
    if score >= 35:
        return MEDIUM_LEVEL
    return LOW_LEVEL


def analyze_file(path):
    source = read_source(path)
    normalized = source.lower()
    indicators = [
        finding for rule in RULES if (finding := match_rule(normalized, rule))
    ]
    score = min(100, sum(item["weight"] for item in indicators))

    return {
        "file": str(path),
        "review_score": score,
        "review_level": review_level(score),
        "indicators": indicators,
    }


def parse_args():
    parser = argparse.ArgumentParser(
        description=(
            "Static Python code review demo. Reads code as text and never "
            "executes the reviewed file."
        )
    )
    parser.add_argument("file", help="Path to the Python file to review")
    return parser.parse_args()


def main():
    args = parse_args()
    path = Path(args.file)

    if not path.exists() or not path.is_file():
        raise SystemExit(f"File not found: {path}")

    report = analyze_file(path)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
