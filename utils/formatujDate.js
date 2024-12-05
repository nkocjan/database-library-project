const formatujDate = dateString => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

module.exports = formatujDate;
