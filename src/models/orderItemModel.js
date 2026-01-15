const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
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
      timestamps: false, // Bảng này không có createdAt, updatedAt trong schema SQL cũ
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
