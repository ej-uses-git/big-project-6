import { formatNames } from "../utilities/folder-utils";
import { getFetch } from "../utilities/fetch-utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const URL = "http://10.0.0.55:3000/users/joen";

function Folder() {
  const { folderId } = useParams();
  const [fileData, setFileData] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await getFetch(URL);
      setFileData(data);
    })();
  }, []);

  const fileNames = formatNames(fileData);
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
              {file.map((text) => (
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
