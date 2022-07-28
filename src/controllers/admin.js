const { User } = require("../db");

const setAdmin = async (req, res) => {
  const { email } = req.params;

  let setAdmin = true;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user.isAdmin) {
      setAdmin = false;
    }
    const newAdmin = await User.update(
      {
        isAdmin: setAdmin,
      },
      { where: { email: email } }
    );
    return res.status(200).send(newAdmin);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll();
    if (!user) {
      return res.status(404).send("Users Not Found");
    }
    return res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error);
  }
};

const disableAccount = async (req, res) => {
  const { email } = req.params;
  let ban = true;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (user.banned) {
      ban = false;
    }

    const disabledAcc = await User.update(
      {
        banned: ban,
      },
      { where: { email: email } }
    );
    return res.status(201).send(disabledAcc);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports = { getAllUsers, disableAccount, setAdmin };
