const database = require("../db/models/index");

const getAnonymous = async ({ limit, offset }) => {
  const anonymous = await database.sequelize.models.anonymous.findAll({
    limit,
    offset,
  });
  return anonymous;
};

const getAnonymousById = async (anonymousId) => {
  const anonymous = await database.sequelize.models.anonymous.findByPk(
    anonymousId
  );
  return anonymous;
};

const createAnonymous = async (anonymousData) => {
  const anonymous = await database.sequelize.models.anonymous.create(
    anonymousData
  );
  return anonymous;
};

const updateAnonymous = async (anonymousId, updatedData) => {
  const [updatedRowsCount] = await database.sequelize.models.anonymous.update(
    updatedData,
    {
      where: { id: anonymousId },
    }
  );

  if (updatedRowsCount > 0) {
    const updatedAnonymous = await database.sequelize.models.anonymous.findByPk(
      anonymousId
    );
    return updatedAnonymous;
  }

  return null;
};

const deleteAnonymous = async (anonymousId) => {
  const deletedRowsCount = await database.sequelize.models.anonymous.destroy({
    where: { id: anonymousId },
  });

  return deletedRowsCount > 0;
};

module.exports = {
    getAnonymous,
    getAnonymousById,
    createAnonymous,
    updateAnonymous,
    deleteAnonymous,
};