import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import axios from "axios";

function formatLikeCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return count;
  }
}

function Post({ post, type }) {
  const handleShare = useCallback(() => {
    const copyText = `${process.env.REACT_APP_BASE_URL}${
      type !== "main" ? `${type}/` : ""
    }post/${post.noteId}`;
    const shareData = {
      title: "Menfess!!",
      text: `Sebuah Post dari ${post.noteName}`,
      url: copyText,
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(copyText);
      alert(
        "Udah di copy nih, silahkan share ke temen kamu ya:3 (itupun kalo klean punya temen)"
      );
    }
  }, [post, type]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card
        className="mb-3 m-2 text-center bg-secondary text-white p-1" // Set background color to gray and text color to white
        style={{ width: "500px", objectFit: "contain" }}>
        <Card.Body>
          <Card.Title>{post.noteName}</Card.Title>
          <Card.Text>{post.noteContent}</Card.Text>
        </Card.Body>
        <Card.Img
          variant="bottom"
          src={`https://ik.imagekit.io/menfessdoma/image${
            type !== "main" ? type : ""
          }-${post.noteId}.jpg`}
          onError={(e) => e.target.remove()}
          alt={`Image for post ${post.noteName}`}
          className="img-fluid"
          style={{
            maxHeight: "500px",
            maxWidth: "500px",
            objectFit: "contain",
          }}
        />
        <Card.Footer>
          <Row className="justify-content-around align-items-center">
            <Col xs="auto" sm="auto">
              <Button
                variant="primary"
                onClick={() => axios.post(`/api/${type}/like/${post.noteId}`)}>
                ♥ {`${formatLikeCount(post.like)} `}
              </Button>
            </Col>
            <Col xs="auto" sm="auto">
              <Button
                variant="success"
                as={Link}
                to={`/${type !== "main" ? `${type}/` : ""}post/${post.noteId}`}>
                Komen
              </Button>
            </Col>
            <Col xs="auto" sm="auto">
              <Button variant="info" onClick={handleShare}>
                Bagi
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Post;
