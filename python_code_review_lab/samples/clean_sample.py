def calculate_invoice_total(items, tax_rate):
    subtotal = sum(item["quantity"] * item["unit_price"] for item in items)
    tax = subtotal * tax_rate
    return {
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "total": round(subtotal + tax, 2),
    }


def parse_order_rows(rows):
    parsed = []
    for row in rows:
        parsed.append(
            {
                "name": row["name"].strip(),
                "quantity": int(row["quantity"]),
                "unit_price": float(row["unit_price"]),
            }
        )
    return parsed
