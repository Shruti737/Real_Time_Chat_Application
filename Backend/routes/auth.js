const {
 
    register,
    login,
    getAllusers,
    setAvatar,
    logOut
} = require("../controllers/userController");

const router = require("express").Router();


router.post("/register", register);
router.post("/login", login);
router.get("/allusers/:id", getAllusers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
module.exports = router;
 