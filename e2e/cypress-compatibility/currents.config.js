module.exports = {
  e2e: {
    batchSize: 3, // how many specs to send in one batch
  },
  component: {
    batchSize: 5, // how many specs to send in one batch
  },
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  projectId: !!(process.env.GITHUB_ACTION || process.env.CIRCLE_BRANCH)
    ? "Ij0RfK"
    : "l4zuz8",
};
