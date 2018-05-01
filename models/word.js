'use strict';
module.exports = (sequelize, DataTypes) => {
  var Word = sequelize.define('Word', {
    word: DataTypes.STRING
  }, {});
  Word.associate = function(models) {
    // associations can be defined here
  };
  return Word;
};
