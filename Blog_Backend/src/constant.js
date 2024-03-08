const DB_NAME = "BLOG_WEB";

const options = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 24,
};

export { DB_NAME, options };
