import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.js';



class Account extends Model {}

Account.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    auth_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'account',
    timestamps: false
});

export default Account;