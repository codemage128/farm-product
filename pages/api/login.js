import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SHA256 from "sha256";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailLower = email.toLowerCase();
    console.log(emailLower)
    // 1) check to see if a user exists with the provided email
    const user = await User.findOne({ email: emailLower }).select("password");
    if (user){
      var passwordSHA = SHA256(password);
      const hash = user.password;
      const passwordsMatch = await bcrypt.compare(passwordSHA, hash);
      if (passwordsMatch) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d"
        });
        // 5) send that token to the client
        res.status(200).json(token);
      } else {
        res.status(401).send("Passwords do not match");
      }
    } else {
      return res.status(404).send("No user exists with that email");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
};
