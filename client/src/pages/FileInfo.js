import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJSON } from "../utilities/fetch-utils";

const _SERVER_URL = "http://10.0.0.55:3000/users/joen";

function FileInfo() {
  const navigate = useNavigate();

  const [fileInfo, setFileInfo] = useState({});
  const { file } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = getJSON(`${_SERVER_URL}/info/${file}`);
        if (!data.ok) throw data;
        setFileInfo(data);
      } catch (error) {
        console.log("error");
        // navigate("/error");
      }
    })();
  }, []);

  return (
    <div className="file-info">
      <ul className="info-list">
        {Object.keys(fileInfo).map((key) => {
          <li key={key}>
            {key}: {fileInfo[key]}
          </li>;
        })}
      </ul>
    </div>
  );
}

export default FileInfo;
