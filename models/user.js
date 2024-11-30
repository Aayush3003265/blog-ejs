const { error } = require("console");
const { createHmac,randomBytes } = require("crypto")//for password hashing and randomBytes for generating secret keyy...
const { Schema,model } = require('mongoose');
const { createTokenForUser } = require("../services/authentication");
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        require:true,
    },
    profileImageUrl:{
        type:String,
        default:"/images/defaultUser.jpg"
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    }
},{timestamps: true});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next(); 
    try{
    const salt = randomBytes(16).toString("hex"); 
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password  || "")
        .digest("hex"); 

    // Save salt and hashed password
    user.salt = salt;
    user.password = hashedPassword;

    next(); // Call next to continue the middleware chain
    }catch(err){
        next(err);
    }
});

userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user = await this.findOne({email})
    if(!user) throw new Error('user not Found');
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest("hex"); 
    if (hashedPassword !== userProvidedHashedPassword )throw new Error('incorrect password');
    // return {...user, password:undefined, salt:undefined}
    const token = createTokenForUser(user);
    return token;
} )

const User = model('user',userSchema);

module.exports = User;