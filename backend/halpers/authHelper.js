const bcrypt = require('bcrypt');

const hashPassword= async (password)=>{
    try {
        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound);
        return hashPassword;
    } catch (error) {
        console.log(error)
    }
}

const comparePassword = async(password, hashPassword)=>{
    return bcrypt.compare(password, hashPassword);
}
module.exports = {hashPassword , comparePassword}