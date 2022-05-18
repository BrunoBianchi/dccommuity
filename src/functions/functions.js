const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports = {
  ensureAuthenticated(req, res, next) {
    if (req.cookies.token) {
      return next();
    }
    if (req.method === "GET" ) {
      return res.redirect(`/login?uri=${encodeURI(req.path.slice(1))}`);
    } else if (req.method === "POST")
      return res.json({ icon: `error`, msg: `you need to be logged in!` });
  },
}