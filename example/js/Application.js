(function($angular) {

    // Рукописи не горят!
    var app = $angular.module('menuApp', ['ngContextMenu']);

    /**
     * @controller MessagesController
     * @type {Function}
     */
    app.controller('MessagesController', function MessagesController($scope, $log, $timeout) {

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

        $timeout(function timeout() {
            $scope.messages[1].from = 'Adam';
        }, 2000);

    });

    /**
     * @controller MessageController
     * @type {Function}
     */
    app.controller('MessageController', function MessageController() {

        /**
         * @method readMessage
         * @return {void}
         */
        this.readMessage = function readMessage() {
            console.log('Reading Message!');
        };

        /**
         * @property label
         * @type {Object}
         */
        this.label = {
            read: 'Read Message',
            delete: 'Delete Message'
        }

    });

    /**
     * @controller DeleteController
     * @type {Function}
     */
    app.controller('DeleteController', function DeleteController() {

        /**
         * @method removeMessage
         * @param {String} from
         * @return {void}
         */
        this.removeMessage = function removeMessage(from) {
            console.log('Removing message from: ' + from);
        }

    });

})(window.angular);