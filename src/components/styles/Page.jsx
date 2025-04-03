import React from "react";
import "styles/page.css";

const Page = ({ children, scrollable = true, className = "" }) => {
  return (
    <div className={`page ${scrollable ? "scrollable" : "no-scroll"} ${className}`}>
      {children}
    </div>
  );
};

export default Page;
