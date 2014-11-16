(function ContextMenu($angular) {

    "use strict";

    /**
     * @module ngContextMenu
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ngContextMenu
     */
    var module = $angular.module('ngContextMenu', []);

    /**
     * @module ngContextMenu
     * @service ContextMenu
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ngContextMenu
     */
    module.factory('contextMenu', function contextMenuService() {

        var factory = {};

        /**
         * @property cancelIteration
         * @type {Number}
         * @default 0
         */
        factory.cancelIteration = 1;

        /**
         * @property attachedClick
         * @type {Boolean}
         */
        factory.attachedClick = false;

        /**
         * Responsible for closing all of the visible context menus.
         *
         * @method cancelAll
         * @return {void}
         */
        factory.cancelAll = function cancelAll() {
            factory.cancelIteration++;
        };

        return factory;

    });

    /**
     * @module ngContextMenu
     * @directive contextMenu
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ngContextMenu
     */
    module.directive('contextMenu', ['$window', '$http', '$interpolate', '$compile', '$templateCache', 'contextMenu',

    function contextMenuDirective($window, $http, $interpolate, $compile, $templateCache, contextMenu) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'EA',

            /**
             * @property require
             * @type {String}
             */
            require: '?ngModel',

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                include: '@contextMenu',
                model: '=ngModel'
            },

            /**
             * @method controller
             * @param $scope {Object}
             * @return {void}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @property template
                 * @type {String}
                 */
                $scope.template = '';

                /**
                 * @property event
                 * @type {Object|null}
                 */
                $scope.event = null;

                /**
                 * @property menu
                 * @type {Object|null}
                 */
                $scope.menu = null;

                /**
                 * @method throwException
                 * @throw Exception
                 * @param message {String}
                 * @return {void}
                 */
                $scope.throwException = function throwException(message) {
                    throw "ngContextMenu: " + message + ".";
                };

                /**
                 * @method cacheTemplate
                 * @param templatePath {String}
                 * @return {void}
                 */
                $scope.cacheTemplate = function cacheTemplate(templatePath) {

                    $http.get(templatePath, { cache: $templateCache }).then(function then(response) {

                        // Define the template with expressions.
                        $scope.template = response.data;

                    }).catch(function catchError() {

                        // Unable to find the supplied template path.
                        $scope.throwException('Invalid context menu path: "' + templatePath + '"');

                    });

                };

                /**
                 * @method cancelOne
                 * @return {void}
                 */
                $scope.cancelOne = function cancelOne() {

                    if ($scope.menu) {
                        $scope.menu.remove();
                        $scope.event = null;
                    }

                };

            }],

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                if (!contextMenu.attachedClick) {

                    // Subscribe to the onClick event of the BODY node to remove any context menus
                    // that may be open.
                    var body = $angular.element($window.document.getElementsByTagName('html'));
                    contextMenu.attachedClick = true;

                    body.bind('click', function onClick() {

                        // Remove all of the open context menus.
                        scope.$apply(contextMenu.cancelAll);

                    });

                }

                // Evaluate the supplied template against the model.
                scope.cacheTemplate(scope.include, scope.model || {});

                // Listen for any attempts to cancel the current context menu.
                scope.$watch(function setupObserver() {
                    return contextMenu.cancelIteration;
                }, scope.cancelOne);

                /**
                 * @method render
                 * @param event {Object}
                 * @return {void}
                 */
                scope.render = function render(event) {

                    if (!event) {
                        return;
                    }

                    // Prevent the default context menu from opening, and make the user
                    // defined context menu appear instead.
                    event.preventDefault();

                    var interpolated     = $interpolate(scope.template)(scope.model || {}),
                        template         = $angular.element(interpolated),
                        compiledTemplate = $compile(template)($angular.extend(scope.$parent, scope.model));

                    if (compiledTemplate.length > 1) {

                        // Throw exception when the compiled template is adding more than one child node.
                        scope.throwException('Context menu is adding ' + compiledTemplate.length + ' child nodes');

                    }

                    element.append(compiledTemplate);

                    // Keep a track of the added context menu for removing it if necessary.
                    var nativeElement = element[0],
                        childCount    = nativeElement.childNodes.length;

                    // Update the position of the newly added context menu.
                    scope.menu    = $angular.element(nativeElement.childNodes[childCount - 1]);
                    var translate = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px)';
                    scope.menu.css({ transform: translate });

                    // Memorise the event for re-rendering.
                    scope.event = event;

                };

                // Bind to the context menu event.
                element.bind('contextmenu', function onContextMenu(event) {

                    scope.$apply(function apply() {

                        // Remove any existing context menus for this element and other elements.
                        contextMenu.cancelAll();

                    });

                    scope.render(event);

                });

                if (scope.model) {

                    scope.$watch('model', function modelChanged() {

                        // Re-render the context menu if necessary.
                        var event = scope.event;
                        scope.cancelOne();
                        scope.render(event);

                    }, true);

                }

            }

        }

    }]);

})(window.angular);