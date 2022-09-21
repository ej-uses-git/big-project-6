const FileNotFound = new Error("File Not Found");

async function getJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw FileNotFound;
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function getText(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw FileNotFound;
    const data = await res.text();
    return data;
  } catch (error) {
    return error;
  }
}

async function postJSON(path, body) {
  try {
    const res = await fetch(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({ "Content-type": "application/json" }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export { getJSON, getText,  postJSON };
