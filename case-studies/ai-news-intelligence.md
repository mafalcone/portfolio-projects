# AI News Intelligence Pipeline

## Executive summary

A private automation pipeline that ingests news from controlled JSON APIs, RSS feeds and webhooks; normalizes and deduplicates items; produces schema-validated analysis; stores results; and exposes operational metrics through a REST API and sanitized dashboard.

## Problem

Raw news streams are repetitive and inconsistent. Manual review does not scale, while a loosely controlled model call can create invalid fields, duplicate spend and hard-to-debug failures.

## Architecture

```text
Configured APIs / RSS / inbound webhook
                  ↓
       validation + normalization
                  ↓
      fingerprint + idempotency
                  ↓
    structured analysis + fallback
                  ↓
    SQLite articles / runs / usage
                  ↓
 REST API / dashboard / signed webhook
```

## What I built

- Controlled source adapters and an authenticated ingestion webhook.
- Strict input and structured-output validation with Pydantic/JSON Schema.
- SHA-256 fingerprinting plus a unique SQL constraint for idempotency.
- A provider adapter with bounded retry and deterministic degraded mode.
- SQLite records for articles, analyses, pipeline runs and deliveries.
- Token and estimated-cost accounting per result and in aggregate.
- JSONL logs with run, article and request correlation IDs.
- Signed outbound webhooks and independent delivery failure tracking.
- REST endpoints, a responsive dashboard and sanitized fixture data.
- Automated tests for deduplication, schema enforcement and provider fallback.

## Verified demo result

- First fixture run: 3 ingested, 3 analyzed, 0 failures.
- Identical second run: 0 reprocessed, 3 duplicates skipped.
- Automated tests: 4/4 passing.
- API health, run trigger, article listing and metrics endpoints validated locally.

## Stack

Python 3.12, REST APIs, Pydantic, SQLite/SQL, JSON Schema, RSS/JSON adapters, authenticated and HMAC-signed webhooks, structured JSONL logging.

## Disclosure

The paid provider adapter is implemented, but this cloud validation used the deterministic fallback because no API credential was supplied.

**Private implementation — technical demo available on request.**

