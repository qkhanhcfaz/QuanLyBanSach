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
      },
      don_gia: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
    },
    {
      tableName: "order_items", // Lưu ý tên bảng là order_items (số nhiều, có s)
      timestamps: true, // Bảng này CÓ createdAt, updatedAt trong schema PostgreSQL
    },
  );

  OrderItem.associate = (models) => {
    if (models.Order) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }

    if (models.Product) {
      OrderItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  };

  return OrderItem;
};
