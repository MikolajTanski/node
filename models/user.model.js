
import { sequelize } from "../utility/db.js";
import { DataTypes } from "sequelize";

const rolesArr = ["admin", "director", "teacher", "student"];

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: { isInt: true }
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false, 
        validate: { len: [1, 32] }
    },
    surname: {
        type: DataTypes.STRING(64),
        allowNull: true, 
        validate: { len: [1, 64] }
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false, 
        unique: true,
        validate: { isEmail: true, len: [1, 128] }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: { 
            notNull: {
                msg: "Password is needed"
            },
            notEmpty: {
                msg: "Please provide a password"
            },
            isNotEasy: function(val) {
                val = val.toLowerCase();

                if (val.includes("12345") || val.includes("54321") || val.includes("admin")) {
                    throw new Error("Password is too simple");
                }
            }
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 18,
        validate: { isInt: true }
    },
    address: {
        type: DataTypes.STRING(256),
        allowNull: true,
        validate: { len: [0, 256] }
    },
    role: {
        type: DataTypes.ENUM({
            values: rolesArr
        }),
        defaultValue: "student",
        allowNull: false,
        validate: { len: [1, 12] }
    }
});



export {
    User,
    rolesArr 
};