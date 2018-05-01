'use strict';
module.exports = (sequelize, DataTypes) => {
  var Explanation = sequelize.define('Explanation', {
    ExplanationWordId: DataTypes.STRING,
    explanation_text: DataTypes.STRING,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER
  }, {});
  Explanation.associate = function(models) {
    // associations can be defined here
    Explanation.belongsTo(models.Word, { foreignKey: 'word' });
  };
  return Explanation;
};
