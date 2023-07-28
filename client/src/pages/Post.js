import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Col, Row } from "react-bootstrap";
import { useLoaderData } from "react-router";
import PostCard from "../components/Post.js";
import { socket } from "../socket";

function Comments({ comments }) {
  if (!comments || !comments.length) return <div>Belum ada comment</div>;
  return comments.map((comment) => (
    <Card className="mb-3 m-1 bg-secondary text-white" key={comment.commentId}>
      <Card.Body>
        <Card.Title>{comment.commenterName}</Card.Title>
        <Card.Text>{comment.commentContent}</Card.Text>
      </Card.Body>
    </Card>
  ));
}

function Post({ type }) {
  const [post, setPost] = useState(useLoaderData().data.post);
  const initValue = { name: "", content: "" };
  const [commentFormData, setCommentFormData] = useState(initValue);
  const { name, content } = commentFormData;

  document.title = `Menfess | ${[
    type.split("")[0].toUpperCase(),
    ...type.split("").splice(1),
  ].join("")} | Post ${post.noteId}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentFormData({ ...commentFormData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/${type}/comment/${post.noteId}`, commentFormData);
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
              <Card className="mb-3 m-1 bg-secondary text-white">
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
