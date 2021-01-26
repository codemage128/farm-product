import connectDb from "../../utils/connectDb"
import User from "../../models/User"
import objectId from '../../utils/generateObject'
import baseUrl from "../../utils/baseUrl"
import axios from "axios";

connectDb()

const nodemailer = require('nodemailer')

export default async (req, res) => {
  const { email } = req.body
  try {
    // 1) check to see if a user exists with the provided email
    var user = await User.findOne({ username: email }).select("+services.password.bcrypt")
    if(!user){
      user = await User.findOne({username: req.body.username})
    }
      if (user === null) {
        return res.status(404).send("Sorry, invalid request.")
      } else {
        const token = objectId()
        const url = `${baseUrl}/api/user`;
        const expires = Date.now() + 3600000
        const _id = user._id;
        const payload = { _id, token, expires };
        //console.log(payload)
        await axios.put(url, payload);

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        })

        const mailOptions = {
          from: 'support@localdrop.org',
          to: `${user.username}`,
          subject: 'LocalDrop.org - Reset Email Link',
          text:
            'A password request was made for your account. Click the link below to enter a new password.\n\n'
            + `${baseUrl}/reset?token=${token}\n\n`
            + 'If you did not request this, please ignore it and your password will remain the same.\n',
        }

        //console.log('Sending Email')

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('Error: ', err);
          } else {
            console.log('Response: ', response);
            res.status(200).json('Recovery email sent.');
          }
        })
      }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending forgot password email.");
  }
}
