describe('ngContextMenu', function() {

    beforeEach(module('ngContextMenu'));

    var getDirective = function getDirective() {
        return '<ul data-context-menu="http://www.google.com/" ng-model="ngModel"><li></li></ul>'
    };

    var getMenu = function getMenu() {
        return '<ul><li></li></ul>'
    };

    it('Should be able to setup the context menu;', inject(function($rootScope, $compile, $httpBackend) {

        var scope        = $rootScope.$new();
        $compile(getDirective())(scope);
        var isolateScope = scope.$$childHead;

        $httpBackend.when('GET', 'http://www.google.com/').respond(200, getMenu());
        $httpBackend.expect('GET', 'http://www.google.com/').respond(200, getMenu());
        $httpBackend.flush();
        scope.$apply();

        expect(isolateScope.template).toEqual(getMenu());

    }));

});