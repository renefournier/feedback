/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ratings",
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
        allowNull: true,
        primaryKey: true
      },
      part_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
      },
      listener_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      listener_pin: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      th_01: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_02: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_03: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_04: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_05: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_06: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_07: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_08: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_09: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_10: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_11: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_12: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_13: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_14: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_15: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_16: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_17: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_18: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_19: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      th_20: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "ratings"
    }
  );
};
