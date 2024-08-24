const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(err);
  return res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default ErrorHandler;
