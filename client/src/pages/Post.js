import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLoaderData } from 'react-router'
import PostCard from "../components/Post.js"
import { socket } from '../socket'

function Comments({ comments }) {
  if (!comments || !comments.length) return <div>Belum ada comment</div>
  return comments.map((comment) => (
    <div key={comment.commentId}>
      <h2>{comment.commenterName}</h2>
      <p>{comment.commentContent}</p>
    </div>
  ))
}

function Post({ type }) {
  const [post, setPost] = useState(useLoaderData().data.post)
  const initValue = { name: "", content: "" }
  const [commentFormData, setCommentFormData] = useState(initValue)
  const { name, content } = commentFormData

  document.title = `Menfess | ${[type.split("")[0].toUpperCase(), ...type.split("").splice(1)].join("")} | Post ${post.noteId}`

  const handleInputChange = e => {
    const { name, value } = e.target
    setCommentFormData({ ...commentFormData, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await axios.post(`/api/${type}/comment/${post.noteId}`, commentFormData)
    setCommentFormData(initValue)
  }
  
  useEffect(() => {
    const handleNewComment = (typeParam, noteId, comment) => {
      if(type != typeParam) return
      if(post.noteId != noteId) return
      setPost({ ...post, comment: [...post.comment, comment] })
    }

    const handleAddLike = (typeParam, noteId) => {
      if(type != typeParam) return
      if (post.noteId != noteId) return
      setPost({ ...post, like: post.like + 1 })
    }

    socket.on("newComment", handleNewComment)
    socket.on("addLike", handleAddLike)

    return () => {
      socket.off("newComment", handleNewComment)
      socket.off("addLike", handleAddLike)
    }
  })

  return (
    <>
      <PostCard post={post} type={type} />
      <div id="comments">
        <h1>Daftar Comment</h1>
        <Comments comments={post.comment} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commenterName">
          <Form.Label>Name</Form.Label>
          <Form.Control required name="name" value={name} onChange={handleInputChange} placeholder="Masukkan nama" />
        </Form.Group>
        <Form.Group controlId="commentContent">
          <Form.Label>Comment</Form.Label>
          <Form.Control required name="content" value={content} onChange={handleInputChange} placeholder="Masukkan komentar" />
        </Form.Group>
        <Button type="submit" variant="primary">Kirim</Button>
      </Form>
    </>
  )
}

export default Post
