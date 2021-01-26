import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import SHA256 from 'sha256'
import objectId from '../../utils/generateObject'

connectDb();

export default async (req, res) => {
  const { name, email, password, value } = req.body;
  try {
    // 1) Validate name / email / password
    if (!isLength(name, { min: 3, max: 35 })) {
      return res.status(422).send("Name must be 3-35 characters long");
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send("Password must be at least 6 characters");
    } else if (!isEmail(email)) {
      return res.status(422).send("Email must be valid");
    }
    // 2) Check to see if the user already exists in the db
    const emailLower = email.toLowerCase();
    const user = await User.findOne({ username: emailLower });

    if (user) {
      return res.status(422).send(`User already exists with email ${email}`)
    }
    // 3) --if not, hash their password
    let passwordSHA = SHA256(password)
    const hash = await bcrypt.hash(passwordSHA, 10)
    // 4) create user
    const newUser = await new User({
      _id: objectId(),
      name,
      email: emailLower,
      password: hash,
      username: email,
      roles: [value]
    }).save();

    // 6) create token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    // 7) send back token
    res.status(201).json(token)
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up user. Please try again later")
  }
};