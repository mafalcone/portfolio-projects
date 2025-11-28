"""
Paquete de la aplicación Nutrition Analyzer.

Expone FOODS_DB para facilitar imports limpios desde otros módulos.
"""

from .foods_db import FOODS_DB

__all__ = ["FOODS_DB"]
