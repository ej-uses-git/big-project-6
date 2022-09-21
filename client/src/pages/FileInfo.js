import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getData } from "../utilities/fetch-utils";
import { SERVER_URL } from "../utilities/folder-utils";

function FileInfo() {
  const navigate = useNavigate();

  const [fileInfo, setFileInfo] = useState({});
  const { file } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await getData(`${SERVER_URL}/info/${file}`, "json");
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
