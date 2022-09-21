const FileNotFound = new Error("File Not Found");
const BadRequest = new Error("Bad Request");

async function getData(path, type) {
  let data;
  switch (type) {
    case "json":
      data = await _getJSON(path);
      return data;
    case "txt":
      data = await _getText(path);
      return data;
    default:
      return BadRequest;
  }
}

async function _getJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw FileNotFound;
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function _getText(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw FileNotFound;
    const data = await res.text();
    return data;
  } catch (error) {
    return error;
  }
}

async function postJSON(path, newName) {
  try {
    const res = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ newName }),
      headers: new Headers({ "Content-type": "application/json" }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function renameFile(path, newName) {
  try {
    const res = await fetch(path, {
      method: "PUT",
      body: JSON.stringify({ newName }),
      headers: new Headers({ "Content-type": "application/json" }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function deleteFile(path) {
  try {
    const res = await fetch(path, { method: "DELETE" });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export { getData, postJSON, renameFile, deleteFile };
