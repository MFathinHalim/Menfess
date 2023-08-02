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

const createPostsLoader = type => () => axios.get(`${process.env.REACT_APP_API_BASE_URL}/${type}/posts?from=0&to=20`)

const createSearchLoader = type => ({ request }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/${type}/posts?search=${query}`)
}

const createPostLoader = type => ({ params: { id } }) => axios.get(`${process.env.REACT_APP_API_BASE_URL}/${type}/post/${id}`)

const shouldRevalidate = ({ currentParams: { id: currentId = 1 }, nextParams: { id: nextId = 1 } }) => currentId !== nextId

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} errorElement={<ErrorBoundary />}>
      <Route index shouldRevalidate={shouldRevalidate} loader={createPostsLoader("main")} element={<Posts type="main" />} />
      <Route path="search" loader={createSearchLoader("main")} element={<Posts type="main" />} />
      <Route path="post/:id" shouldRevalidate={shouldRevalidate} loader={createPostLoader("main")} element={<Post type="main" />}/>
      <Route path="memes">
        <Route index shouldRevalidate={shouldRevalidate} loader={createPostsLoader("memes")} element={<Posts type="memes" />} />
        <Route path="search" loader={createSearchLoader("memes")} element={<Posts type="memes" />} />
        <Route path="post/:id" shouldRevalidate={shouldRevalidate} loader={createPostLoader("memes")} element={<Post type="memes" />}/>
      </Route>
      <Route path="anime">
        <Route index shouldRevalidate={shouldRevalidate} loader={createPostsLoader("anime")} element={<Posts type="anime" />} />
        <Route path="search" loader={createSearchLoader("anime")} element={<Posts type="anime" />} />
        <Route path="post/:id" shouldRevalidate={shouldRevalidate} loader={createPostLoader("anime")} element={<Post type="anime" />}/>
      </Route>
    </Route>
  )
)

function Router() {
  return <RouterProvider router={router} />
}

export default Router