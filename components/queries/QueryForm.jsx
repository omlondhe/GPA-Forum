// import React, { useState, useEffect } from "react";
// import queryFormStyles from "../../styles/components/queries/QueryForm.module.css";
// import { SchoolOutlined } from "@material-ui/icons";
// import CreateIcon from "@material-ui/icons/Create";
// import { db, firebase } from "../../services/firebase";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Button from "@material-ui/core/Button";
// import { useStateValue } from "../../context/StateProvider";
// import { useRouter } from "next/router";
// import Slide from "@material-ui/core/Slide";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";

// const Transition = React.forwardRef((props, ref) => {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const PostQuery = ({ open, fetchQueries, handleClose }) => {
//   const [{ user }, dispatch] = useStateValue();
//   const [queryType, setQueryType] = useState("");
//   const [query, setQuery] = useState("");
//   const [posting, setPosting] = useState(false);

//   const options = [
//     user?.branch?.title,
//     "Exam Cell",
//     "Library",
//     "Student Section",
//   ];

//   const StoreQuery = () => {
//     if (query.trim().length < 10) {
//       alert("Your query must be at least 10 characters long.");
//     } else if (!queryType) {
//       alert("Kindly select query type.");
//     } else {
//       setPosting(true);
//       db.collection("Queries")
//         .add({
//           query,
//           queryType,
//           by: user?.id,
//           upVotes: [],
//           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//         })
//         .then(() => {
//           fetchQueries();
//           setQuery("");
//           setPosting(false);
//           handleClose();
//         });
//     }
//   };

//   useEffect(() => {
//     user && setQueryType(user?.branch?.title);
//   }, [user]);

//   return (
//     <Dialog
//       TransitionComponent={Transition}
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="form-dialog-title"
//       fullWidth={true}
//     >
//       <DialogTitle id="form-dialog-title">Post a Query</DialogTitle>
//       <DialogContent>
//         <div className={queryFormStyles.queryInputDiv}>
//           <CreateIcon
//             fontSize="small"
//             style={{ marginLeft: 4, color: "grey" }}
//           />
//           <TextareaAutosize
//             placeholder={`Enter your Query`}
//             autoFocus
//             id="query-input"
//             type="text"
//             className={queryFormStyles.queryInput}
//             onChange={(e) => setQuery(e.target.value)}
//             value={query}
//           />
//         </div>

//         <div className={queryFormStyles.queryInputDiv}>
//           <SchoolOutlined style={{ color: "grey" }} />
//           <select
//             onChange={(e) => setQueryType(e.target.value)}
//             value={queryType}
//             required
//             className={queryFormStyles.queryInput}
//           >
//             {options.sort().map((option, index) => (
//               <option key={index} value={option} style={{ borderRadius: 4 }}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>
//         {/* <Autocomplete
//           clearOnBlur={false}
//           disableClearable
//           onChange={(e, v) => setQueryType(v)}
//           options={branchData}
//           getOptionLabel={(option) => option}
//           defaultValue={branch}
//           renderInput={(params) => (
//             <div
//               className={queryFormStyles.queryInputDiv}
//               ref={params.InputProps.ref}
//             >
//               <SchoolOutlined style={{ color: "grey" }} />
//               <input
//                 value={branch}
//                 required
//                 {...params.inputProps}
//                 type="text"
//                 className={queryFormStyles.queryInput}
//                 placeholder="Select your branch"
//               />
//             </div>
//           )}
//         /> */}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="primary">
//           Cancel
//         </Button>
//         {posting ? (
//           <div className="progress-div">
//             <CircularProgress size={24} style={{ color: "black" }} />
//           </div>
//         ) : (
//           <Button onClick={StoreQuery} color="primary">
//             Post
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };
// export default PostQuery;

