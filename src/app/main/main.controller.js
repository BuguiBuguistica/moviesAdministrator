(function () {
  'use strict';

  angular
    .module('wuakiTest')
    .controller('MainController', MainController)
    .controller('ModalInstanceController', ModalInstanceController);

  /** @ngInject */
  function MainController($uibModal, $localStorage, $document, _) {
    var vm = this;
    vm.init = init;

    function init() {
      $localStorage.genres = [];
      vm.genres = $localStorage.genres;

      $localStorage.movies = [];
      vm.movies = $localStorage.movies;

      vm.open = open;

      vm.Genre = {
        genre: {
          name: '',
          num: 0
        },
        formTemplate: 'createGenreModal.html',
        save: saveGenre,
        remove: removeGenre,
        validate: validateGenre,
        reverse: genresReverse
      }

      vm.Movie = {
        movie: {
          title: '',
          genre: ''
        },
        genres: vm.genres,
        formTemplate: 'createMovieModal.html',
        save: saveMovie,
        remove: removeMovie,
        validate: validateMovie,
        reverse: moviesReverse
      }

      vm.labels = {
        tl_genres: 'Genres',
        tl_movies: 'Movies',
        tb_genre_col1: 'Name',
        tb_genre_col2: 'Num Movies',
        tl_filters: 'Filters',
        tl_actions: 'Actions',
        btn_add_mov: 'Add Movie',
        btn_add_genre: 'Add Genre',
        tb_movie_col1: 'Title',
        tb_movie_col2: 'Genre',
        tl_modal_genre: 'Create Genre',
        tl_modal_movie: 'Create Movie',
        btn_close: 'Close',
        btn_create: 'Create'
      }
    }

    init();

    //Modal
    vm.animationsEnabled = true;

    function open(action) {
      vm.model = action === 'addGenre' ? vm.Genre : vm.Movie;

      $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: vm.model.formTemplate,
        controller: 'ModalInstanceController',
        controllerAs: '$ctrl',
        size: 'md',
        resolve: {
          model: function () {
            return vm.model;
          }
        }
      });
    }

    function saveGenre(model) {
      $localStorage.genres.unshift(model.genre);
    }

    function genresReverse() {
      vm.genres.reverse();
    }

    function moviesReverse() {
      vm.movies.reverse();
    }

    function removeGenre(genre) {
      var index = _.findIndex($localStorage.genres, genre);
      if (index > -1) $localStorage.genres.splice(index, 1);
    }

    function removeMovie(movie) {
      var index = _.findIndex($localStorage.movies, movie);
      if (index > -1) $localStorage.movies.splice(index, 1);
      
      if(_.findWhere(vm.genres, { name: movie.genre }))
        _.findWhere(vm.genres, { name: movie.genre }).num--;
    }

    function saveMovie(model) {
      $localStorage.movies.unshift(model.movie);
      _.findWhere(vm.genres, { name: model.movie.genre }).num++;
    }

    function validateGenre(model) {
      var errors = [];
      if (model.genre.name) {
        if (_.findIndex($localStorage.genres, model.genre) > -1) {
          errors.push(model.genre.name + ' already exists');
        }
      } else {
        errors.push('Please complete name field');
      }
      return errors;
    }

    function validateMovie(model) {
      var errors = [];
      if (model.movie.title && model.movie.genre) {
        if (_.findIndex($localStorage.movies, model.movie) > -1) {
          errors.push(model.movie.title + ' already exists');
        }
      } else {
        errors.push('Please complete all the fields');
      }
      return errors;
    }
  }

  //ModalInstanceController
  function ModalInstanceController($uibModalInstance, model) {
    var vm = this;
    vm.errorMessage = '';
    vm.errors = [];
    vm.invalid = false;
    vm.model = angular.copy(model);
    vm.labels = {
      btn_close: 'Close',
      btn_create: 'Create'
    }

    vm.cleanInputs = cleanInputs;
    vm.ok = save;
    vm.cancel = cancel;

    function cleanInputs(name) {
      vm.invalid = false;
      angular.element("input[name=" + name + "]").removeClass('invalid');
      angular.element("select[name=" + name + "]").removeClass('invalid');
    }

    function save() {
      angular.element('form input, form select').each(function (i, item) {
        if (!item.value) angular.element(item).addClass('invalid');
      })
      vm.errors = vm.model.validate(vm.model);
      if (!vm.errors.length) {
        vm.model.save(vm.model);
        $uibModalInstance.close();
      } else {
        vm.errorMessage = vm.errors[0];
        vm.invalid = true;
      }
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();

    //Example
/*    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1482581538436;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function () {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function (awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }*/
