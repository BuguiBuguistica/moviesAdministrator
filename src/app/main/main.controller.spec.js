(function () {
  'use strict';

  describe('MainController', function () {
    var vm, $localStorage, $uibModal, genres, movies;


    beforeEach(module('wuakiTest'));
    beforeEach(inject(function (_$controller_, _$localStorage_, _$uibModal_) {
      vm = _$controller_('MainController');
      $localStorage = _$localStorage_;
      $uibModal = _$uibModal_;
      genres = [
        {
          name: 'Action',
          num: 0
        },
        {
          name: 'Drama',
          num: 0
        },
        {
          name: 'Comedy',
          num: 0
        }
      ];
      movies = [
        {
          title: 'Forest Gump',
          genre: 'Drama'
        },
        {
          title: 'Terminator',
          genre: 'Action'
        },
        {
          title: 'Inception',
          genre: 'Action'
        }
      ];

    }))

    describe('init', function () {
      it('should initialize localstorage genres as an empty array', function () {
        expect($localStorage.genres).toEqual([]);
      })
      it('should initialize genres as an empty array ', function () {
        expect(vm.genres).toEqual([]);
      })
      it('should initialize localstorage movies as an empty array', function () {
        expect($localStorage.movies).toEqual([]);
      })
      it('should initialize movies as an empty array ', function () {
        expect(vm.movies).toEqual([]);
      })
      it('should open method be defined', function () {
        expect(vm.open).toBeDefined();
      })
      it('should Genre be defined', function () {
        expect(vm.Genre).toBeDefined();
      })
      it('should Movie be defined', function () {
        expect(vm.Movie).toBeDefined();
      })
      it('should labels be defined', function () {
        expect(vm.labels.tl_genres).toEqual('Genres');
        expect(vm.labels.tl_movies).toEqual('Movies');
        expect(vm.labels.tb_genre_col1).toEqual('Name');
        expect(vm.labels.tb_genre_col2).toEqual('Num Movies');
        expect(vm.labels.tl_filters).toEqual('Filters');
        expect(vm.labels.tl_actions).toEqual('Actions');
        expect(vm.labels.btn_add_mov).toEqual('Add Movie');
        expect(vm.labels.btn_add_genre).toEqual('Add Genre');
        expect(vm.labels.tb_movie_col1).toEqual('Title');
        expect(vm.labels.tb_movie_col2).toEqual('Genre');
        expect(vm.labels.tl_modal_genre).toEqual('Create Genre');
        expect(vm.labels.tl_modal_movie).toEqual('Create Movie');
        expect(vm.labels.btn_close).toEqual('Close');
        expect(vm.labels.btn_create).toEqual('Create');
      })
    });

    describe('open', function () {
      var fakeModal = {
        result: {
          then: function (confirmCallback, cancelCallback) {
            //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
          }
        },
        close: function (item) {
          //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
          this.result.confirmCallBack(item);
        },
        dismiss: function (type) {
          //The user clicked cancel on the modal dialog, call the stored cancel callback
          this.result.cancelCallback(type);
        }
      };

      beforeEach(function () {
        spyOn($uibModal, 'open').and.callFake(function () {
          return fakeModal;
        });
      });

      it('should set up the model with Genre object', function () {
        vm.open('addGenre');
        expect(vm.model).toEqual(vm.Genre);
      })
      it('should set up the model with Movie object', function () {
        vm.open('addMovie');
        expect(vm.model).toEqual(vm.Movie);
      })
      it('should open modal and return Genre object', function () {
        vm.open('addGenre');
        expect($uibModal.open).toHaveBeenCalled();
      })
      it('should call open modal with the correct arguments', function () {
        vm.open('addGenre');
        expect($uibModal.open.calls.mostRecent().args[0].animation).toEqual(true);
        expect($uibModal.open.calls.mostRecent().args[0].ariaLabelledBy).toEqual('modal-title');
        expect($uibModal.open.calls.mostRecent().args[0].ariaDescribedBy).toEqual('modal-body');
        expect($uibModal.open.calls.mostRecent().args[0].templateUrl).toEqual('createGenreModal.html');
        expect($uibModal.open.calls.mostRecent().args[0].controller).toEqual('ModalInstanceController');
        expect($uibModal.open.calls.mostRecent().args[0].controllerAs).toEqual('$ctrl');
        expect($uibModal.open.calls.mostRecent().args[0].size).toEqual('md');
      })
    });
    describe('saveGenre', function () {
      var modelGenre = {
        genre: {
          name: 'Action'
        }
      };

      it('should add a new genre into localstorage Genre', function () {
        vm.Genre.save(modelGenre);
        expect($localStorage.genres.length).toEqual(1);
      })
      it('should have the genre reciently saved', function () {
        vm.Genre.save(modelGenre);
        expect($localStorage.genres[0]).toEqual(modelGenre.genre);
      })
    });

    describe('genresReverse', function () {
      it('should reverse genre array, the last element becomes the first and the first the last', function () {
        vm.genres = genres;
        vm.Genre.reverse();
        expect(vm.genres[0].name).toEqual('Comedy');
        expect(vm.genres[genres.length - 1].name).toEqual('Action');
      })
    });

    describe('moviesReverse', function () {
      it('should reverse movies array, the last element becomes the first and the first the last', function () {
        vm.movies = movies;
        vm.Movie.reverse();
        expect(vm.movies[0].title).toEqual('Inception');
        expect(vm.movies[movies.length - 1].title).toEqual('Forest Gump');
      })
    });
    describe('removeGenre', function () {
      beforeEach(function () {
        $localStorage.genres = genres;
      })

      it('should remove a genre from localstorage genres', function () {
        var genre = {
          name: 'Action',
          num: 0
        };
        vm.Genre.remove(genre);
        expect($localStorage.genres).not.toContain(genre);
      })
      it('should have 2 items after remove', function () {
        var genre = {
          name: 'Action',
          num: 0
        };
        vm.Genre.remove(genre);
        expect($localStorage.genres.length).toEqual(2);
      })
      it('should not remove a genre if this not exists in localstorage genres', function () {
        var genre = {
          name: 'Romance',
          num: 0
        };
        vm.Genre.remove(genre);
        expect($localStorage.genres.length).toEqual(3);
      })
    });

    describe('removeMovie', function () {
      var movie;

      beforeEach(function () {
        $localStorage.movies = movies;
        $localStorage.genres = genres;
        vm.genres = genres;
        movie = {
          title: 'Forest Gump',
          genre: 'Drama'
        };
      })

      it('should remove a movie from localstorage movies', function () {
        vm.Movie.remove(movie);
        expect($localStorage.movies).not.toContain(movie);
      })
      it('should have 2 items after remove', function () {
        vm.Movie.remove(movie);
        expect($localStorage.movies.length).toEqual(2);
      })
      it('should not remove a movie if this not exists in localstorage movies', function () {
        var movie = {
          title: 'Harry Potter',
          genre: 'Adventure'
        };
        vm.Movie.remove(movie);
        expect($localStorage.movies.length).toEqual(3);
      })
      it('should update counter of genre', function () {
        $localStorage.genres[1].num  = 1;
        vm.Movie.remove(movie);
        expect($localStorage.genres[1].num).toEqual(0);
      })
    });

    describe('saveMovie', function () {
      var modelMovie = {
        movie: {
          title: 'Forest Gump',
          genre: 'Drama'
        }
      };
      beforeEach(function () {
        vm.genres = genres;
      })

      it('should add a new movie into localstorage Movie', function () {
        vm.Movie.save(modelMovie);
        expect($localStorage.movies.length).toEqual(1);
      })
      it('should have the movie reciently saved', function () {
        vm.Movie.save(modelMovie);
        expect($localStorage.movies[0]).toEqual(modelMovie.movie);
      })
      it('should update genre counter after add new Movie', function () {
        vm.Movie.save(modelMovie);
        expect(vm.genres[1].num).toEqual(1);
      })
    });

    describe('validateGenre', function () {
      var modelEmpty = {
        genre: {
          name: '',
          num: 0
        }
      };
      var modelDuplicated = {
        genre: {
          name: 'Drama',
          num: 0
        }
      };
      it('should return errors array with a message if name field is empty', function () {
        var errors = vm.Genre.validate(modelEmpty);
        expect(errors.length).toEqual(1);
      })
      it('should return errors array with the correct message if name field is empty', function () {
        var errors = vm.Genre.validate(modelEmpty);
        expect(errors[0]).toEqual('Please complete name field');
      })
      it('should return errors array with a message if name field is duplicated', function () {
        $localStorage.genres = genres;
        var errors = vm.Genre.validate(modelDuplicated);
        expect(errors.length).toEqual(1);
      })
      it('should return errors array with the correct message if name field is duplicated', function () {
        $localStorage.genres = genres;
        var errors = vm.Genre.validate(modelDuplicated);
        expect(errors[0]).toEqual(modelDuplicated.genre.name + ' already exists');
      })
    });

    describe('validateMovie', function () {
      var modelTitleEmpty = {
        movie: {
          title: '',
          genre: 'Drama'
        }
      };
      var modelGenreEmpty = {
        movie: {
          title: 'Forest Gump',
          genre: ''
        }
      };
      var modelDuplicated = {
        movie: {
          title: 'Forest Gump',
          genre: 'Drama'
        }
      };
      beforeEach(function () {
        vm.genres = genres;

      })
      it('should return errors array with a message if title field is empty', function () {
        var errors = vm.Movie.validate(modelTitleEmpty);
        expect(errors.length).toEqual(1);
      })
      it('should return errors array with a message if genre field is empty', function () {
        var errors = vm.Movie.validate(modelGenreEmpty);
        expect(errors.length).toEqual(1);
      })
      it('should return errors array with the correct message if title field is empty', function () {
        var errors = vm.Movie.validate(modelTitleEmpty);
        expect(errors[0]).toEqual('Please complete all the fields');
      })
      it('should return errors array with the correct message if genre field is empty', function () {
        var errors = vm.Movie.validate(modelGenreEmpty);
        expect(errors[0]).toEqual('Please complete all the fields');
      })
      it('should return errors array with a message if movie is duplicated', function () {
        $localStorage.movies = movies;
        var errors = vm.Movie.validate(modelDuplicated);
        expect(errors.length).toEqual(1);
      })
      it('should return errors array with the correct message if movie is duplicated', function () {
        $localStorage.movies = movies;
        var errors = vm.Movie.validate(modelDuplicated);
        expect(errors[0]).toEqual(modelDuplicated.movie.title + ' already exists');
      })
    });

    describe('ModalInstanceController', function () {
      var intanceCtrl, modalInstance, Genre;

      beforeEach(inject(function ($controller) {
        Genre = {
          genre: {
            name: '',
            num: 0
          },
          formTemplate: 'createGenreModal.html',
          save: function () { },
          remove: function () { },
          validate: function () {
            return []
          },
          reverse: function () { }
        }
        modalInstance = {
          close: jasmine.createSpy('modalInstance.close'),
          dismiss: jasmine.createSpy('modalInstance.dismiss'),
          result: {
            then: jasmine.createSpy('modalInstance.result.then')
          }
        };
        intanceCtrl = $controller('ModalInstanceController', {
          $uibModalInstance: modalInstance,
          model: Genre
        });
      }));

      describe('Initial state', function () {
        it('should instantiate the controller properly', function () {
          expect(intanceCtrl).not.toBeUndefined();
        });

        it('should have setting up the labels', function () {
          expect(intanceCtrl.labels.btn_close).toEqual('Close');
          expect(intanceCtrl.labels.btn_create).toEqual('Create');
        });

        it('should initialize errors array empty', function () {
          expect(intanceCtrl.errors.length).toEqual(0);
        });

        it('should initialize errorMessage with an empty string', function () {
          expect(intanceCtrl.errorMessage).toBeFalsy();
        });

        it('should initialize invalid as false', function () {
          expect(intanceCtrl.invalid).toBeFalsy();
        });

        it('should initialize model with the retrieved ones', function () {
          expect(intanceCtrl.model).toEqual(Genre);
        });

        it('should close the modal with result "true" when accepted', function () {
          intanceCtrl.ok();
          expect(modalInstance.close).toHaveBeenCalled();
        });

        it('should close the modal with result "false" when rejected', function () {
          intanceCtrl.cancel();
          expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
      });

      describe('save successfully', function () {
        it('should not return errors after save', function () {
          intanceCtrl.model.genre.name = 'Drama';
          intanceCtrl.ok();
          expect(intanceCtrl.errors.length).toEqual(0);
        });
        it('should close modal after save', function () {
          intanceCtrl.model.genre.name = 'Drama';
          intanceCtrl.ok();
          expect(modalInstance.close).toHaveBeenCalled();
        });
        it('should invalid be false', function () {
          intanceCtrl.model.genre.name = 'Drama';
          intanceCtrl.ok();
          expect(intanceCtrl.invalid).toBeFalsy();
        });
      });

      describe('save failure', function () {
        beforeEach(function () {
          intanceCtrl.model.validate = function () {
            return ['Please complete name field'];
          };
        })
        it('should return errors after save', function () {
          intanceCtrl.ok();
          expect(intanceCtrl.errors.length).toEqual(1);
        });

        it('should set up errorMessage', function () {
          intanceCtrl.ok();
          expect(intanceCtrl.errorMessage).toEqual('Please complete name field');
        });

        it('should invalid be true', function () {
          intanceCtrl.ok();
          expect(intanceCtrl.invalid).toBeTruthy();
        });

      });
    });
  });
})();
