const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports = {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const userNameCheck = await User.findOne({ username });
      if (userNameCheck) {
        return res.json({ msg: 'Username already exists', status: false });
      }
      const emailCheck = await User.findOne({ email });
      if (emailCheck) {
        return res.json({ msg: 'Email already exists', status: false });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      delete user.password;
      return res.json({ status: true, user });
    } catch (err) {
      res.json({ msg: 'DB not updated', error: err });
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.json({ msg: 'User not found', status: false });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.json({ msg: 'Invalid password', status: false });
      }
      delete user.password;
      res.json({ status: true, user });
    } catch (err) {
      next(err);
    }
  },

  async getAllusers (req,resp,next){
    try{
       const users = await User.find({ _id: {$ne: req.params.is} } ).select([   //This query fetches all users whose _id is not equal to the specified req.params.id, effectively excluding that particular user from the results.
         "email",
         "username",
         "avatarImage",
         "_id"
       ]);

       return resp.json(users)
    }catch(e){
      next(e)
    }
  },

  async setAvatar(req, res, next){
    try {                                                                                                                      
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  },

  async logOut(req,res,next) {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  }

} 