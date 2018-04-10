let logs = [];
module.exports = (message, meta) => {
  logs.push({message, meta});
};

module.exports.__getLogs = () => logs;
module.exports.__clearLogs = () => {
  logs = [];
};
