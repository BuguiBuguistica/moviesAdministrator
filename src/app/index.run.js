(function() {
  'use strict';

  angular
    .module('wuakiTest')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
    
  }

})();
