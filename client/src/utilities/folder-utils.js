const formatNames = (arr) =>
  arr.map((item) => (item.includes(".") ? item.split(".") : [item, "DIR"]));

const _SERVER_URL = "http://localhost:5000";

const getURL = (path) => _SERVER_URL + path;

export { formatNames, getURL };
