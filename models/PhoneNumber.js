import { DataTypes, Model } from "sequelize";
import sequelize from './sequelize.js';
import Account from "./Account.js";


class PhoneNumber extends Model {}

PhoneNumber.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'account',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'PhoneNumber',
    tableName: 'phone_number',
    timestamps: false
});

PhoneNumber.belongsTo(Account, { foreignKey: 'account_id' });


export default PhoneNumber;