const formatNames = (arr) =>
  arr.map((item) => (item.includes(".") ? item.split(".") : [item, "DIR"]));


export {formatNames};