(function ContextMenu($angular, $document) {

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
    module.factory('contextMenu', ['$rootScope', function contextMenuService($rootScope) {

        /**
         * @method cancelAll
         * @return {void}
         */
        function cancelAll() {
            $rootScope.$broadcast('context-menu/close');
        }

        return { cancelAll: cancelAll, eventBound: false };

    }]);

    /**
     * @module ngContextMenu
     * @directive contextMenu
     * @author Adam Timberlake
     * @link https://github.com/Wildhoney/ngContextMenu
     */
    module.directive('contextMenu', ['$timeout', '$interpolate', '$compile', 'contextMenu', '$templateRequest', '$sce',

        function contextMenuDirective($timeout, $interpolate, $compile, contextMenu, $templateRequest, $sce) {

            return {

                /**
                 * @property restrict
                 * @type {String}
                 */
                restrict: 'EA',

                /**
                 * @property scope
                 * @type {Boolean}
                 */
                scope: true,

                /**
                 * @property require
                 * @type {String}
                 */
                require: '?ngModel',

                /**
                 * @method link
                 * @param {Object} scope
                 * @param {angular.element} element
                 * @param {Object} attributes
                 * @param {Object} model
                 * @return {void}
                 */
                link: function link(scope, element, attributes, model) {

                    if (!contextMenu.eventBound) {

                        // Bind to the `document` if we haven't already.
                        $document.addEventListener('click', function click() {
                            contextMenu.cancelAll();
                            scope.$apply();
                        });

                        contextMenu.eventBound = true;

                    }

                    /**
                     * @method closeMenu
                     * @return {void}
                     */
                    function closeMenu() {

                        if (scope.menu) {
                            scope.menu.remove();
                            scope.menu     = null;
                            scope.position = null;
                        }

                    }

                    scope.$on('context-menu/close', closeMenu);

                    /**
                     * @method getModel
                     * @return {Object}
                     */
                    function getModel() {
                        return model ? $angular.extend(scope, model.$modelValue) : scope;
                    }

                    
				    /**
                     * Avoids that the context menu is drawn off screen.
                     */
                    function calculateContextMenuTopCoordinates(menu, scopePosition) {
                        var windowHeight = window.innerHeight;
                        var windowWidth = window.innerWidth;
                        var menuWidth = menu[0].clientWidth;
                        var menuHeight = menu[0].clientHeight;
                        var overflowScreenWidth = scopePosition.x + menuWidth > windowWidth;
                        var overflowScreenHeigth = scopePosition.y + menuHeight > windowHeight;
                        var x = overflowScreenWidth ? scopePosition.x - menuWidth : scopePosition.x;
                        var y = overflowScreenHeigth ? scopePosition.y - menuHeight : scopePosition.y;
                        return {x: x, y: y};
                    }

                    /**
                     * Wait 20ms to position the contextmenu because ng needs to draw the menu
                     * first to get the exact width and height of the context menu panel.
                     */
                    function setContextMenuTopCoordinates(menu, scopePosition) {
                        setTimeout(function () {
                            var menuTopCoordinates = calculateContextMenuTopCoordinates(menu, scopePosition);
                            menu.css({
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                transform: $interpolate('translate({{x}}px, {{y}}px)')(menuTopCoordinates)
                            });
                        }, 20);
                    }
					
					
					/**
                     * @method render
                     * @param {Object} event
                     * @param {String} [strategy="append"]
                     * @return {void}
                     */
                    function render(event, strategy) {

                        strategy = strategy || 'append';

                        if ('preventDefault' in event) {

                            contextMenu.cancelAll();
                            event.stopPropagation();
                            event.preventDefault();
                            scope.position = { x: event.clientX, y: event.clientY };

                        } else {

                            if (!scope.menu) {
                                return;
                            }

                        }

                        $templateRequest($sce.getTrustedResourceUrl(attributes.contextMenu)).then(function then(template) {
                            var compiled     = $compile(template)($angular.extend(getModel())),
                                menu         = $angular.element(compiled);

                            // Determine whether to append new, or replace an existing.
                            switch (strategy) {
                                case ('append'): angular.element(document.body).append(menu); break;
                                default: scope.menu.replaceWith(menu); break;
                            }
							
                            setContextMenuTopCoordinates(menu,scope.position);
                            scope.menu = menu;
                            scope.menu.bind('click', closeMenu);

                        });

                    }

                    if (model) {

                        var listener = function listener() {
                            return model.$modelValue;
                        };

                        // Listen for updates to the model...
                        scope.$watch(listener, function modelChanged() {
                            render({}, 'replaceWith');
                        }, true);

                    }

                    element.bind(attributes.contextEvent || 'contextmenu', render);

                }

            }

        }]);

})(window.angular, window.document);
