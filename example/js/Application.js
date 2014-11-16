(function($angular) {

    // Рукописи не горят!
    var app = $angular.module('menuApp', ['ngContextMenu']);

    /**
     * @controller MessagesController
     * @type {Function}
     */
    app.controller('MessagesController', function MessagesController($scope, $log) {

        /**
         * @property messages
         * @type {Object}
         */
        $scope.messages = [
            { subject: 'Really it is Possible? I want to believe...', from: 'Carla', date: new Date() },
            { subject: 'Facebook.com: New Message', from: 'Simon', date: new Date() },
            { subject: 'I Recommend "JavaScript: The Good Parts"!', from: 'Alison', date: new Date() }
        ];

        /**
         * @method replyTo
         * @param name {String}
         * @return {void}
         */
        $scope.replyTo = function replyTo(name) {
            $log.info('Reply to ' + name);
        };

    });

})(window.angular);