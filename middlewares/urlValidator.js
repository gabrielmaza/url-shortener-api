const { URL } = require("url");

const urlValidator = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFrontend = new URL(origin);
    if (urlFrontend.origin !== null) {
      if (
        urlFrontend.protocol === "http:" ||
        urlFrontend.protocol === "https:"
      ) {
        return next();
      }
      throw new Error("Debe contener http:// o https://");
    }
    throw new Error("URL no válida 😫");
  } catch (error) {
    if (error.message === "Invalid URL") {
      req.flash("mensajes", [{ msg: "URL no válida" }]);
    } else {
      req.flash("mensajes", [{ msg: error.message }]);
    }
    return res.redirect("/");
  }
};

module.exports = urlValidator;
