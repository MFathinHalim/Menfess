import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";

function formatLikeCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return count;
  }
}
const ColoredLine = ({ color }) => (
  <hr
    style={{
      background: "white",
      color: "white",
      borderColor: "white",
      height: "3px",
      width: "100%",
    }}
  />
);
function Post({ post, type }) {
  const handleShare = useCallback(() => {
    const copyText = `${window.location.origin}/${type !== "main" ? `${type}/` : ""
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
        className="mb-3 text-left text-white p-1 bg-transparent border-0"
        style={{ width: "500px", objectFit: "contain" }}>
        <Card.Body>
          <Card.Text style={{ color: "#C44900" }} className="m-1">
            {post.noteName}
          </Card.Text>
          <Card.Img
            variant="bottom"
            src={`${process.env.REACT_APP_IMAGEKIT_URLENDPOINT}/image${type !== "main" ? type : ""
              }-${post.noteId}.jpg`}
            onError={(e) => e.target.remove()}
            alt={`Image for post ${post.noteName}`}
            className="img-fluid gradient-bg m-1"
            style={{
              width: "500px",
              height: "auto",
              objectFit: "scale-down",
              borderRadius: "10px",
            }}
          />

          <Card.Text className="m-1">{post.noteContent}</Card.Text>
        </Card.Body>

        <Card.Footer>
          <Row className="justify-content-around align-items-center">
            <Col xs="auto" sm="auto">
              <Button
                variant="primary"
                className="twitter-button bg-transparent border-0 text-white"
                onClick={() =>
                  axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/${type}/like/${post.noteId}`
                  )
                }>
                <FontAwesomeIcon icon={faHeart} />{" "}
                {`${formatLikeCount(post.like)} `}
              </Button>
            </Col>
            <Col xs="auto" sm="auto">
              <Button
                variant="success"
                as={Link}
                to={`/${type !== "main" ? `${type}/` : ""}post/${post.noteId}`}
                className="twitter-button bg-transparent border-0 text-white">
                <FontAwesomeIcon icon={faComment} /> Komen
              </Button>
            </Col>
            <Col xs="auto" sm="auto">
              <Button
                variant="info"
                onClick={handleShare}
                className="twitter-button bg-transparent border-0 text-white">
                <FontAwesomeIcon icon={faShare} /> Bagi
              </Button>
            </Col>
          </Row>
        </Card.Footer>
        <ColoredLine color="#ccc" />
      </Card>
    </div>
  );
}

export default Post;
