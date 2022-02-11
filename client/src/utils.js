export const parseUrl = (obj) => {
  const params = Object.entries(obj);
  let str = "?";
  params.map(
    (cat, index) =>
      (str += `${cat[0]}=${cat[1]}${index < params.length - 1 ? "&" : ""}`)
  );
  return str;
};

export const parseFunds = (funds) =>
  funds.map((token) =>
    ["free", "name", "coin", "networkList"].reduce((acc, curr) => {
      acc[curr] = token[curr];
      return acc;
    }, {})
  );
