import React, { useState } from "react";
import { useStateValue } from "../../context/StateProvider";
import { db } from "../../services/firebase";
import blogPageStyles from "../../styles/pages/blogs/BlogPage.module.css";
import { Divider } from "@material-ui/core";
import BlogPostListItem from "../../components/blogs/BlogPostListItem";
import { AnimatePresence, motion } from "framer-motion";
import { pageAnimationVariant } from "../../services/utilities";
import { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import BlogEditForm from "../../components/blogs/BlogEditForm";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProfileBlog = ({ userID }) => {
  const [{ user }, dispatch] = useStateValue();
  const [blogs, setBlogs] = useState([]);
  const [openBlogCopy, setOpenBlogCopy] = useState(false);
  const [currentID, setCurrentID] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const handleClickBlogCopy = () => {
    setOpenBlogCopy(true);
  };

  const handleCloseBlogCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBlogCopy(false);
  };

  const fetchBlogs = () => {
    db.collection("Blogs")
      .where("by", "==", userID)
      .get()
      .then((snapshot) =>
        setBlogs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            image: doc.data().image,
            title: doc.data().title,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            by: doc.data().by,
          }))
        )
      );
  };

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  return (
    <motion.div
      className={blogPageStyles.main_page}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <BlogEditForm
        open={openEdit}
        fetchBlogs={fetchBlogs}
        handleClose={setOpenEdit}
        setUpdateOpen={setUpdateOpen}
        id={currentID}
        setCurrentID={setCurrentID}
      />
      <Snackbar
        open={openBlogCopy}
        autoHideDuration={6000}
        onClose={handleCloseBlogCopy}
      >
        <Alert onClose={handleCloseBlogCopy} severity="success">
          Blog URL copied!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteOpen}
        autoHideDuration={6000}
        onClose={() => setDeleteOpen(false)}
      >
        <Alert onClose={() => setDeleteOpen(false)} severity="warning">
          Blog post deleted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={updateOpen}
        autoHideDuration={6000}
        onClose={() => setUpdateOpen(false)}
      >
        <Alert onClose={() => setUpdateOpen(false)} severity="info">
          Blog post updated!
        </Alert>
      </Snackbar>
      <AnimatePresence>
        {blogs.map((blog, index) => (
          <>
            <BlogPostListItem
              index={index > 0 ? index / 7 : index}
              id={blog?.id}
              key={blog?.id}
              image={blog?.image}
              title={blog?.title}
              text={blog?.text}
              timestamp={blog?.timestamp}
              by={blog?.by}
              handleClickBlogCopy={handleClickBlogCopy}
              setDeleteOpen={setDeleteOpen}
              fetchBlogs={fetchBlogs}
              setCurrentID={setCurrentID}
              setOpenEdit={setOpenEdit}
            />
            <Divider style={{ width: "80%", margin: "auto" }} />
          </>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileBlog;
