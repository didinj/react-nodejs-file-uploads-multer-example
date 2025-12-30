import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select at least one file");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/uploads",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        }
      );

      setUploadedFiles(response.data.files);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Upload Files</h2>

      <input type="file" multiple onChange={handleFileChange} />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploading && (
        <div style={{ marginTop: "1rem" }}>
          <progress value={progress} max="100" />
          <span> {progress}%</span>
        </div>
      )}

      {message && <p>{message}</p>}

      {/* Preview Section */}
      <div style={{ marginTop: "1rem" }}>
        {uploadedFiles.map((file, index) => (
          <div key={index}>
            {file.mimetype.startsWith("image/") ? (
              <img src={file.url} alt="" style={{ maxWidth: 200 }} />
            ) : (
              <a href={file.url} target="_blank">
                View File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
