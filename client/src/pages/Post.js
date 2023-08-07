import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Col, Row } from "react-bootstrap";
import { useLoaderData } from "react-router";
import { Helmet } from "react-helmet";
import PostCard from "../components/Post.js";
import { socket } from "../socket";
const ColoredLine = ({ color }) => (
  <hr
    style={{
      background: "white",
      color: "white",
      borderColor: "white",
      height: "3px",
      width: "100%", // Set the width to 100 viewport width
    }}
  />
);

function Comments({ comments }) {
  if (!comments || !comments.length) return <div>Belum ada comment</div>;
  return comments.map((comment) => (
    <div className="w-100">
      {" "}
      {/* Set the parent container to occupy full width */}
      <Card
        className="text-left text-white bg-transparent border-0"
        key={comment.id}>
        <ColoredLine color="#ccc" />
        <Card.Body>
          <Card.Text style={{ color: "#C44900" }} className="m-1">
            {comment.commenterName}
          </Card.Text>
          <Card.Text className="m-1">{comment.commentContent}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  ));
}

function Post({ type }) {
  const [post, setPost] = useState(useLoaderData().data.post);
  const initValue = { name: "", content: "" };
  const [commentFormData, setCommentFormData] = useState(initValue);
  const { name, content } = commentFormData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentFormData({ ...commentFormData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/${type}/comment/${post.noteId}`,
      commentFormData
    );
    setCommentFormData(initValue);
  };

  useEffect(() => {
    const handleNewComment = (typeParam, noteId, comment) => {
      if (type != typeParam) return;
      if (post.noteId != noteId) return;
      setPost({ ...post, comment: [...post.comment, comment] });
    };

    const handleAddLike = (typeParam, noteId) => {
      if (type != typeParam) return;
      if (post.noteId != noteId) return;
      setPost({ ...post, like: post.like + 1 });
    };

    socket.on("newComment", handleNewComment);
    socket.on("addLike", handleAddLike);

    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("addLike", handleAddLike);
    };
  });

  return (
    <>
      <Helmet>
        <title>{`Menfess | ${[
          type.split("")[0].toUpperCase(),
          ...type.split("").splice(1),
        ].join("")} | Post ${post.noteId}`}</title>
      </Helmet>
      <PostCard post={post} type={type} />
      <div className="d-flex justify-content-center align-items-center">
        <Card
          className=" bg-dark text-white border-0"
          style={{ width: "500px", objectFit: "contain" }}>
          <Card.Body>
            <div id="comments">
              <h1 className="m-1">Komentar</h1>
              <Comments comments={post.comment} />
            </div>
            <Form onSubmit={handleSubmit}>
              <ColoredLine color="#ccc" />
              <Card className="text-left text-white bg-transparent border-0">
                <Card.Body>
                  <Form.Group className="m-1" controlId="commenterName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      required
                      name="name"
                      value={name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama"
                    />
                  </Form.Group>
                  <Form.Group className="m-1" controlId="commentContent">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      required
                      name="content"
                      value={content}
                      onChange={handleInputChange}
                      as="textarea"
                      rows={3}
                      placeholder="Masukkan komentar"
                    />
                  </Form.Group>
                  <Button type="submit" className="m-1" variant="primary">
                    Kirim
                  </Button>
                </Card.Body>
              </Card>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Post;
