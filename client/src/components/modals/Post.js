import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router";

function Post({ show, handleClose }) {
  const navigate = useNavigate();

  const initData = { noteName: "", noteContent: "" };
  const [formData, setFormData] = useState(initData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { noteName, noteContent } = formData;

  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileInputChange = (e) => {
    const image = e.target.files[0];
    setFormData({ ...formData, image });
    setPreviewUrl(URL.createObjectURL(image));
  };

  const handleSubmit = async () => {
    let type = window.location.href.split("/")[3];
    if (type != "memes" && type != "anime") type = "main";
    navigate(`/${type !== "main" ? type : ""}`);
    await axios.postForm(`${process.env.REACT_APP_API_BASE_URL}/${type}/post`, formData);
    setFormData(initData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-secondary">
        <Modal.Title>New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-secondary" >
        <Form>
          <Form.Group controlId="name" className="m-1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              value={noteName}
              onChange={handleTextInputChange}
              name="noteName"
              placeholder="Masukkan nama"
            />
          </Form.Group>
          <Form.Group controlId="content" className="m-1">
            <Form.Label>Content</Form.Label>
            <Form.Control
              required
              as="textarea"
              value={noteContent}
              onChange={handleTextInputChange}
              rows="3"
              name="noteContent"
              placeholder="Ketik aja"
            />
          </Form.Group>
          <Form.Group controlId="image" className="m-1">
            <Form.Control
              required
              name="image"
              type="file"
              onChange={handleFileInputChange}
            />
          </Form.Group>
        </Form>
        <div>
          <h3>Preview Gambar</h3>
          <img src={previewUrl} alt="Preview" style={{
            maxHeight: "500px",
            maxWidth: "500px",
            objectFit: "contain",
          }}/>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-secondary">
        <Button variant="primary" onClick={handleSubmit}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Post;
