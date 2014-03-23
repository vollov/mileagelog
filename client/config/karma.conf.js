module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/jquery/jquery.js',
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'app/lib/underscore/underscore.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/services.js',
      //'test/unit/controllers/user.test.js',
      'test/unit/services/session.test.js',
      'test/unit/services/flash.test.js',
      
      'test/unit/services/authentication.test.js',
      'test/unit/services/user.test.js',
      'test/unit/services/vehicle.test.js',
      //'test/e2e/view.test.js'
    ],

    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
	});
}
