import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLoaderData, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Post from "../components/Post.js";
import { socket } from "../socket.js";

function Posts({ type }) {
  const { data } = useLoaderData();
  const [posts, setPosts] = useState(data.posts);
  const [loading, setLoading] = useState(false);
  const [tamat, setTamat] = useState(false)

  const handleMentok = async () => {
    if (loading || tamat) return;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/${type}/posts?from=${posts.length}&to=${posts.length + 10}`);
      console.log(response); // Check the API response
      if (response.data.posts.length === 0) setTamat(true)
      setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const sentinel = document.querySelector("#sentinel");
    if (sentinel && !loading) {
      const distanceFromBottom = sentinel.getBoundingClientRect().bottom - window.innerHeight;
      if (distanceFromBottom < 1) {
        handleMentok();
      }
    }
  };

  useEffect(() => {
    const handleNewPost = (typeParam, post) => {
      if (type != typeParam) return;
      setPosts([post, ...posts.slice(0, 9)]);
    };

    const handleAddLike = (typeParam, noteIdParam) => {
      if (type != typeParam) return;
      const postIndex = posts.findIndex(({ noteId }) => noteId == noteIdParam);
      if (postIndex === -1) return;
      setPosts([
        ...posts.slice(0, postIndex),
        { ...posts[postIndex], like: posts[postIndex].like + 1 },
        ...posts.slice(postIndex + 1),
      ]);
    };

    socket.on("newPost", handleNewPost);
    socket.on("addLike", handleAddLike);
    // Add event listener for scrolling
    document.addEventListener("scroll", handleScroll);

    return () => {
      socket.off("newPost", handleNewPost);
      socket.off("addLike", handleAddLike);
      document.removeEventListener("scroll", handleScroll);
    }
  }, [posts, loading, type]);

  useEffect(() => {
    setPosts(data.posts);
    window.scrollTo({ top: 0 });
  }, [data]);
    

  return (
    <>
      <Helmet>
        <title>{`Menfess | ${[type.charAt(0).toUpperCase(), ...type.slice(1)].join("")}`}</title>
      </Helmet>

      <div id="posts">
        {posts.map((post) => (
          <Post post={post} type={type} key={post.noteId} />
        ))}
        {/* Add the sentinel element here */}
        <div id="sentinel" style={{ height: "1px" }} />
        <p>{loading ? "Loading..." : tamat ? "Dah mentok bang" : ""}</p>
      </div>
    </>
  )
}

export default Posts;
