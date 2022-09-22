const FileNotFound = new Error("File Not Found");

async function getData(path, type) {
  let data;
  switch (type) {
    case "json":
      data = await _getJSON(path);
      return data;
    case "txt":
      data = await _getText(path);
      return data;
    case "":
      data = await _getJSON(path);
      return data;
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
  console.log("got here");
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

async function postFile(path, input, type) {
  try {
    let body = input;
    if (type === "txt") body = JSON.stringify(input);
    const res = await fetch(path, {
      method: "POST",
      body,
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

export { getData, postJSON, renameFile, deleteFile, postFile };
