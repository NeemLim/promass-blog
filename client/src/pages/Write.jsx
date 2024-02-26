import React, { useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/authContext"; // Assuming AuthContext is correctly set up


const Write = () => {
    const { currentUser } = useContext(AuthContext); // Use useContext to access the current user

  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "");
  const [value, setValue] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [imgPreview, setImgPreview] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();

    if (!currentUser) {
    // If there's no current user, display a styled message
    return (
      <div className="login-required">
        <p>You must be logged in to publish something.</p>
      </div>
    );
  }

  const isFormValid =  title && value && cat && value.length >= 70 && file;

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const clearForm = () => {
    setTitle("");
    setValue("");
    setFile(null);
    setCat("");
    setImgPreview(null);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Title, content (at least 70 characters), and category are required.");
      return;
    }

    const imgUrl = await upload();

    try {
      await (state
        ? axios.put(`/posts/${state.id}`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
          })
        : axios.post(`/posts/`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          }));
      
      setShowDialog(true); // Show the dialog to inform the user
      clearForm(); // Clear the form after publishing
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            required
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            required
            onChange={handleFileChange}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          {imgPreview && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <img src={imgPreview} alt="Preview" style={{ maxHeight: "200px", maxWidth: "100%", objectFit: "contain" }} />
            </div>
          )}
          <div className="buttons">
            {/* <button>Save as a draft</button> */}
            <button
              onClick={handleClick}
              disabled={!isFormValid}
              style={!isFormValid ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              title={!isFormValid ? "Fill in all fields to enable this button" : ""}
            >              Publish
            </button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "technology"}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "cinema"}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
            {/* Dialog to show after successful post */}
      {showDialog && (
        <div className="dialog">
          <div className="dialog-content">
            <p>Post published successfully!</p>
            <button onClick={() => setShowDialog(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Write;
