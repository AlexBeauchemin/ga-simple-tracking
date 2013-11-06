/*
 Google Analytics Simple Tracking Plugin
 By Alex Beauchemin
 Github + doc : https://github.com/AlexBeauchemin/ga-simple-tracking
 */


var _gaq = _gaq || [],
    ga = ga || [];

(function ($) {
    $.extend({
        Tracker: function (el, options) {
            var settings = $.extend({
                account: null, // value or array (if using both classic and universal)
                createParameters: null, // object of parameters for Universal Analytics
                domainName: null, // For classic analytics
                useClassicAnalytics: true, // ga.js
                useUniversalAnalytics: true // analytics.js
            }, options || {});

            var self = this;

            var initialize = function () {
                Array.prototype.isArray = true;

                if (settings.account) {
                    if(settings.useClassicAnalytics) initClassicAnalytics();
                    if(settings.useUniversalAnalytics) initUniversalAnalytics();
                }

                addEvents();
            };

            var addEvents = function () {
                el.find('.trackevent').on("click", function (e) {
                    e.preventDefault();
                    var $this = $(this),
                        category = $this.attr('data-tracking-category'),
                        action = $this.attr('data-tracking-action'),
                        label = $this.attr('data-tracking-label'),
                        link = $this.attr("href"),
                        target = $this.attr('target');

                    self.trackEvent({
                        'link': link,
                        'category': category,
                        'action': action,
                        'label': label,
                        target: target
                    });
                });
                el.find('.trackpageview').on("click", function () {
                    var $this = $(this);
                    var page = $this.data('tracking-page');

                    self.trackPageView(page);
                });
            };

            var initClassicAnalytics = function () {
                var account = (settings.account.isArray ? settings.account[0] : settings.account);

                _gaq.push(['_setAccount', account]);
                if (settings.domainName)
                    _gaq.push(['_setDomainName', settings.domainName]);

                (function () {
                    var ga = document.createElement('script');
                    ga.type = 'text/javascript';
                    ga.async = true;
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(ga, s);
                })();
            };

            var initUniversalAnalytics = function () {
                var account = (settings.account.isArray ? settings.account[0] : settings.account);

                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

                ga('create', account, settings.createParameters);
            };

            var openLink = function (parameters) {
                //TODO: use hitCallback instead of setTimeout ?
                if (parameters.link && parameters.link != "#") {
                    if (parameters.target == "_blank")
                        window.open(parameters.link);
                    else if (parameters.link)
                        setTimeout('document.location = "' + parameters.link + '"', 100);
                }
                if (parameters.callback) {
                    setTimeout(parameters.callback, 100);
                }
            };

            var trackEventClassic = function (parameters) {
                _gaq.push(['_trackEvent', parameters.category, parameters.action, parameters.label]);
                if(!settings.useUniversalAnalytics || !settings.useClassicAnalytics) {
                    openLink(parameters);
                }
            };

            var trackEventUniversal = function (parameters) {
                parameters.hitType = 'event';

                //Wrap all parameters in a single object
                if(parameters.category) {
                    parameters.eventCategory = parameters.category;
                    delete parameters.category;
                }
                if(parameters.action) {
                    parameters.eventAction = parameters.action;
                    delete parameters.action;
                }
                if(parameters.label) {
                    parameters.eventLabel = parameters.label;
                    delete parameters.label;
                }
                if(parameters.value) {
                    parameters.eventValue = parameters.value;
                    delete parameters.value;
                }

                ga('send', parameters);
                openLink(parameters);
            };

            var trackPageViewClassic = function (page) {
                if (settings.account) {
                    if (page)
                        _gaq.push(['_trackPageview', page]);
                    else
                        _gaq.push(['_trackPageview']);
                }
            };

            var trackPageViewUniversal = function (options) {
                if(settings.account) {
                    ga('send', 'pageview', options);
                }
            };

            this.trackEvent = function (parameters) {
                parameters = $.extend({
                    action: null,
                    callback: null,
                    category: null,
                    label: null,
                    link: null,
                    target: null
                }, parameters || {});

                if (settings.account) {
                    if(settings.useClassicAnalytics) {
                        trackEventClassic(parameters);
                    }
                    if(settings.useUniversalAnalytics) {
                        trackEventUniversal(parameters);
                    }
                }
            };

            this.trackPageView = function (options) {
                if(settings.useClassicAnalytics) trackPageViewClassic(options);
                if(settings.useUniversalAnalytics) trackPageViewUniversal(options);
            };

            initialize();
            return this;
        }
    });
})(jQuery);