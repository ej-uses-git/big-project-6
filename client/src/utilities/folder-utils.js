const formatNames = (arr) =>
  arr.map((item) => (item.includes(".") ? item.split(".") : [item, "DIR"]));

const _SERVER_URL = "http://10.0.0.55:3000/users/joen";

export { formatNames, _SERVER_URL as SERVER_URL };
