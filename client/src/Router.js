import axios from "axios"
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom"
import App from "./App"
import ErrorBoundary from "./ErrorBoundary"
import Post from "./pages/Post"
import Posts from "./pages/Posts"

const shouldRevalidate = ({ currentParams: { id: currentId = 1 }, nextParams: { id: nextId = 1 } }) => currentId !== nextId

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} errorElement={<ErrorBoundary />}>
      <Route path="/" shouldRevalidate={shouldRevalidate} loader={({ params: { id = 1 } }) => axios.get(`/api/main/posts?from=${(id - 1) * 10}&to=${id * 10}`)} element={<Posts type="main" />}>
        <Route path="page">
          <Route path=":id" />
        </Route>
      </Route>
      <Route path="search" loader={({ request }) => {
        const url = new URL(request.url)
        const query = url.searchParams.get("q")
        return axios.get(`/api/main/posts?search=${query}`)
      }} element={<Posts type="main" />} />
      <Route path="post/:id" shouldRevalidate={shouldRevalidate} loader={({ params: { id } }) => axios.get(`/api/main/post/${id}`)} element={<Post type="main" />}/>
      <Route path="memes">
        <Route path="" shouldRevalidate={shouldRevalidate} loader={({ params: { id = 1 } }) => axios.get(`/api/memes/posts?from=${(id - 1) * 10}&to=${id * 10}`)} element={<Posts type="memes" />}>
          <Route path="page">
            <Route path=":id" />
          </Route>
        </Route>
        <Route path="search" loader={({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get("q")
          return axios.get(`/api/memes/posts?search=${query}`)
        }} element={<Posts type="memes" />} />
        <Route path="post/:id" shouldRevalidate={shouldRevalidate} loader={({ params: { id } }) => axios.get(`/api/memes/post/${id}`)} element={<Post type="memes" />}/>
      </Route>
      <Route path="anime">
        <Route path="" shouldRevalidate={shouldRevalidate} loader={({ params: { id = 1 } }) => axios.get(`/api/anime/posts?from=${(id - 1) * 10}&to=${id * 10}`)} element={<Posts type="anime" />}>
          <Route path="page">
            <Route path=":id" />
          </Route>
        </Route>
        <Route path="search" loader={({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get("q")
          return axios.get(`/api/anime/posts?search=${query}`)
        }} element={<Posts type="anime" />} />
        <Route path="post/:id" shouldRevalidate={shouldRevalidate} loader={({ params: { id } }) => axios.get(`/api/anime/post/${id}`)} element={<Post type="anime" />}/>
      </Route>
    </Route>
  )
)

function Router() {
  return <RouterProvider router={router} />
}

export default Router
