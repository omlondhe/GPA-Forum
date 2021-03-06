import { IconButton } from "@material-ui/core";
import {
  ExitToAppOutlined,
  KeyboardArrowLeftRounded,
  MenuRounded,
  SearchRounded,
} from "@material-ui/icons";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  mobileNavbarAnimationVariant,
  pageNavbarAnimationVariant,
} from "../services/utilities";
import navbarStyles from "../styles/components/Navbar.module.css";
import Link from "next/link";
import { useStateValue } from "../context/StateProvider";
import { useRouter } from "next/router";
import { actionTypes } from "../context/reducer";
import { BootstrapTooltip } from "../services/utilities";

const Navbar = () => {
  const router = useRouter();
  const [{ user, searchString }, dispatch] = useStateValue();
  const [showMe, setShowMe] = useState(false);

  const toggle = (e) => {
    if (showMe) {
      document.getElementById("toggle-button").style.transform = "rotate(0deg)";
    } else {
      document.getElementById("toggle-button").style.transform =
        "rotate(-270deg)";
    }

    setShowMe(!showMe);
  };
  const logOut = () => {
    localStorage.removeItem("forumUserID");
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
    });
    router.replace("/auth/login");
  };

  useEffect(() => {
    if (window.innerWidth > 1020) {
      setShowMe(true);
    } else {
      setShowMe(false);
    }
    window.onresize = () => {
      if (window.innerWidth > 1020) {
        setShowMe(true);
      }
      //  else {
      //   setShowMe(false);
      // }
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1020) {
      setShowMe(false);
      document.getElementById("toggle-button").style.transform = "rotate(0deg)";
    }
    // const logo = document.querySelectorAll("#nav-svg g ellipse");
    // for (let i = 0; i < logo.length; i++) {
    //   console.log(`Letter: ${i} is  ${logo[i].getTotalLength()}`);
    // }
  }, [router.pathname]);

  return (
    <motion.nav
      className={navbarStyles.nav}
      style={{ maxHeight: showMe ? 500 : 75 }}
      variants={pageNavbarAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Link href={user ? `/queries` : `/`}>
        <a className={navbarStyles.logo}>
          <svg
            id="nav-svg"
            width="145"
            height="56"
            viewBox="0 0 145 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.75">
              <path
                d="M30.0469 39.6875C28.7812 41.2031 26.9922 42.3828 24.6797 43.2266C22.3672 44.0547 19.8047 44.4688 16.9922 44.4688C14.0391 44.4688 11.4453 43.8281 9.21094 42.5469C6.99219 41.25 5.27344 39.375 4.05469 36.9219C2.85156 34.4688 2.23438 31.5859 2.20312 28.2734V25.9531C2.20312 22.5469 2.77344 19.6016 3.91406 17.1172C5.07031 14.6172 6.72656 12.7109 8.88281 11.3984C11.0547 10.0703 13.5938 9.40625 16.5 9.40625C20.5469 9.40625 23.7109 10.375 25.9922 12.3125C28.2734 14.2344 29.625 17.0391 30.0469 20.7266H23.2031C22.8906 18.7734 22.1953 17.3438 21.1172 16.4375C20.0547 15.5312 18.5859 15.0781 16.7109 15.0781C14.3203 15.0781 12.5 15.9766 11.25 17.7734C10 19.5703 9.36719 22.2422 9.35156 25.7891V27.9688C9.35156 31.5469 10.0312 34.25 11.3906 36.0781C12.75 37.9062 14.7422 38.8203 17.3672 38.8203C20.0078 38.8203 21.8906 38.2578 23.0156 37.1328V31.25H16.6172V26.0703H30.0469V39.6875ZM42.7969 31.9766V44H35.7656V9.875H49.0781C51.6406 9.875 53.8906 10.3438 55.8281 11.2812C57.7812 12.2188 59.2812 13.5547 60.3281 15.2891C61.375 17.0078 61.8984 18.9688 61.8984 21.1719C61.8984 24.5156 60.75 27.1562 58.4531 29.0938C56.1719 31.0156 53.0078 31.9766 48.9609 31.9766H42.7969ZM42.7969 26.2812H49.0781C50.9375 26.2812 52.3516 25.8438 53.3203 24.9688C54.3047 24.0938 54.7969 22.8438 54.7969 21.2188C54.7969 19.5469 54.3047 18.1953 53.3203 17.1641C52.3359 16.1328 50.9766 15.6016 49.2422 15.5703H42.7969V26.2812ZM81.8438 36.9688H69.5156L67.1719 44H59.6953L72.3984 9.875H78.9141L91.6875 44H84.2109L81.8438 36.9688ZM71.4141 31.2734H79.9453L75.6562 18.5L71.4141 31.2734Z"
                stroke="white"
                strokeWidth="1"
              />
              <ellipse cx="49" cy="21.5" rx="11" ry="8.5" />
              <path d="M76 15L82.0622 32.25H69.9378L76 15Z" />
              <path d="M100.842 37.7705H95.7793V43H93.1426V30.2031H101.475V32.3389H95.7793V35.6436H100.842V37.7705ZM102.248 38.1572C102.248 37.2139 102.43 36.373 102.793 35.6348C103.156 34.8965 103.678 34.3252 104.357 33.9209C105.043 33.5166 105.837 33.3145 106.739 33.3145C108.022 33.3145 109.068 33.707 109.877 34.4922C110.691 35.2773 111.146 36.3438 111.239 37.6914L111.257 38.3418C111.257 39.8008 110.85 40.9727 110.035 41.8574C109.221 42.7363 108.128 43.1758 106.757 43.1758C105.386 43.1758 104.29 42.7363 103.47 41.8574C102.655 40.9785 102.248 39.7832 102.248 38.2715V38.1572ZM104.788 38.3418C104.788 39.2441 104.958 39.9355 105.298 40.416C105.638 40.8906 106.124 41.1279 106.757 41.1279C107.372 41.1279 107.853 40.8936 108.198 40.4248C108.544 39.9502 108.717 39.1943 108.717 38.1572C108.717 37.2725 108.544 36.5869 108.198 36.1006C107.853 35.6143 107.366 35.3711 106.739 35.3711C106.118 35.3711 105.638 35.6143 105.298 36.1006C104.958 36.5811 104.788 37.3281 104.788 38.3418ZM118.165 35.8721C117.819 35.8252 117.515 35.8018 117.251 35.8018C116.29 35.8018 115.66 36.127 115.361 36.7773V43H112.821V33.4902H115.221L115.291 34.624C115.801 33.751 116.507 33.3145 117.409 33.3145C117.69 33.3145 117.954 33.3525 118.2 33.4287L118.165 35.8721ZM125.091 42.0332C124.464 42.7949 123.597 43.1758 122.489 43.1758C121.47 43.1758 120.69 42.8828 120.151 42.2969C119.618 41.7109 119.346 40.8525 119.334 39.7217V33.4902H121.874V39.6338C121.874 40.624 122.325 41.1191 123.228 41.1191C124.089 41.1191 124.681 40.8203 125.003 40.2227V33.4902H127.552V43H125.161L125.091 42.0332ZM131.85 33.4902L131.929 34.5537C132.603 33.7275 133.514 33.3145 134.662 33.3145C135.887 33.3145 136.728 33.7979 137.185 34.7646C137.853 33.7979 138.805 33.3145 140.041 33.3145C141.072 33.3145 141.84 33.6162 142.344 34.2197C142.848 34.8174 143.1 35.7197 143.1 36.9268V43H140.551V36.9355C140.551 36.3965 140.445 36.0039 140.234 35.7578C140.023 35.5059 139.651 35.3799 139.118 35.3799C138.356 35.3799 137.829 35.7432 137.536 36.4697L137.545 43H135.005V36.9443C135.005 36.3936 134.896 35.9951 134.68 35.749C134.463 35.5029 134.094 35.3799 133.572 35.3799C132.852 35.3799 132.33 35.6787 132.008 36.2764V43H129.468V33.4902H131.85Z" />
              <ellipse cx="107" cy="38.5" rx="3" ry="3.5" />
            </g>
          </svg>
        </a>
      </Link>
      <motion.div
        className={navbarStyles.links}
        variants={mobileNavbarAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ul className={navbarStyles.ul}>
          <li className={navbarStyles.li}>
            <Link href={`/queries`}>
              <a
                className={
                  router.pathname === "/queries" ||
                  router.pathname === "/queries/[queryID]"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Queries
              </a>
            </Link>
          </li>
          <li className={navbarStyles.li}>
            <Link href={`/blogs`}>
              <a
                className={
                  router.pathname === "/blogs" ||
                  router.pathname === "/blogs/[blogID]"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Blogs
              </a>
            </Link>
          </li>
          <li className={navbarStyles.li}>
            <Link href={`/notices`}>
              <a
                className={
                  router.pathname === "/notices"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Notices
              </a>
            </Link>
          </li>
          <li className={navbarStyles.li}>
            <Link href={`/profile`}>
              <a
                className={
                  router.pathname === "/profile"
                    ? navbarStyles.aActive
                    : navbarStyles.a
                }
              >
                Profile
              </a>
            </Link>
          </li>
        </ul>
      </motion.div>

      <div className={navbarStyles.searchAndLogOut}>
        <motion.div
          className={navbarStyles.cont}
          variants={mobileNavbarAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className={navbarStyles.search}
            onClick={() => document.getElementById("search").click()}
          >
            <div
              className={navbarStyles.searchbox}
              onClick={() => document.getElementById("search").click()}
            >
              <input
                type="text"
                id="search"
                placeholder="Search"
                className={navbarStyles.searchtext}
                value={searchString}
                onChange={(e) =>
                  dispatch({
                    type: actionTypes.SET_SEARCH_STRING,
                    searchString: e.target.value,
                  })
                }
              />
              <BootstrapTooltip title="Search">
                <SearchRounded className={navbarStyles.searchbtn} />
              </BootstrapTooltip>
            </div>
          </div>
        </motion.div>
        <BootstrapTooltip title="Log Out">
          <IconButton onClick={logOut} className={navbarStyles.logOutButton}>
            <ExitToAppOutlined style={{ color: "#EE5833" }} />
          </IconButton>
        </BootstrapTooltip>
      </div>

      <IconButton
        id="toggle-button"
        className={navbarStyles.hamburger}
        onClick={toggle}
      >
        {showMe ? (
          <KeyboardArrowLeftRounded style={{ color: "white" }} />
        ) : (
          <MenuRounded style={{ color: "white" }} />
        )}
      </IconButton>
    </motion.nav>
  );
};

export default Navbar;
