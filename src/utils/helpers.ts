import { TRewardsPerCoin } from "./types";

export const convertToDaysAndHours = (value: number): string => {
  const days = Math.floor(value);

  const hours = Math.floor((value - days) * 24);

  const daysPart =
    days > 0 ? `${days} ${pluralize(days, ["день", "дня", "дней"])}` : "";
  const hoursPart =
    hours > 0 ? `${hours} ${pluralize(hours, ["час", "часа", "часов"])}` : "";

  return [daysPart, hoursPart].filter(Boolean).join(" ");
};

const pluralize = (number: number, forms: [string, string, string]): string => {
  const mod10 = number % 10;
  const mod100 = number % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return forms[2];
  }
  if (mod10 === 1) {
    return forms[0];
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return forms[1];
  }
  return forms[2];
};

export const findMaxRemainingDays = (
  items: TRewardsPerCoin[]
): TRewardsPerCoin | null => {
  if (items.length === 0) return null;

  return items.reduce((maxItem, currentItem) => {
    return currentItem.remainingDaysForToken > maxItem.remainingDaysForToken
      ? currentItem
      : maxItem;
  });
};
