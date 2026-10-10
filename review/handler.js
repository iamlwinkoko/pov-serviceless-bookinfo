exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello Bookinfo Review app",
    }),
  };
};

exports.review1 = exports.hello;
exports.review2 = exports.hello;
exports.review3 = exports.hello;
