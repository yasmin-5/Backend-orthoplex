const knex = require("./knex.js");

exports.insert = async (tableName, payload) => {
  return knex(`${tableName}`).insert(payload);
};

exports.update = async (tableName, payload, whereCluse) => {
  return knex(`${tableName}`).where(whereCluse).update(payload);
};

exports.selectAll = async (tableName, atrributesArray, whereCluse) => {
  return knex
    .select(atrributesArray)
    .from(`${tableName}`)
    .where({ ...whereCluse });
};

exports.verifedUsers = async (tableName, atrributesArray, whereCluse) => {
    return knex(tableName)
      .where({ ...whereCluse, is_verified: true })
      .count("id as totalVerifiedUsers");  // Only count the IDs of verified users
  };
  
exports.deleteUser = async (tableName, whereCluse) => {
  return knex(`${tableName}`).where(whereCluse).del();
};
