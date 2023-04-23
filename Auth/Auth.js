const User = require('../model/User')

//Register Function
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

//Login Function
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