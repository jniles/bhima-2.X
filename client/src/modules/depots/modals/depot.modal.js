angular.module('bhima.controllers')
  .controller('DepotModalController', DepotModalController);

DepotModalController.$inject = [
  '$state', 'DepotService', 'NotifyService', 'SessionService', 'params',
];

function DepotModalController($state, Depots, Notify, Session, params) {
  const vm = this;
  let checkChangeParent = false;

  vm.depot = params.depot || {};
  vm.isCreateState = params.isCreateState;
  vm.onSelectDepot = onSelectDepot;
  vm.clear = clear;

  // make sure hasLocation is set
  vm.hasLocation = vm.depot.location_uuid ? 1 : 0;

  // if creating, insert the default min_months_security_stock
  if (vm.isCreateState) {
    vm.depot.min_months_security_stock = Session.stock_settings.default_min_months_security_stock;
  }

  function onSelectDepot(depot) {
    vm.depot.parent_uuid = depot.uuid;
  }

  function clear(item) {
    checkChangeParent = true;
    delete vm.depot[item];
  }

  // exposed methods
  vm.submit = submit;

  // submit the data to the server from all two forms (update, create)
  function submit(depotForm) {
    if (depotForm.$invalid) {
      return 0;
    }

    if (depotForm.$pristine && !checkChangeParent) {
      cancel();
      return 0;
    }

    Depots.clean(vm.depot);

    if (vm.hasLocation === 0) {
      vm.depot.location_uuid = null;
    }

    if (!vm.depot.parent_uuid) {
      vm.depot.parent_uuid = 0;
    }

    const promise = (vm.isCreateState)
      ? Depots.create(vm.depot)
      : Depots.update(vm.depot.uuid, vm.depot);

    return promise
      .then(() => {
        const translateKey = (vm.isCreateState) ? 'DEPOT.CREATED' : 'DEPOT.UPDATED';
        Notify.success(translateKey);
        $state.go('depots', null, { reload : true });
      })
      .catch(Notify.handleError);
  }

  function cancel() {
    $state.go('depots');
  }
}
