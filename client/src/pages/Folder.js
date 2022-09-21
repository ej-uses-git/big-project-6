function Folder() {
  const fileNames = ["App.js", "App.css", "index.html", "index.js", "b.txt"];
  return (
    <div className="folder">
      <table className="folder-contents">
        <thead className="folder-headings">
          <tr>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody className="folder-files">
          {fileNames.map((file) => (
            <tr key={file} className="folder-file">
              {file.split(".").map((text) => (
                <td key={file + "--" + text}>{text}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Folder;
