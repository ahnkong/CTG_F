import React from "react";
import "styles/page.css";

const Page = ({ children, scrollable = true, className = "", type = "default" }) => {
  return (
    <div className={`page ${scrollable ? "scrollable" : "no-scroll"} ${className} page-type-${type}`}>
      {children}
    </div>
  );
};

export default Page;
