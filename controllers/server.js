const handleActivator = (req, res) => {
  console.log("Requested");
  return res.status(200).json({ msg: "Activated" });
};

module.exports = {
  handleActivator,
};
