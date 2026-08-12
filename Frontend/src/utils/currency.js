import { DEFAULT_CURRENCY } from "./constants";

const toSafeNumber = (value) => {
    if (typeof value === "string") {
        const normalized = value.replace(/,/g, "").trim();
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value) =>
    `${DEFAULT_CURRENCY}${toSafeNumber(value).toLocaleString("en-IN")}`;