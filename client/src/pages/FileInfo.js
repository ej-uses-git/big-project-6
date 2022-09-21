import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJSON } from "../utilities/fetch-utils";

const _SERVER_URL = "http://10.0.0.55:3000/users/joen";

function FileInfo() {
  const navigate = useNavigate();

  const [fileInfo, setFileInfo] = useState({ Bob: "The builder" });
  const { file } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await getJSON(`${_SERVER_URL}/info/${file}`);
        if (data instanceof Error) throw data;
        setFileInfo(data);
      } catch (error) {
        navigate("/error");
      }
    })();
  }, [file]);

  return (
    <div className="file-info">
      <ul className="info-list">
        {Object.keys(fileInfo).map((key) => (
          <div key={key}>
            {key}: {fileInfo[key]}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default FileInfo;
