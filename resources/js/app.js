var app = angular.module("offshoreControlApp", []);
var SUCCESS = "success";
var WARN = "warning";

app.controller("offshoreControlController", function($scope, $window, $http, $timeout) {

    $scope.functions = [{
        "value": 1,
        "text": "Plataformista"
    }, {
        "value": 2,
        "text": "Torrista"
    }, {
        "value": 3,
        "text": "Sondador"
    }, {
        "value": 4,
        "text": "Toolpusher"
    }, {
        "value": 5,
        "text": "Deck Pusher"
    }, {
        "value": 6,
        "text": "Guindasteiros"
    }, {
        "value": 7,
        "text": "Auxiliar de Guindasteiro"
    }, {
        "value": 8,
        "text": "Roustaboud"
    }];
    $scope.companies = [{
        "value": 1,
        "text": "Exxon Mobil"
    }, {
        "value": 2,
        "text": "PetroChina"
    }, {
        "value": 3,
        "text": "Royal Dutch Shell"
    }, {
        "value": 4,
        "text": "BP"
    }, {
        "value": 5,
        "text": "Chevron"
    }, {
        "value": 6,
        "text": "Gazprom"
    }, {
        "value": 7,
        "text": "Total"
    }, {
        "value": 8,
        "text": "Sinopec"
    }, {
        "value": 9,
        "text": "Petrobras"
    }, {
        "value": 10,
        "text": "Rosneft"
    }];

    $scope.employee = new Object();
    $scope.employeeList = new Array();
    $scope.operation = "I";
    $scope.orderBy = 'name';


    $scope.init = function() {
        $scope.employeeList = JSON.parse(localStorage.getItem("employeeList"));
        if (null == $scope.employeeList) {
            $scope.employeeList = new Array();
            return false;
        }
    }

    $scope.clear = function() {
        $scope.employee = new Object();
    }

    $scope.clearInsert = function() {
        $scope.clear();
        $scope.operation = 'insert';
    }

    $scope.clearUpdate = function() {
        $scope.clear();
        $scope.operation = 'update';
    }


    $scope.insert = function() {
        if ($scope.formInsert.$invalid) {
            $.notify("Favor preencher todos os campos!", {
                type: 'warning'
            });
            return false;
        }

        if ($scope.employeeList.length == 0) {
            $scope.employee.id = 1;
        } else {
            $scope.employee.id = $scope.employeeList[$scope.employeeList.length - 1].id + 1;
        }
        $scope.employeeList.push($scope.employee);

        localStorage.setItem("employeeList", JSON.stringify($scope.employeeList));

        $.notify("Funcionário <strong>" + $scope.employee.name + "</strong> incluído com sucesso!");

        $scope.employee = new Object();

        $('#modalInsert').modal('hide');

    }

    $scope.update = function() {
        if ($scope.offshoreControlForm.$invalid) {
            $.notify("Favor preencher todos os campos!", {
                type: 'warning'
            });
            return false;
        }

        $scope.processUpdate();

        $.notify("Funcionário <strong>" + $scope.employee.name + "</strong> alterado com sucesso!");

        $scope.employee = new Object();
        $scope.operation = "insert";

        $('#modalInsert').modal('hide');

    }

    $scope.delete = function() {
        $scope.employeeList.splice($scope.index, 1);
        localStorage.setItem("employeeList", JSON.stringify($scope.employeeList));

        $.notify("Funcionário <strong>" + $scope.employee.name + "</strong> excluído com sucesso!");

        $scope.employee = new Object();
        $('#modalDelete').modal('hide');
    }

    $scope.confirmShipment = function() {
        if ($scope.formShipment.$invalid) {
            $.notify("Favor preencher a data de embarcação do funcionário!", {
                type: 'warning'
            });
            return false;
        }

        var dataSplit = $scope.employee.dateShipment.split('/');
        var date = dataSplit[0];
        var mounth = dataSplit[1];
        var year = dataSplit[2];

        $scope.employee.dateShipment = new Date(year, mounth - 1, date);
        $scope.employee.dateDisembarkation = null;
        $scope.processUpdate()
        $scope.employee = new Object();
        $scope.employee.dateDisembarkation = null;
        $('#modalShipment').modal('hide');

        location.reload();
    }

    $scope.confirmDisembarkation = function() {
        if ($scope.formDisembarkation.$invalid) {
            $.notify("Favor preencher a data de desembarcação do funcionário!", {
                type: 'warning'
            });
            return false;
        }
        var dataSplit = $scope.employee.dateDisembarkation.split('/');
        var date = dataSplit[0];
        var mounth = dataSplit[1];
        var year = dataSplit[2];

        $scope.employee.dateDisembarkation = new Date(year, mounth - 1, date);

        if (typeof $scope.employee.dateShipment === "string") {
            var dataSplit2 = $scope.employee.dateShipment.split('-');
            var date2 = dataSplit2[2].split('T')[0];
            var mounth2 = dataSplit2[1];
            var year2 = dataSplit2[0];
            $scope.employee.dateShipment = new Date(year2, mounth2 - 1, date2);
        }


        if ($scope.employee.dateDisembarkation < $scope.employee.dateShipment) {
            $.notify("Data de desembaque não pode ser menor que a data de embarque!", {
                type: 'warning'
            });
            $scope.employee.dateDisembarkation = null;
            return false;
        }

        $scope.employee.dateShipment = null;
        $scope.processUpdate();
        $scope.employee = new Object();

        $('#modalDisembarkation').modal('hide');

        location.reload();
    }

    $scope.processUpdate = function() {
        $scope.employeeList[$scope.index] = $scope.employee;
        localStorage.setItem("employeeList", JSON.stringify($scope.employeeList));
    }

    $scope.select = function(employee, index, op) {
        $scope.employee.id = employee.id;
        $scope.employee.name = employee.name;
        $scope.employee.function = employee.function;
        $scope.employee.company = employee.company;
        $scope.employee.dateShipment = employee.dateShipment;
        $scope.employee.dateDisembarkation = employee.dateDisembarkation;
        $scope.index = index;
        $scope.operation = op;
        $scope.msgsModal = null;
        $scope.msgs = null;
    }

    $scope.cancel = function() {
        $scope.employee = new Object();
    }

    $scope.sortBy = function(property) {
        if (property == $scope.orderBy) {
            $scope.orderBy = property;
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.orderBy = property;
            $scope.reverse = false;
        }

    }
});


app.filter("dateRangeFilter", function() {
    return function(items, from, to) {
        var dateStart;
        var dateEnd;
        if (undefined == from || "" == from) {
            dateStart = null;
        } else {
            dateStart = parseDate(from);
        }
        if (undefined == to || "" == to) {
            dateEnd = null;
        } else {
            dateEnd = parseDate(to);
        }

        var arrayToReturn = [];
        if (null == dateStart && null == dateEnd) {
            return items;
        }
        for (var i = 0; i < items.length; i++) {
            var dateShipmentItem = new Date(items[i].dateShipment);

            if (dateStart != null && null == dateEnd && dateStart <= dateShipmentItem) {
                arrayToReturn.push(items[i]);
            } else if (dateStart == null && null != dateEnd && dateEnd >= dateShipmentItem) {
                arrayToReturn.push(items[i]);
            } else if (dateStart <= dateShipmentItem && dateEnd >= dateShipmentItem) {
                arrayToReturn.push(items[i]);
            }
        }


        return arrayToReturn;
    };
});