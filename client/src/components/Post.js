import React from "react"
import { Link } from "react-router-dom"
import { Button, Card, Col, Row } from "react-bootstrap"
import axios from "axios"

function Post({ post, type }) {
  const handleShare = () => {
    const copyText = `${process.env.REACT_APP_BASE_URL}${type != "main" ? `${type}/` : ""}post/${post.noteId}`
    const shareData = {
      title: "Menfess!!",
      text: `Sebuah Post dari ${post.noteName}`,
      url: copyText,
    }

    if (navigator.canShare(shareData)) navigator.share(shareData)
    else {
      navigator.clipboard.writeText(copyText)
      alert("Udah di copy nih, silahkan share ke temen kamu ya:3 (itupun kalo klean punya temen)")
    }
  }
  return (
    <Card>
      <Card.Body>
        <Card.Title>{post.noteName}</Card.Title>
        <Card.Text>{post.noteContent}</Card.Text>
      </Card.Body>
      <Card.Img
        variant="bottom"
        src={`${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}image${type != "main" ? type : ""}-${post.noteId}.jpg`}
        onError={(e) => e.target.remove()}
      />
      <Card.Footer>
        <Row>
          <Col>
            <Button onClick={() => axios.post(`/api/${type}/like/${post.noteId}`)}>
              {`${post.like} `}Like
            </Button>
          </Col>
          <Col>
            <Button as={Link} to={`/${type != "main" ? `${type}/` : ""}post/${post.noteId}`}>
              {`${post.comment.length} `}Comment
            </Button>
          </Col>
          <Col>
            <Button onClick={handleShare}>Share</Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  )
}

export default Post
