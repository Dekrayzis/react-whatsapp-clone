import React, { useState } from "react";
import "./filemodal.scss";

const mimeTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
};

const lookupMime = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  return mimeTypes[ext] || "application/octet-stream";
};

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const authorized = ["image/jpeg", "image/png", "image/gif"];

  const addFile = (ev) => {
    const newfile = ev.target.files[0];
    if (newfile) {
      setFile(newfile);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      if (isAuthorized(file.name)) {
        const metaData = {
          contentType: lookupMime(file.name),
        };
        uploadFile(file, metaData);
        closeModal();
        setFile(null);
      }
    }
  };

  const isAuthorized = (filename) => authorized.includes(lookupMime(filename));

  return (
    <div className="modal__overlay" onClick={closeModal}>
      <div className="modal__window" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>Upload Image</h3>
          <button className="modal__close" onClick={closeModal}>
            ✕
          </button>
        </div>
        <div className="modal__body">
          <p className="modal__hint">Supported: JPG, PNG, GIF</p>
          <label className="modal__file-input">
            <input type="file" onChange={addFile} accept="image/*" />
            <span>{file ? file.name : "Choose file..."}</span>
          </label>
        </div>
        <div className="modal__footer">
          <button className="modal__btn modal__btn--cancel" onClick={closeModal}>
            Cancel
          </button>
          <button
            className="modal__btn modal__btn--upload"
            onClick={sendFile}
            disabled={!file}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
