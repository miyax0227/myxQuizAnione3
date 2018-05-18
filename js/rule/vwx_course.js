'use strict';

var appName = "myxQuizMain";
var app = angular.module(appName);

/*******************************************************************************
 * rule - ラウンド特有のクイズのルール・画面操作の設定
 ******************************************************************************/
app.factory('rule', ['qCommon', function(qCommon) {

  var rule = {};
  var win = qCommon.win;
  var lose = qCommon.lose;
  var rolling = qCommon.rolling;
  var timerStop = qCommon.timerStop;
  var setMotion = qCommon.setMotion;
  var addQCount = qCommon.addQCount;

  rule.judgement = judgement;
  rule.calc = calc;

  /*****************************************************************************
   * header - ルール固有のヘッダ
   ****************************************************************************/
  rule.head = [{
    "key": "pos",
    "value": true,
    "style": "boolean"
  }];

  /*****************************************************************************
   * items - ルール固有のアイテム
   ****************************************************************************/
  rule.items = [{
      "key": "courseWill",
      "value": 0,
      "style": "number",
      "css": "courseWill"
    },
    {
      "key": "priority",
      "order": [{
        "key": "rankPoint",
        "order": "desc"
      }]
    }
  ];

  /*****************************************************************************
   * tweet - ルール固有のツイートのひな型
   ****************************************************************************/
  rule.tweet = {};

  /*****************************************************************************
   * lines - ルール固有のプレイヤー配置
   ****************************************************************************/
  rule.lines = {
    "line1": {
      "x": 0.125,
      "top": 0.3,
      "bottom": 0.9,
      "zoom": 0.5,
      "orderBy": "rankPoint"
    },
    "line2": {
      "x": 0.375,
      "top": 0.3,
      "bottom": 0.9,
      "zoom": 0.5,
      "orderBy": "rankPoint"
    },
    "line3": {
      "x": 0.625,
      "top": 0.3,
      "bottom": 0.9,
      "zoom": 0.5,
      "orderBy": "rankPoint"
    },
    "line4": {
      "x": 0.875,
      "top": 0.3,
      "bottom": 0.9,
      "zoom": 0.5,
      "orderBy": "rankPoint"
    },
    "next": {
      "x": 0.3,
      "y": 0.2,
      "zoom": 1,
      "orderBy": "rankPoint"
    }
  };

  /*****************************************************************************
   * actions - プレイヤー毎に設定する操作の設定
   ****************************************************************************/
  rule.actions = [];

  /*****************************************************************************
   * global_actions - 全体に対する操作の設定
   ****************************************************************************/
  rule.global_actions = [{
    "name": "thru",
    "button_css": "btn btn-default",
    "group": "rule",
    "keyboard": "Space",
    "enable0": function(players, header, property) {
      return true;
    },
    "action0": function(players, header, property) {
      var nextPlayer;
      var nextPlayers = players.filter(function(p) {
        return p.next
      });

      if (nextPlayers.length >= 1) {
        nextPlayer = nextPlayers[0];

        for (var i = 1; i <= 4; i++) {
          var will = nextPlayer["" + i];

          // 人数オーバーの場合は次へ
          if (players.filter(function(p) {
              return p.course == will;
            }).length >= property.maxCourseCount[will]) {
            console.log("ng: " + will);
            continue;
          }

          // コースを設定
          console.log("ok: " + will);
          nextPlayer.course = will;
          break;
        }
      }
    }
  }];

  /*****************************************************************************
   * judgement - 操作終了時等の勝敗判定
   * 
   * @param {Array} players - players
   * @param {Object} header - header
   * @param {Object} property - property
   ****************************************************************************/
  function judgement(players, header, property) {
    angular.forEach(players.filter(function(item) {
      /* rankがない人に限定 */
      return (item.rank === 0);
    }), function(player, i) {

    });
  }

  /*****************************************************************************
   * calc - 従属変数の計算をする
   * 
   * @param {Array} players - players
   * @param {Object} items - items
   ****************************************************************************/
  function calc(players, header, items, property) {
    angular.forEach(players, function(player, index) {
      // pinch, chance
      player.pinch = false;
      player.chance = false;

      // nameLatの設定
      player.nameLat = player.name;
      player.handleNameLat = player.handleName;
      player.keyIndex = 999;

      // rankPoint
      player.rankPoint = player.paperRank * 1.001 + player.rollingRank * 10;

      //course
      if (!angular.isDefined(player.course)) {
        player.course = "";
      }

      // courseWill
      if (player.course === "") {
        player.courseWill =
          player["paperRank"] + "+" +
          player["rollingRank"] + "*10=" +
          (player["paperRank"] + player["rollingRank"] * 10) + " : " +
          player["1"] + player["2"] + player["3"] + player["4"];
      } else {
        player.courseWill = "";
      }
    });

    var nextPlayer;
    var nextPlayers = players.filter(function(p) {
      return p.course === "";
    }).sort(function(a, b) {
      return (a.rankPoint < b.rankPoint) ? -1 : 1;
    });

    if (nextPlayers.length >= 1) {
      nextPlayer = nextPlayers[0];
    }

    angular.forEach(players, function(player, index) {
      // line
      if (player == nextPlayer) {
        player.next = true;
        player.line = "next";
      } else {
        player.next = false;
        switch (player.course) {
          case "":
            player.line = "left";
            break;
          case "a":
            player.line = "line1";
            break;
          case "b":
            player.line = "line2";
            break;
          case "c":
            player.line = "line3";
            break;
          case "d":
            player.line = "line4";
            break;
          default:
            player.line = "left";
        }
      }
    });
  }

  return rule;
}]);