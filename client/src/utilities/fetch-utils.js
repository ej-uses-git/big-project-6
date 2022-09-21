const FileNotFound = new Error("File Not Found");

async function getFetch(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw FileNotFound;
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

export { getFetch };
