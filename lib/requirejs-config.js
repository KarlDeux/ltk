(function () {
    'use strict';

    var config = {
        'paths': {
            'jquery': 'jquery/jquery.min'
        }
    };

    require(['jquery'], function ($) {
        $.noConflict();
    });

    require.config(config);
})();

(function () {
    'use strict';

    var config = {
        'paths': {
            'file.util': 'file.util'
        }
    };

    require(['file.util'], function () {

    });

    require.config(config);
})();
