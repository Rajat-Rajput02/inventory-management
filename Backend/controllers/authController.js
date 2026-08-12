const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const createActivity = require("../utils/createActivity");
{/*Register API */ }
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({
      email,
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
    await createActivity({
      user: user._id,
      action: "REGISTER",
      module: "Auth",
      description: `${user.name} created an account`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
{/* Login API */ }
exports.login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    res.json({
      token: generateToken(user._id),
      user,
    });
    await createActivity({
      user: user._id,
      action: "LOGIN",
      module: "Auth",
      description: `${user.name} logged in`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};