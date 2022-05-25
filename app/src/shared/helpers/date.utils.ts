export const getStartOfTheDay = (date: Date) => {
  const startOfTheDay = new Date(date);
  startOfTheDay.setUTCHours(0, 0, 0, 0);
  return startOfTheDay;
};

export const getEndOfTheDay = (date: Date) => {
  const endOfTheDay = new Date(date);
  endOfTheDay.setUTCHours(23, 59, 59, 999);
  return endOfTheDay;
};
