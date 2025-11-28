"""
Módulo de datos para Nutrition Analyzer.

Define FOODS_DB: lista de alimentos con información nutricional
por 100 g. Usado por app.main para servir la API y la UI.
"""

FOODS_DB = [
    {
        "id": 1,
        "name": "Banana",
        "category": "Fruta",
        "calories": 89,
        "protein_g": 1.1,
        "carbs_g": 23,
        "fat_g": 0.3,
    },
    {
        "id": 2,
        "name": "Manzana",
        "category": "Fruta",
        "calories": 52,
        "protein_g": 0.3,
        "carbs_g": 14,
        "fat_g": 0.2,
    },
    {
        "id": 3,
        "name": "Pechuga de pollo",
        "category": "Carne",
        "calories": 165,
        "protein_g": 31,
        "carbs_g": 0,
        "fat_g": 3.6,
    },
    {
        "id": 4,
        "name": "Arroz blanco cocido",
        "category": "Cereal",
        "calories": 130,
        "protein_g": 2.4,
        "carbs_g": 28,
        "fat_g": 0.3,
    },
    {
        "id": 5,
        "name": "Avena seca",
        "category": "Cereal",
        "calories": 389,
        "protein_g": 17,
        "carbs_g": 66,
        "fat_g": 7,
    },
    {
        "id": 6,
        "name": "Huevo",
        "category": "Proteína",
        "calories": 155,
        "protein_g": 13,
        "carbs_g": 1.1,
        "fat_g": 11,
    },
    {
        "id": 7,
        "name": "Leche entera",
        "category": "Lácteo",
        "calories": 61,
        "protein_g": 3.2,
        "carbs_g": 4.8,
        "fat_g": 3.3,
    },
    {
        "id": 8,
        "name": "Yogur natural",
        "category": "Lácteo",
        "calories": 59,
        "protein_g": 10,
        "carbs_g": 3.6,
        "fat_g": 0.4,
    },
    {
        "id": 9,
        "name": "Pan integral",
        "category": "Panificado",
        "calories": 247,
        "protein_g": 13,
        "carbs_g": 41,
        "fat_g": 4.2,
    },
    {
        "id": 10,
        "name": "Aceite de oliva",
        "category": "Grasa",
        "calories": 884,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 100,
    },
]
