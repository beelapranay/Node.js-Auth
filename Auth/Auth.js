const User = require('../model/User')

exports.register = async (req, res, next) => {
    const {username, password} = req.body

    if(password.length < 6) {
        return res.status(400).json({message: "Password has to be greater than 6 characters!"})
    }

    try {
        await User.create({
            username,
            password
        }).then(user => res.status(200).json({
            message: "User has been created",
            user
        }))
    } catch(err) {
        res.status(401).json({
            message: "User has not been created!",
            error: err.message
        })
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body

    if(!username || !password) {
        return res.status(400).json({
            message: "Username/Password is wrong!"
        })
    }

    try {
        const user = await User.findOne({username, password})

        if(!user) {
            res.status(401).json({
                message: "Login not successful!",
                error: "User not found!"
            })
        } else {
            res.status(200).json({
                message: "Login successful!",
                user
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Error occurred!",
            error: error.message
        })
    }
}