const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Password are not same!",
        },
    },
    address: String,
    private_key: String,
    mnemonic: String,
});

userSchema.pre("save", async function (next) {
    // run only if password is modified
    if (!this.isModified("password")) return next();

    // hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    // false means not changed
    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
