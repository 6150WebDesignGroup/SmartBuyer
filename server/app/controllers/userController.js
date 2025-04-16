const User = require('../model/User');
const bcrypt = require("bcrypt");

// 正则表达式
const NameReg = /^[a-zA-Z]+$/;
const EmailReg  = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const pwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

exports.registerUser = async (req, res) => {
    const { name, email, pwd, role, phone } = req.body;
    try {

        if (role !== "Admin" && role !== "User") {
            return res.status(401).send({ error: "Invalid Role" });
        }
        if (!name.match(NameReg) || !email.match(EmailReg) || !pwd.match(pwdReg)) {
            console.log("Validate:", name, name.match(NameReg), email.match(EmailReg), pwd.match(pwdReg));
            return res.status(400).json({ error: "Validation failed.",name:name.match(NameReg), email:email.match(EmailReg), pwd:pwd.match(pwdReg) });
        }
        const user1 = await User.findOne({email: email});
        if(user1!=null){
            return res.status(402).json({ error: "email already exists" });

        }
        const NewPwd = await bcrypt.hash(pwd, 10);
        const user = new User({ name, email, role, phone, pwd: NewPwd });
        await user.save();
        res.status(200).json({ Message: "User create successfully.", user: user });
    } catch (err) {
        res.status(405).json({ error: "Validation failed.",name:name.match(NameReg), email:email.match(EmailReg), pwd:pwd.match(pwdReg), message:err.message });
    }
};

exports.loginUser = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    if (user.role !== "Admin" && user.role !== "User") {
        return res.status(401).json({ error: "Invalid Role" });
    }
    const isMatch = await bcrypt.compare(req.body.pwd, user.pwd);
    if (isMatch) {
        req.session.user = {
            name: user.name,
            email: user.email,
            role: user.role
        };
        return res.status(200).json({ Message: "logged in", user });
    } else {
        return res.status(406).json({ error: "pwd error" });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to logout" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
    });
};

exports.editUser = async (req, res) => {
    try {
        const { email, name, pwd, phone } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (typeof name === "string" && name.trim() !== "") {
            user.name = name.trim();
        }
        if (typeof phone === "string" && phone.trim() !== "") {
            user.phone = phone.trim();
        }
        if (typeof pwd === "string" && pwd.trim() !== "") {
            user.pwd = await bcrypt.hash(pwd, 10);
        }

        await user.save();
        return res.json({ message: "User updated successfully", user });
    } catch (err) {
        console.error("Edit user error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
