/**
 * using zod library to validate the request params
 * @param {*} schema zod
 * @returns
 */
const validate = schema => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (err) {
      return res.status(400).send(err.errors);
    }
  };
};

module.exports = validate;