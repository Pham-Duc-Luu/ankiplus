const errResponse = {
  response: {
    message: "Missing email or password",
    error: "Bad Request",
    statusCode: 400,
  },
  status: 400,
  options: {},
  message: "Missing email or password",
  name: "BadRequestException",
};

export type ErrResponse = typeof errResponse;
