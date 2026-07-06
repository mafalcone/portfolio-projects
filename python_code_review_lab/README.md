# Python Code Review Lab

Defensive static review lab for Python snippets and source files.

This project analyzes Python code as text. It does not import, evaluate or execute the reviewed file. The goal is to demonstrate secure code review thinking in a safe, recruiter-friendly portfolio project for Cybersecurity, DevSecOps and secure code review interviews.

## What It Does

Python Code Review Lab reads a Python file, normalizes the text to lowercase and compares it against a small set of static review rules. When notable indicators are found, it returns a JSON report with:

- reviewed file path
- review score
- review level
- matched indicators
- plain-English explanations

The rules are intentionally conservative. They are not an automated intent classifier and they do not make claims about intent. They highlight patterns that deserve manual review.

## Safety Model

- Does not execute untrusted code.
- Does not import the reviewed file.
- Does not capture credentials.
- Does not create persistence.
- Does not make network requests.
- Does not include active monitoring, collection or execution behavior.

The analyzer only reads source text from disk and prints JSON to stdout.

## How It Works

The analyzer uses static token matching from `src/rules.py`.

Current review indicators cover:

- input/event monitoring references
- background execution patterns
- local file output
- external communication references
- startup/autostart references

Each rule includes an id, title, weight, token list and explanation. The score is capped at 100 and mapped to a simple review level.

## Usage

From the repository root:

```bash
python python_code_review_lab/src/analyzer.py python_code_review_lab/samples/clean_sample.py
python python_code_review_lab/src/analyzer.py python_code_review_lab/samples/review_sample.py
```

From this project folder:

```bash
python src/analyzer.py samples/clean_sample.py
python src/analyzer.py samples/review_sample.py
```

## Example Output

```json
{
  "file": "samples/clean_sample.py",
  "review_score": 0,
  "review_level": "Low / no strong indicators",
  "indicators": []
}
```

An example report for the review sample is available at `reports/example_report.json`.

## Interview Angle

This project is useful for discussing how to build safe review tooling around untrusted code. It shows:

- separation between analysis and execution
- defensive wording around uncertain signals
- explainable rules instead of black-box scoring
- JSON output suitable for reports or a frontend panel
- awareness of review limitations and false positives

It pairs with the embedded browser demo in `presupuesto_electrico`, where the same concept is presented as an interactive portfolio panel.

## Limitations

This is a static text-pattern demo. It can miss risky behavior that uses different wording, dynamic imports, obfuscation or indirect dependencies. It can also flag benign code that mentions the same tokens in documentation or comments.

A production-grade secure code review workflow would add parsing, dependency review, configuration checks, permission analysis, human triage and tests.
