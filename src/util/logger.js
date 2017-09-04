module.exports = {
    log: console.log,

    debugEnabled: false,

    debug: function() {
        if (this.debugEnabled) {
            this.log(...arguments);
        }
    },

    traceEnabled: false,

    trace: function() {
        if (this.traceEnabled) {
            this.log(...arguments);
        }
    }
};
