import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { db, firebase } from "../../services/firebase";
import solutionStyles from "../../styles/components/blogs/Comment.module.css";
import moment from "moment";
import { useStateValue } from "../../context/StateProvider";
import { Badge, withStyles, IconButton } from "@material-ui/core";
import { ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
import ReactLinkify from "react-linkify";

const StyledBadge = withStyles((theme) => ({
  badge: {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const Solution = ({ postID, id, by, solution, timestamp, upVotes }) => {
  const [{ user }, dispatch] = useStateValue();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    db.collection("Users")
      .doc(by)
      .get()
      .then((data) => setUserData({ id: data.id, name: data.data().name }));
  }, []);

  const upVote = () => {
    db.collection("Queries")
      .doc(postID)
      .collection("Solutions")
      .doc(id)
      .update({
        upVotes: upVotes?.includes(user?.id)
          ? firebase.firestore.FieldValue.arrayRemove(user?.id)
          : firebase.firestore.FieldValue.arrayUnion(user?.id),
      });
  };

  return (
    <div
      className={solutionStyles.comment}
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <div style={{ flex: 1 }}>
        <Link href={`/profile/${userData?.id}`}>
          <a className={solutionStyles.by}>{userData?.name}</a>
        </Link>
        <p className={solutionStyles.timestamp}>
          {moment(timestamp).fromNow()}
        </p>
        <ReactLinkify>
          <p className={solutionStyles.commentText}>{solution}</p>
        </ReactLinkify>
      </div>
      <IconButton
        style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
        onClick={upVote}
      >
        <StyledBadge
          badgeContent={upVotes?.length}
          color="secondary"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {upVotes?.includes(user?.id) ? (
            <ThumbUp style={{ marginLeft: 4 }} color="primary" />
          ) : (
            <ThumbUpOutlined style={{ marginLeft: 4 }} />
          )}
        </StyledBadge>
      </IconButton>
    </div>
  );
};

export default Solution;