import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useLoaderData, useParams, Link } from 'react-router-dom'
import Post from '../components/Post.js'
import { socket } from '../socket.js'

function Pagination({ id, type, postTotal }) {
  if(!postTotal) return
  return (
    <div>
      {id > 1 ? <Button as={Link} to={`${type != "main" ? `/${type}` : ""}/page/${id - 1}`}>{"<"}</Button> : ""}
      <Button as={Link} disabled>{id}</Button>
      {id < Math.ceil(postTotal / 10) ? <Button as={Link} to={`${type != "main" ? `/${type}` : ""}/page/${id + 1}`}>{">"}</Button> : ""}
    </div>
  )
}

function Posts({ type }) {
  const id = parseInt(useParams().id) || 1
  const { data } = useLoaderData()
  const [posts, setPosts] = useState(data.posts)

  document.title = `Menfess | ${[type.split("")[0].toUpperCase(), ...type.split("").splice(1)].join("")} | ${data.postTotal ? `Page ${id}` : "Search"}`

  useEffect(() => {
    const handleNewPost = (typeParam, post) => {
      if(id != 1 || !data.postTotal) return
      if(type != typeParam) return
      setPosts([post, ...posts.slice(0, 9)])
    }

    const handleAddLike = (typeParam, noteIdParam) => {
      if(type != typeParam) return
      const postIndex = posts.findIndex(({ noteId }) => noteId == noteIdParam)
      if (postIndex === -1) return
      setPosts([...posts.slice(0, postIndex), { ...posts[postIndex], like: posts[postIndex].like + 1 }, ...posts.slice(postIndex + 1)])
    }

    socket.on("newPost", handleNewPost)
    socket.on("addLike", handleAddLike)

    return () => {
      socket.off("newPost", handleNewPost)
      socket.off("addLike", handleAddLike)
    }
  })

  useEffect(() => {
    setPosts(data.posts)
    window.scrollTo({ top: 0 })
  }, [data])

  return (
    <>
      <h1>{type.toUpperCase()}</h1>
      <div id="posts">
        {posts.map(post => <Post post={post} type={type} key={post.noteId} />)}
      </div>
      <Pagination id={id} type={type} postTotal={data.postTotal} />
    </>
  )
}

export default Posts
