export const BUSINESS_TYPE_KEYWORDS = {
    RESTAURANT: [
        "restaurante",
        "comida rápida",
        "hamburguesería",
        "pizzería",
        "marisquería",
        "asador",
        "sushi",
        "tapas bar",
        "cocktail bar",
        "nightclub",
        "cafetería",
        "bakery",
        "food truck",
        "buffet",
        "bistro",
        "trattoria",
        "taquería",
        "taberna",
        "restaurante fusion"
    ],
} as const;

export type BusinessType = keyof typeof BUSINESS_TYPE_KEYWORDS;
