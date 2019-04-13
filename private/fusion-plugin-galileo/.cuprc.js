module.exports = {
  babel: {
     plugins: process.env.NODE_ENV === 'test' ? [require.resolve('babel-plugin-istanbul')] : [],
  },
};
