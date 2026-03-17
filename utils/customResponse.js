function customResponse(res, status, success, message = null, err = null, data = null) {
  return res.status(status).json({ success, message, err, data});
} // prettier-ignore

export default customResponse;
