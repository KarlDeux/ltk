require([
    'jquery'
], function ($) {
    'use strict';

    var Calc = {
        input: $('#entry'),
        submit: $('#submit'),
        result: $('#result'),
        lock: [],
        iteration: 0,
        path: '',
        uMask: '',
        errorClass: 'error',
        files: [],
        filesDetected: [],
        final: [],

        /**
         * Initialize the class
         */
        init: function (options) {
            this.uMask = options.uMask !== undefined ? options.uMask : this.uMask;
            this.observe();
        },

        /**
         * Observe events
         */
        observe: function () {
            var $this = this;

            $this.submit.on('click', function (e) {
                var v = $this.input.val();

                $this.resetDefaults();
                e.preventDefault();

                if ($this.validateInput(v)) {
                    $this.startProcess(v);
                } else {
                    $this.renderError(v, false);
                }
            });
        },

        /**
         * Start Process
         * @param {String} v
         */
        startProcess: function (v) {
            this.path = this.getPath(v);
            this.result.empty();
            this.removeError();
            this.parseFile(v.replace(this.path, ''));
        },

        /**
         * Validate input
         */
        validateInput: function (v) {
            return this.validateInputData(v) && this.validateUmask(v);
        },

        /**
         * Parse file
         */
        parseFile: function (file) {
            var $this = this;

            $.ajax({
                url: $this.path + file,
                dataType: 'text',
                type: 'get',
                async: false,

                /**
                 * On error
                 */
                error: function () {
                    $this.renderError(file, true);
                },

                /**
                 * On success
                 * @param {String} data
                 */
                success: function (data) {
                    $this.readText(data, file);
                }
            });

        },

        /**
         * Read text
         * @param {String} data
         * @param {String} trigger
         */
        readText: function (data, trigger) {
            var $this = this,
                lines = data.split('\n'),
                llength = lines.length,
                increment = 0,
                files = [],
                iteration = this.iteration++;

            $.each(lines, function (n, elem) {
                $this.lock[iteration] = n + 1 !== llength;

                if ($this.checkInteger(elem)) {
                    increment += parseInt(elem, 10);
                } else if ($this.validateInput(elem)) {
                    files.push(elem);
                    $this.parseFile(elem);
                } else {
                    $this.renderError(elem, false);
                }
            });

            this.files.push({
                'file': trigger,
                'contains': files,
                'sum': increment
            });

            $this.filesDetected.push(trigger);

            if ($this.lock.indexOf(true) < 0) {
                this.initCalc();
            }
        },

        /**
         * Initialize Calc
         */
        initCalc: function () {
            this.arrayIterator(this.filesDetected);
            this.renderSuccess();
        },

        /**
         * Iterate array
         */
        arrayIterator: function (array) {
            var $this = this,
                arr = [],
                _arr = [],
                sum = 0;

            $.each(array, function (n, elem) {
                arr = $this.files.filter(function (file) {
                    return file.file === elem;
                })[0];

                if (n !== 0) {
                    sum = arr.sum;
                    $.each(arr.contains, function (_n, _elem) {
                        _arr = $this.final.filter(function (final) {
                            return final.file === _elem;
                        })[0];
                    });
                    sum += _arr.count;
                } else {
                    sum = arr.sum;
                }

                $this.final.push({
                    'file': elem,
                    'count': sum
                });
            });
        },

        /**
         * Render error
         * @param {String} v
         * @param {Boolean} reader
         */
        renderError: function (v, reader) {
            this.removeError();
            this.result.hide();

            this.input.parent().prepend($('<div class="' + this.errorClass + '"/>'));

            if (reader) {
                $('.' + this.errorClass).append('<p>Could not open ' + v + '. Are you sure that the file ' +
                    'is named like that and exists on said path?</p>');
            }

            if (!this.validateInputData(v)) {
                $('.' + this.errorClass).append('<p>Data must be a legal string</p>');
            }

            if (!this.validateUmask(v)) {
                $('.' + this.errorClass).append('<p>Data must contain file mask: ' + this.uMask + '</p>');
            }
        },

        /**
         * Render Success
         */
        renderSuccess: function () {
            var $this = this;

            this.removeError();
            this.result.show();

            $.each(this.final, function (n, elem) {
                $this.result.prepend('File ' + elem.file + ' sums ' + elem.count + '<br>');
            });
        },

        /**
         * Validate umask for Files
         * @param {String} v
         * @returns {Boolean}
         */
        validateUmask: function (v) {
            return this.uMask ? v.indexOf(this.uMask) >= 0 : true;
        },

        /**
         * Validate Input data
         * @param {String} v
         * @returns {Boolean}
         */
        validateInputData: function (v) {
            return v !== 0 && v !== '' && v.length > 0;
        },

        /**
         * Remove error
         */
        removeError: function () {
            $('.' + this.errorClass).remove();
        },

        /**
         * Check if integer
         * @param {String|Number} i
         */
        checkInteger: function (i) {
            return !isNaN(i);
        },

        /**
         * Get Path
         * @param {String} p
         */
        getPath: function (p) {
            return p.replace(p.split('\\').pop().split('/').pop(), '');
        },

        /**
         * Reset Default configuration
         */
        resetDefaults: function () {
            this.lock = [];
            this.iteration = 0;
            this.path = '';
            this.files = [];
            this.filesDetected = [];
            this.final = [];
        }

    };

    Calc.init({
        uMask: 'txt'
    });
});