import React, { useState, useEffect } from "react";
import queryFormStyles from "../../styles/components/queries/QueryForm.module.css";
import { SchoolOutlined } from "@material-ui/icons";
import CreateIcon from "@material-ui/icons/Create";
import { db, firebase } from "../../services/firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../context/StateProvider";
import { useRouter } from "next/router";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import DialogContentText from "@material-ui/core/DialogContentText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import stringSimilarity from "string-similarity";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostQuery = ({ open, fetchQueries, handleClose }) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [queryType, setQueryType] = useState("");
  const [query, setQuery] = useState("");
  const [posting, setPosting] = useState(false);
  const [openSimilarQueryDialog, setOpenSimilarQueryDialog] = useState(false);
  const [queries, setQueries] = useState([]);
  const [id, setId] = useState("");
  const [similarQuery, setSimilarQuery] = useState("");
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const [openQueryPostDialog, setOpenQueryPostDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseSimilarQuery = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSimilarQueryDialog(false);
  };

  useEffect(() => {
    db.collection("Queries").onSnapshot((snapshot) =>
      setQueries(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          query: doc.data().query,
        }))
      )
    );
  }, []);

  const searchSimilarQueries = () => {
    setPosting(true);
    const arrayOfQueries = [];

    for (var i = 0; i < queries.length; i++) {
      arrayOfQueries.push(queries[i].query.toLowerCase());
    }

    var bestMatchedQueries = stringSimilarity.findBestMatch(
      query.toLowerCase(),
      arrayOfQueries
    );

    var probability = bestMatchedQueries.bestMatch.rating;
    probability *= 10;
    probability = Math.round(probability);

    setPosting(false);
    if (probability >= 5) {
      setId(bestMatchedQueries.bestMatchIndex);
      setSimilarQuery(bestMatchedQueries.bestMatch.target);
      setOpenSimilarQueryDialog(true);
    } else {
      StoreQuery();
    }
  };

  const options = [
    user?.branch?.title,
    "Exam Cell",
    "Library",
    "Student Section",
  ];

  const StoreQuery = () => {
    handleCloseSimilarQuery();
    if (query.trim().length < 10) {
      alert("Your query must be at least 10 characters long.");
    } else if (!queryType) {
      alert("Kindly select query type.");
      setPosting(false);
    } else {
      setPosting(true);
      db.collection("Queries")
        .add({
          query,
          queryType,
          by: user?.id,
          upVotes: [],
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          fetchQueries();
          setQuery("");
          setPosting(false);
          handleClose();
        })
        .catch((err) => alert(err));
    }
  };

  useEffect(() => {
    user && setQueryType(user?.branch?.title);
  }, [user]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        TransitionComponent={Transition}
      >
        <DialogTitle id="form-dialog-title">Post a Query</DialogTitle>
        <DialogContent>
          <div className={queryFormStyles.queryInputDiv}>
            <CreateIcon
              fontSize="small"
              style={{ marginLeft: 4, color: "grey" }}
            />
            <TextareaAutosize
              placeholder={`Enter your Query`}
              autoFocus
              id="query-input"
              type="text"
              className={queryFormStyles.queryInput}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>

          <div className={queryFormStyles.queryInputDiv}>
            <SchoolOutlined style={{ color: "grey" }} />
            <select
              onChange={(e) => setQueryType(e.target.value)}
              value={queryType}
              required
              className={queryFormStyles.queryInput}
            >
              {options.sort().map((option, index) => (
                <option key={index} value={option} style={{ borderRadius: 4 }}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {posting ? (
            <div className="progress-div">
              <CircularProgress size={24} style={{ color: "black" }} />
            </div>
          ) : (
            <Button onClick={searchSimilarQueries} color="primary">
              Post
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openSimilarQueryDialog}
        TransitionComponent={Transition}
        onClose={handleCloseSimilarQuery}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"We have found similar query"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            We found "{similarQuery}" query. Click <strong>view more</strong> to
            check similar query
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCloseSimilarQuery();
              handleClose();
              router.push(`/queries/${queries[id].id}`);
            }}
            color="primary"
          >
            View more
          </Button>
          <Button onClick={StoreQuery} color="primary" autoFocus>
            Proceed with my query
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default PostQuery;
