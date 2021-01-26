import User from "../../models/User";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await handlePutRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};


async function handlePutRequest(req, res) {
  try{
    const { _id, fold, call, raise, allin, difficulty, email } = req.body;
    await User.findOneAndUpdate({ _id },{fold, call, raise, allin, difficulty})
    res.status(203).send("User updated");
  } catch(e){
    console.error(e)
    res.status(500).send(e)
  }
}