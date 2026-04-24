const home = (req, res) => {
  res.json({
    message: "API REST lista",
    endpoints: ["/", "/marco", "/ping", "/users", "/login", "/app/"],
    frontend: "/app/",
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
