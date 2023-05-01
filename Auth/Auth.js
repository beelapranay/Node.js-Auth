const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

const User = require('../model/User')
dotenv.config()

//Register Function
exports.register = async (req, res, next) => {
    const {username, password} = req.body

    if(password.length < 6) {
        return res.status(400).json({message: "Password has to be greater than 6 characters!"})
    }

    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
            username,
            password: hash
        })
        .then((user) => {
            const maxAge = 3 * 60 * 60
            const token = jwt.sign(
                {id: user._id, username, role: user.role},
                process.env.STRING,
                {expiresIn: maxAge}
            )
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            })
            res.status(201).json({
                message: "Registration Successful",
                user: user._id
            })
        })
        .catch((error) => res.status(400).json({
            message: "An error occurred!",
            error: error.message
        }))
    })

    // try {
    //     await User.create({
    //         username,
    //         password
    //     }).then(user => res.status(200).json({
    //         message: "User has been created",
    //         user
    //     }))
    // } catch(err) {
    //     res.status(401).json({
    //         message: "User has not been created!",
    //         error: err.message
    //     })
    // }
}

//Login Function
exports.login = async (req, res, next) => {
    const {username, password} = req.body

    if(!username || !password) {
        return res.status(400).json({
            message: "Username/Password not present!"
        })
    }

    try {
        const user = await User.findOne({username})

        if(!user) {
            res.status(401).json({
                message: "Login Failed!",
                error: "User not found!"
            })
        } else {
            bcrypt.compare(password, user.password).then((result) => {
                if(result) {
                    const maxAge = 3 * 60 * 60
                    const token = jwt.sign(
                        {id: user._id, username, role: user.role},
                        process.env.STRING,
                        {expiresIn: maxAge}
                    )
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    })
                    res.status(201).json({
                        message: "Login Successful",
                        user: user._id
                    })
                } else {
                    res.status(400).json({
                        message: "Login Failed!"
                    })
                }
            })
            // res.status(200).json({
            //     message: "Login successful!",
            //     user
            // })
        }
    } catch (error) {
        res.status(400).json({
            message: "An Error occurred!",
            error: error.message
        })
    }
}

//Update Function
exports.update = async (req, res, next) => {
    const {role, id} = req.body

    if(role && id) {
        if(role === 'admin') {
            await User.findById(id)
                .then(async (user) => {
                    if(user.role !== 'admin') {
                        user.role = role
                        await user.save()
                        res.status(201).json({
                                message: "Update successful!",
                                user
                            })
                        //     (err) => {
                        //     if(err) {
                        //         res.status(400).json({
                        //             message: "An error occurred!",
                        //             error: err.message
                        //         })
                        //         process.exit(1)
                        //     }
                        //     res.status(201).json({
                        //         message: "Update successful!",
                        //         user
                        //     })
                        // }
                        // )
                    } else {
                        res.status(400).json({
                            message: "User is already an admin!"
                        })
                    }
                })
                .catch((error) => {
                    res.status(400).json({
                        message: "An error occurred!",
                        error: error.message
                    })
                })
        } else {
            res.status(400).json({
                message: "An error occurred!"
            })
        }
    } 
}

exports.deleteUser = async (req, res, next) => {
    const {id} = req.body

    await User.findById(id)
        .then(user => user.deleteOne())
        .then(user =>
            res.status(201).json({
                message: "User successfully deleted",
                user
            })
        )
        .catch(error => 
            res.status(400).json({
                message: "An error occurred!",
                error: error.message
            })
        )
}