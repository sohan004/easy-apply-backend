const nameToId = async (name) => {
  return await name
    .toLowerCase()
    .normalize("NFD") // Normalize accents (e.g., é -> e)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
};

module.exports = nameToId;
