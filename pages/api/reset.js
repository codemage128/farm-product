import User from "../../models/User";
import connectDb from "../../utils/connectDb";

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

async function handleGetRequest(req, res) {
  const { token } = req.query;
  try {
    // console.log(token)
    const user = await User.findOne({ 
      token: token,
      expires: {
        $gt: Date.now()
      }
    });
    
    if (user === null){
      res.status(403).send('Sorry, invalid request.');
    } else{
      res.status(200).json({
        username: user.email,
        token: token,
        message: 'token valid',
      });
    }
  } catch (error) {
    console.error('#########ERROR#########',error);
    res.status(403).send("Sorry, invalid reset attempt.");
  }
}