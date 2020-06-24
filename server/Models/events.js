/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "events",
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
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      organizer_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      organizer_pin: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      view_key: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
      },
      rating_key: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      tableName: "events"
    }
  );
};
