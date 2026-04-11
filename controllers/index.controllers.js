const home = (req, res) => {
  res.json({
    message: "API REST lista",
    endpoints: ["/", "/marco", "/ping", "/users", "/login"],
  });
};

const marco = (req, res) => {
  res.json({ message: "polo" });
};

const ping = (req, res) => {
  res.json({ message: "pong" });
};

module.exports = {
  home,
  marco,
  ping,
};
