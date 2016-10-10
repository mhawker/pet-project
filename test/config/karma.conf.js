// Karma configuration
// Generated on Fri Oct 07 2016 00:06:43 GMT+0200 (CEST)

module.exports = function(config) {
    config.set({
        basePath  : '../..',
        frameworks: ['jasmine', 'requirejs'],
        reporters : ['spec', 'kjhtml'],
        files     : [
            {pattern: 'test/config/test-main.js', cached: false},
            {pattern: 'public/vendor/**/*.js', included: false, cached: false},
            {pattern: 'public/app/**/*.js', included: false, cached: false},
            {pattern: 'test/spec/**/*.js', included: false, cached: false}
        ],
        autoWatch : false,
        singleRun : true,
        browsers  : ['PhantomJS']
    });
};

