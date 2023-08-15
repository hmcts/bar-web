const requiredSteps = require('require-directory')(module);

const setActorActions = (data, actions) =>
  Object.keys(data)
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, actions);

const compileSteps = steps => () => actor(
  Object.keys(steps)
    .reduce((acc, dir) => Object.keys(steps[dir])
      .reduce((acc2, module) => setActorActions(steps[dir][module], acc2), acc), {})
);

module.exports = compileSteps(requiredSteps);
