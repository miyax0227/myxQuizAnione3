var appName = "myxQuizEditor";
var app = angular.module(appName, [ "ui.bootstrap", "ngAnimate", "ui.sortable", "ui.ace",
	"angular-clipboard" ]);

/*******************************************************************************
 * メインコントローラ
 * @class
 * @name main
 */
app.controller('main', [ '$scope', 'qeditor', '$interval', 'round', 'rule',
	function($scope, qeditor, $interval, round, rule) {
	  const
	  fs = require('fs');

	  $scope.rounds = [];
	  $scope.csses = [];
	  $scope.rules = [];
	  $scope.styles = [ "number", "string", "boolean", "null" ];
	  $scope.orders = [ "desc", "asc" ];
	  $scope.aceEditors = {};
	  $scope.aceEditorWaitors = [];
	  refresh();

	  $scope.refresh = refresh;
	  $scope.openRound = openRound;
	  $scope.copyRound = copyRound;
	  $scope.openRule = openRule;
	  $scope.copyRule = copyRule;
	  $scope.aceLoaded = aceLoaded;

	  /*************************************************************************
	   * ファイルリストをリフレッシュする
	   * @memberOf main
	   */
	  function refresh() {
		$scope.rounds = qeditor.getFileList(__dirname + '/round', false);
		$scope.csses = qeditor.getFileList(__dirname + '/css', true, 'css');
		$scope.rules = qeditor.getFileList(__dirname + '/js/rule', true, 'js');
	  }

	  /*************************************************************************
	   * ラウンドを開く
	   * @memberOf main
	   */
	  function openRound(name) {
		if (round.name) {
		  qeditor.confirm(round.name + "を保存しなくてもよろしいでしょうか?", function(result) {
			rule.closeRule();
			round.load(name);
			return;
		  });
		} else {
		  round.load(name);
		}
	  }

	  /*************************************************************************
	   * ラウンドをコピーする
	   * @memberOf main
	   */
	  function copyRound(name) {
		var oldRound = __dirname + '/round/' + name;
		var newRound = "";

		qeditor.inputBox("新しいラウンドの名前を入力してください。", function(result) {
		  newRound = __dirname + '/round/' + result.inputString;

		  fs.mkdirSync(newRound);
		  qeditor.copyFile(oldRound + '/board.json', newRound + '/board.json');
		  qeditor.copyFile(oldRound + '/board.html', newRound + '/board.html');
		  qeditor.copyFile(oldRound + '/entry.json', newRound + '/entry.json');
		  qeditor.copyFile(oldRound + '/property.json', newRound + '/property.json');

		});
	  }

	  /*************************************************************************
	   * ルールを開く
	   * @memberOf main
	   */
	  function openRule(name) {
		round.closeRound();
		rule.load(name);
	  }

	  /*************************************************************************
	   * ルールをコピーする
	   * @memberOf main
	   */
	  function copyRule(name) {
		var oldRule = __dirname + '/js/rule/' + name;
		var newRule = "";

		qeditor.inputBox("新しいルールの名前を入力してください。", function(result) {
		  newRule = __dirname + '/js/rule/' + result.inputString + '.js';

		  qeditor.copyFile(oldRule, newRule);
		  qeditor.copyFile(oldRule + 'on', newRule + 'on');

		});
	  }

	  /*************************************************************************
	   * aceエディタ起動処理
	   */
	  function aceLoaded(_editor) {
		console.log("aceLoaded!");
		_editor.commands.addCommand({
		  Name : "beautify",
		  bindKey : {
			win : "Ctrl-Shift-F",
			mac : "Ctrl-Shift-F"
		  },
		  exec : function(editor) {
			var session = editor.getSession();
			session.setValue(qeditor.beautify(session.getValue()));
		  }
		});

		_editor.on("focus", function() {
		  $scope.focusedEditor = _editor;
		  console.log("aceFocused!");
		});
	  }

	} ]);

/*******************************************************************************
 * ラウンド編集用のコントローラ
 * @class
 * @name roundCtrl
 */
app.controller('roundCtrl', [ '$scope', 'round', function($scope, round) {
  $scope.round = round;
} ]);

/*******************************************************************************
 * ルール編集用のコントローラ
 * @class
 * @name ruleCtrl
 */
app.controller('ruleCtrl', [ '$scope', 'rule', function($scope, rule) {
  $scope.rule = rule;
} ]);

/*******************************************************************************
 * モーダルウィンドウのコントローラ
 * @class
 * @name modal
 */
app.controller('modal', [ '$scope', '$uibModalInstance', 'myMsg',
	function($scope, $uibModalInstance, myMsg) {
	  // メッセージ表示
	  $scope.msg = myMsg.msg;
	  $scope.input = {};
	  $scope.input.inputString = "";

	  /* modalOK - OKボタン押下 */
	  $scope.modalOK = function() {
		$uibModalInstance.close($scope.input);
	  }

	  /* modalCancel - Cancelボタン押下 */
	  $scope.modalCancel = function() {
		$uibModalInstance.dismiss($scope.input);
	  }
	} ]);

/*******************************************************************************
 * ディレクティブ
 */
app.directive('editorRoundBoard', function() {
  return {
	templateUrl : './template/editor-round-board.html'
  }
});

app.directive('editorRoundEntry', function() {
  return {
	templateUrl : './template/editor-round-entry.html'
  }
});

app.directive('editorRoundProperty', function() {
  return {
	templateUrl : './template/editor-round-property.html'
  }
});

app.directive('editorRuleHeader', function() {
  return {
	templateUrl : './template/editor-rule-header.html'
  }
});

app.directive('editorRuleItems', function() {
  return {
	templateUrl : './template/editor-rule-items.html'
  }
});

app.directive('editorRulePriority', function() {
  return {
	templateUrl : './template/editor-rule-priority.html'
  }
});

app.directive('editorRuleTweet', function() {
  return {
	templateUrl : './template/editor-rule-tweet.html'
  }
});

app.directive('editorRuleActions', function() {
  return {
	templateUrl : './template/editor-rule-actions.html'
  }
});

app.directive('editorRuleJudgement', function() {
  return {
	templateUrl : './template/editor-rule-judgement.html'
  }
});

app.directive('editorRuleCalc', function() {
  return {
	templateUrl : './template/editor-rule-calc.html'
  }
});

app.directive('uiClipboard', function() {
  return {
	templateUrl : './template/clipboard.html',
	scope : {
	  "words" : "="
	}
  }
});