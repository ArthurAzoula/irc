const { Op } = require('sequelize');
const database = require('../db/models/index');

const getAccounts = async ({ limit, offset, search }) => {
  const accounts = await database.sequelize.models.account.findAll({
    where: { 
      nickname: {
        [Op.iLike]: `%${search}%`
      }
    },
    limit,
    offset,
    attributes: { exclude: ['password'] },
  });
  return accounts;
};

const getAccountById = async (accountId) => {
  const account = await database.sequelize.models.account.findByPk(accountId, {
    attributes: { exclude: ['password'] },
  });
  return account;
};

const createAccount = async (accountData) => {
  const account = await database.sequelize.models.account.create(accountData);
  return account;
};

const updateAccount = async (accountId, updatedData) => {
  const [updatedRowsCount] = await database.sequelize.models.account.update(updatedData, {
    where: { id: accountId },
  });

  if (updatedRowsCount > 0) {
    const updatedaccount = await database.sequelize.models.account.findByPk({
      where: { id: accountId },
      attributes: { exclude: ['password'] },
    });
    return updatedaccount;
  }

  return null;
};

const deleteAccount = async (accountId) => {
  const deletedRowsCount = await database.sequelize.models.account.destroy({
    where: { id: accountId },
  });

  return deletedRowsCount > 0;
};

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
