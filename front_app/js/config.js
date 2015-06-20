/**
 * @desc        configure aliases and dependencies
 */

if (typeof DEBUG === 'undefined') DEBUG = true;

require.config({

    baseUrl: 'front_app/js/',

    paths: {
        'jquery'                : 'lib/jquery-2.1.4.min',
        'underscore'            : 'lib/lodash.min',         // load lodash instead of underscore (faster + bugfixes)
        'backbone'              : 'lib/backbone',
        'bootstrap'             : 'lib/bootstrap/js/bootstrap',
        'text'              : 'lib/text',
        'parsley'              : 'lib/parsley'


    },

    // non-AMD lib
    shim: {
        'underscore'            : { exports  : '_' },
        'backbone'              : { deps : ['underscore', 'jquery'], exports : 'Backbone' },
        'bootstrap'             : { deps : ['jquery'], exports : 'Bootstrap' },
        'parsley'               : { deps: ['jquery'] }
    }

});

require(['main']);           // Initialize the application with the main application file.