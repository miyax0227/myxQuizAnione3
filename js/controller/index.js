'use strict';

var appName = "myxQuizIndex";
var app = angular.module(appName, ["ui.bootstrap", "ngAnimate", "ngResource"]);

/** INDEX画面用コントローラ */
app.controller('index', ['$scope', 'qFile', function ($scope, qFile) {
	$scope.tableHead = [];
	$scope.tableContent = [];
	$scope.rounds = qFile.rounds;
	angular.forEach($scope.rounds, function (round) {
		round.initialize = function () {
			round.initialize0($scope);
		};
		round.callUp = function () {
			round.callUp0($scope);
		};
	});

	$scope.initialize = qFile.initialize;
	$scope.twitterWindowOpen = qFile.twitterWindowOpen;
	$scope.openFolder = qFile.openFolder;

	$scope.openNameList = function () {
		qFile.openNameList($scope);
	};
	$scope.openQuestion = function () {
		qFile.openQuestion($scope);
	};
	$scope.saveJsonFile = function () {
		qFile.saveJsonFile($scope);
	};
	$scope.cancelJsonFile = function () {
		qFile.cancelJsonFile($scope);
	};

}]);

/** モーダルウィンドウ用コントローラ */
app.controller('modal',
	['$scope', '$uibModalInstance', 'myMsg', function ($scope, $uibModalInstance, myMsg) {
		// メッセージ表示
		$scope.msg = myMsg.msg;

		/* modalOK - OKボタン押下 */
		$scope.modalOK = function () {
			$uibModalInstance.close();
		};

		/* modalCancel - Cancelボタン押下 */
		$scope.modalCancel = function () {
			$uibModalInstance.dismiss();
		};
	}]);
