import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import SHA256 from 'sha256'
import bcrypt from "bcrypt";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handlePutRequest(req, res) {
  const { newPassword, token } = req.body;
  let user = await User.find({ 
    token: token, 
    expires: {
      $gt: Date.now()
    }
  })
  if (user === []) {
    console.error('1. Invalid password reset attempt.');
    res.status(403).send('Invalid password reset attempt.');
  } else if (user != null && user[0].token === token) {
    //console.log('1. Valid password reset attempt.');
    let passwordSHA = await SHA256(newPassword)
    const hash = await bcrypt.hash(passwordSHA, 10)
    await User.findOneAndUpdate({ _id: user[0]._id }, { password: hash, token: '', expires: '' })
      .then(() => {
        //console.log('2. Valid password reset attempt.');
        res.status(203).send('Password reset complete.');
      });
  } else {
    console.error('2. Invalid password reset attempt.');
    res.status(401).json('Invalid password reset attempt.');
  }
}


