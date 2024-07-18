import React, { createContext } from "react";
import tempBlogData from "../Pages/temp-Blog-Data";

export const BlogContext = createContext(null);

const BlogContextProvider = (props) => {
    const contextValue = {tempBlogData}

    return (
        <BlogContext.Provider value={contextValue}>
            {props.children}
        </BlogContext.Provider>
    )
}

export default BlogContextProvider;