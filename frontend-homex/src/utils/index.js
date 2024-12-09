export const shortFormat = (str, maxLength, message) => {
  if (!str) {
    return message || "N/A";
  }

  if (str.length <= maxLength) {
    return str;
  }

  const ellipsis = "...";
  const halfLength = Math.floor((maxLength - ellipsis.length) / 2);

  return str.slice(0, halfLength) + ellipsis + str.slice(-halfLength);
};
