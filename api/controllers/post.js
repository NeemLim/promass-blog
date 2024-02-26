import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  let q;

  const cat = req.query.cat ? req.query.cat.trim() : null;
  const search = req.query.search;
  const type = req.query.type; // The type of search (e.g., "all", "title", "content", "author")

  if (cat) {
    // If there's a category filter
    q = "SELECT * FROM posts WHERE cat=?";
    db.query(q, [cat], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    });
  } else if (search) {
    // Determine the fields to search based on the 'type' parameter
    let fieldsToSearch = [];
    if (type === "all") {
      // Search in all fields if 'type' is "all"
      fieldsToSearch = ["p.title LIKE ?", "p.desc LIKE ?", "u.username LIKE ?"];
    } else {
      // Otherwise, search in the specified field
      if (type === "title") fieldsToSearch.push("p.title LIKE ?");
      if (type === "content") fieldsToSearch.push("p.desc LIKE ?");
      if (type === "author") fieldsToSearch.push("u.username LIKE ?");
    }

    // Construct the query based on the fields to search
    q = `
      SELECT p.*, u.username 
      FROM posts p 
      JOIN users u ON u.id = p.uid 
      WHERE ${fieldsToSearch.join(" OR ")}`;
    const likeQuery = `%${search}%`;

    // Prepare the parameters for the query
    const queryParams = fieldsToSearch.map(() => likeQuery);

    db.query(q, queryParams, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    });
  } else {
    // If there are no filters, select all posts
    q = "SELECT * FROM posts";
    db.query(q, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    });
  }
};

export const getPost = (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};
