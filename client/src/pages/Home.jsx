import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const location = useLocation(); // Use location to access the URL query parameters

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cat = searchParams.get('cat'); // Get the category
    const term = searchParams.get('term'); // Get the search term
    const type = searchParams.get('type'); // Get the search type(s)

    const fetchData = async () => {
      try {
        // Construct the query parameters for the request
        const queryParams = new URLSearchParams();
        if (term) queryParams.append('search', term);
        if (type) queryParams.append('type', type);
        if (cat) queryParams.append('cat', cat);

        const res = await axios.get(`/posts?${queryParams.toString()}`); // Use the constructed query parameters in the request
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [location.search]); // Rerun the effect if the search query changes

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    let text = doc.body.textContent || "";
    if (text.length > 70) {
      text = text.substring(0, 70) + "...";
    }
    return text;
  };

  return (
    <div className="home">
      {posts.length > 0 ? (
        <div className="posts">
          {posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="img">
                <img src={`../upload/${post.img}`} alt="" />
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
                <p style={{ wordWrap: "break-word" }}>{getText(post.desc)}</p>
                <Link to={`/post/${post.id}`}>
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-matches">No matches</div> // Display when no posts are found
      )}
    </div>
  );
};

export default Home;
