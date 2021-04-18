import {
  LanguageOutlined,
  SearchOutlined,
  SendRounded,
} from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import footerStyles from "../styles/components/Footer.module.css";

const Footer = () => {
  const [contactString, setContactString] = useState();

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.top}>
        <div className={footerStyles.mobileDiv}>
          <a
            className={footerStyles.website}
            href="https://gpabad.ac.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LanguageOutlined style={{ marginRight: 7 }} /> Website
          </a>
          <div
            className={`${footerStyles.searchDivMobile} ${footerStyles.searchDiv}`}
          >
            &nbsp;Search
            <SearchOutlined style={{ marginLeft: 7 }} fontSize="small" />
          </div>
        </div>
        <div className={footerStyles.contactForm}>
          <input
            required
            minLength={6}
            maxLength={6}
            type="text"
            className={footerStyles.input}
            placeholder="Contact Us"
            value={contactString}
            onChange={(e) => setContactString(e.target.value)}
          />
          <a
            target="_top"
            href={`mailto:gpa.forum2021@gmail.com?subject=Regarding GPA Forum&body=${contactString}`}
            rel="noopener noreferrer"
          >
            <SendRounded
              style={{ marginRight: 4, marginTop: 2 }}
              fontSize="small"
            />
          </a>
        </div>
        <div
          className={`${footerStyles.searchDivPC} ${footerStyles.searchDiv}`}
        >
          &nbsp;Search
          <SearchOutlined style={{ marginLeft: 7 }} fontSize="small" />
        </div>
      </div>
      <p className={footerStyles.copyright}>
        Copyright &copy; GPA (Government Polytechnic, Aurangabad)
      </p>
    </footer>
  );
};

export default Footer;