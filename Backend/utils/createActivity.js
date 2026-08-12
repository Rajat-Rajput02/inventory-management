const Activity = require("../models/Activity");

const createActivity = async ({
  user,
  action,
  module,
  description,
  metadata = {},
}) => {
  await Activity.create({
    user,
    action,
    module,
    description,
    metadata,
  });
};

module.exports = createActivity;