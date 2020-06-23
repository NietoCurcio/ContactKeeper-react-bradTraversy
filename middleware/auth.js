// middleware is to run at every lifecycle req, res and pass the lifecycle to the next route
// check token in the header
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // this next move on to the next middleware,
  // which I alredy read

  //   Get the token from the header
  const token = req.header('x-auth-token');
  // like we can req.body (data in body), req.params (variable or id in the URL), req.query optinal query params

  //   check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // the payload, the object is gonna be put in decoded var

    req.user = decoded.user; // because remenber in our payload object have user: {id: user.id}
    // assign the user to the request object
    // console.log(req.user);
    next();
    // necessary to a middleware, as we saw in express docs
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
