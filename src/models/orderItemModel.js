const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      so_luong_dat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      don_gia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      tableName: "order_items",
      timestamps: true,
    },
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return OrderItem;
};
