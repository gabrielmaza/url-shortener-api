const Url = require("../models/Url");
const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean();
    res.render("home", { urls: urls });
  } catch (error) {
    // console.log(error);
    // res.send("Read url's API error...");
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const agregarUrl = async (req, res) => {
  const { origin } = req.body;
  try {
    const url = new Url({
      origin: origin,
      shortURL: nanoid(7),
      user: req.user.id,
    });
    req.flash("mensajes", [{ msg: "Url agregada" }]);
    await url.save();
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();

    if (!url.user.equals(req.user.id)) {
      throw new Error("No es tu URL");
    }

    return res.render("home", { url });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("No es tu URL");
    }
    await url.updateOne({ origin });
    req.flash("mensajes", [{ msg: "URL editada" }]);
    // await Url.findByIdAndUpdate(id, { origin: origin });
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const eliminarUrl = async (req, res) => {
  const { id } = req.params;
  try {
    // await Url.findByIdAndDelete(id);

    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("No es tu URL");
    }
    await url.remove();
    req.flash("mensajes", [{ msg: "Url eliminada" }]);
    return res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const redirection = async (req, res) => {
  try {
    const { shortURL } = req.params;
    const link = await Url.findOne({ shortURL });

    if (!link) return res.status(404).json({ error: "No existe el link" });

    return res.redirect(link.origin);
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

module.exports = {
  leerUrls,
  agregarUrl,
  editarUrlForm,
  editarUrl,
  eliminarUrl,
  redirection,
};
