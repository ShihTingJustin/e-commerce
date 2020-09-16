module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  toLocaleString: function (a) {
    return Number(a).toLocaleString()
  }
}