FOODS = {
    "banana": {
        "calories": 89,
        "protein": 1.1,
        "carbs": 23,
        "fat": 0.3,
    },
    "manzana": {
        "calories": 52,
        "protein": 0.3,
        "carbs": 14,
        "fat": 0.2,
    },
    "arroz blanco": {
        "calories": 130,
        "protein": 2.7,
        "carbs": 28,
        "fat": 0.3,
    },
    "pechuga de pollo": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
    },
    "huevo": {
        "calories": 155,
        "protein": 13,
        "carbs": 1.1,
        "fat": 11,
    },
}


def search_foods(query: str):
    q = query.lower().strip()
    if not q:
        return []

    results = []
    for name, data in FOODS.items():
        if q in name.lower():
            item = {"name": name}
            item.update(data)
            results.append(item)
    return results
