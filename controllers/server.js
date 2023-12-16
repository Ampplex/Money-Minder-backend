const handleActivator = (req, res) => {
  return res.status(200).json({ msg: "Activated" });
};

module.exports = {
  handleActivator,
};
