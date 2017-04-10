/**
 * Created by Akshay on 4/7/2017.
 */

(function() {
    angular
        .module('portalApp', ['ui.router'])    //ui.router instead of ng-router
        .config(configuration)
        .service(courseService);

    function configuration($stateProvider, $urlRouterProvider) {
        var course = {
            name: "course",
            url: '/course',
            views: {
                root: {
                    templateUrl: 'views/templates/course-list.html',
                    controller: function($scope, courseService) {
                        $scope.courses = courseService;
                        $scope.hello = "hello from course list controller";
                    }
                }
            },
            template: 'Start State'
        };

        var courseDetails = {
            name:'course.details',
            url: '/:courseId',
            views: {
                courseDetails: {
                    templateUrl: 'views/templates/course-details.html',
                    controller: function($scope, $stateParams, courseService) {
                        $scope.courseId = $stateParams.courseId;
                        $scope.course = courseService.findCourseById()
                    }
                }
            }
        };

        var courseNew = {
            name: 'course.new',
            url: '/new/course',
            views: {
                courseDetails: {
                    templateUrl: 'views/templates/course-new.html'
                }
            }
        };

        $stateProvider.state(course);

        $stateProvider.state(courseDetails);

        $stateProvider.state(courseNew);

        $urlRouterProvider.otherwise('/startUrl');



    }
    function courseService() {
        this.findAllCourses = findAllCourses;
        this.findCourseById = findCourseById;

        var courses = [
        {_id: 123, name: "CS5610", overview: 'Lorem Ipsum'},
        {_id: 234, name: "CS5500", overview: 'Lorem Ipsum'}
        ];

        function findAllCourses() {
            return courses;
        }

        function findCourseById() {

        }
    }
})();