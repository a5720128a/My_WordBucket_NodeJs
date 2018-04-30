'use strict';
module.exports = (sequelize, DataTypes) => {
  var Explanation = sequelize.define('Explanation', {
    word: DataTypes.STRING,
    explanation_text: DataTypes.STRING,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER
  }, {});
  Explanation.associate = function(models) {
    // associations can be defined here
    Explanation.belongsTo(Word, {foreignKey: 'word', targetKey: 'word'});
  };
  return Explanation;
};
