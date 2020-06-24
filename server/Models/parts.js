/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "parts",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted: {
        type: DataTypes.DATE,
        allowNull: true
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: "parts"
    }
  );
};
