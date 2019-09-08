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
    },
    {
      "key": "nowGenre",
      "value": 1,
      "style": "number"
    }
  ];

  /*****************************************************************************
   * items - ルール固有のアイテム
   ****************************************************************************/
  rule.items = [{
      "key": "o",
      "value": 0,
      "style": "number",
      "css": "o2"
    },
    {
      "key": "x",
      "value": 0,
      "style": "number",
      "css": "x"
    },
    {
      "key": "genreCount",
      "value": 0,
      "style": "number",
      "css": "o"
    },
    {
      "key": "genre1",
      "value": 0,
      "style": "number",
      "css": "genre1",
      "repeatChar": "漫"
    },
    {
      "key": "genre2",
      "value": 0,
      "style": "number",
      "css": "genre2",
      "repeatChar": "ア"
    },
    {
      "key": "genre3",
      "value": 0,
      "style": "number",
      "css": "genre3",
      "repeatChar": "電"
    },
    {
      "key": "genre4",
      "value": 0,
      "style": "number",
      "css": "genre4",
      "repeatChar": "ノ"
    },
    {
      "key": "genre5",
      "value": 0,
      "style": "number",
      "css": "genre5",
      "repeatChar": "特"
    },
    {
      "key": "genre6",
      "value": 0,
      "style": "number",
      "css": "genre6",
      "repeatChar": "人"
    },
    {
      "key": "genre7",
      "value": 0,
      "style": "number",
      "css": "genre7",
      "repeatChar": "ホ"
    },
    {
      "key": "priority",
      "order": [{
          "key": "status",
          "order": "desc",
          "alter": [
            "win",
            2,
            "lose",
            0,
            1
          ]
        },
        {
          "key": "o",
          "order": "desc"
        },
        {
          "key": "x",
          "order": "asc"
        }
      ]
    }
  ];

  /*****************************************************************************
   * tweet - ルール固有のツイートのひな型
   ****************************************************************************/
  rule.tweet = {
    "o": "${handleName}◯　→${genreCount}ジャンル (${gotGenreList})",
    "x": "${handleName}×　→${x}×",
    "thru": "スルー",
    "x2": "${handleName}：${genreCount}ジャンル (${gotGenreList})"
  };

  /*****************************************************************************
   * lines - ルール固有のプレイヤー配置
   ****************************************************************************/
  rule.lines = {
    "line1": {
      "left": 0,
      "right": 1,
      "y": 0.5,
      "zoom": 1,
      "orderBy": "position"
    },
    "line2": {
      "left": 0,
      "right": 1,
      "y": 0.5,
      "zoom": 1,
      "orderBy": "priority"
    }
  };

  /*****************************************************************************
   * actions - プレイヤー毎に設定する操作の設定
   ****************************************************************************/
  rule.actions = [{
      "name": "○",
      "css": "action_o",
      "button_css": "btn btn-primary btn-lg",
      "keyArray": "k1",
      "tweet": "o",
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff);
      },
      "action0": function(player, players, header, property) {
        // ○を加算
        player.o++;
        // ジャンル獲得
        player["genre" + header.nowGenre] = 1;
        // ジャンル進める
        header.nowGenre++;
        if (header.nowGenre >= 8) {
          header.nowGenre = 1;
        }
        setMotion(player, 'o');
        addQCount(players, header, property);


      },
      "nowait": false
    },
    {
      "name": "×",
      "css": "action_x",
      "button_css": "btn btn-danger btn-lg",
      "keyArray": "k2",
      "tweet": "x",
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff);
      },
      "action0": function(player, players, header, property) {
        // ×を加算
        player.x++;
        // ジャンル進める
        header.nowGenre++;
        if (header.nowGenre >= 8) {
          header.nowGenre = 1;
        }
        setMotion(player, 'x');
        addQCount(players, header, property);
      },
      "nowait": false
    },
    {
      "name": "x1",
      "css": "action_x1",
      "button_css": "btn btn-danger",
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff && player["genre1"] == 1);
      },
      "action0": function(player, players, header, property) {
        // ジャンル喪失
        player["genre1"] = 0;
      },
      "nowait": false,
      "tweet": "x2"
    },
    {
      "name": "x2",
      "action0": function(player, players, header, property) {
        // ジャンル喪失
        player["genre2"] = 0;
      },
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff && player["genre2"] == 1);
      },
      "css": "action_x2",
      "button_css": "btn btn-danger",
      "nowait": false,
      "tweet": "x2"
    },
    {
      "name": "x3",
      "action0": function(player, players, header, property) {
        // ジャンル喪失
        player["genre3"] = 0;
      },
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff && player["genre3"] == 1);
      },
      "css": "action_x3",
      "button_css": "btn btn-danger",
      "nowait": false,
      "tweet": "x2"
    },
    {
      "name": "x4",
      "action0": function(player, players, header, property) {
        // ジャンル喪失
        player["genre4"] = 0;
      },
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff && player["genre4"] == 1);
      },
      "css": "action_x4",
      "button_css": "btn btn-danger",
      "nowait": false,
      "tweet": "x2"
    },
    {
      "name": "x5",
      "action0": function(player, players, header, property) {
        // ジャンル喪失
        player["genre5"] = 0;
      },
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff && player["genre5"] == 1);
      },
      "css": "action_x5",
      "button_css": "btn btn-danger",
      "nowait": false,
      "tweet": "x2"
    },
    {
      "name": "x6",
      "action0": function(player, players, header, property) {
        // ジャンル喪失
        player["genre6"] = 0;
      },
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff && player["genre6"] == 1);
      },
      "css": "action_x6",
      "button_css": "btn btn-danger",
      "nowait": false,
      "tweet": "x2"
    },
    {
      "name": "x7",
      "action0": function(player, players, header, property) {
        // ジャンル喪失
        player["genre7"] = 0;
      },
      "enable0": function(player, players, header, property) {
        return (player.status == 'normal' && !header.playoff && player["genre7"] == 1);
      },
      "css": "action_x7",
      "button_css": "btn btn-danger",
      "nowait": false,
      "tweet": "x2"
    }
  ];

  /*****************************************************************************
   * global_actions - 全体に対する操作の設定
   ****************************************************************************/
  rule.global_actions = [{
      "name": "thru",
      "button_css": "btn btn-default",
      "group": "rule",
      "keyboard": "Space",
      "tweet": "thru",
      "enable0": function(players, header, property) {
        return true;
      },
      "action0": function(players, header, property) {
        // ジャンル進める
        header.nowGenre++;
        if (header.nowGenre >= 8) {
          header.nowGenre = 1;
        }
        addQCount(players, header, property);
      },
      "nowait": false
    },
    {
      "name": "pos",
      "button_css": "btn btn-default",
      "group": "rule",
      "enable0": function(players, header, property) {
        return true;
      },
      "action0": function(players, header, property) {
        header.pos = !header.pos;
      },
      "keyArray": "",
      "nowait": false
    }
  ];

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
      /* win条件 */
      if (player.genreCount >= property.winningPoint) {
        win(player, players, header, property);
      }
      /* lose条件 */
      if (player.x >= property.losingPoint) {
        lose(player, players, header, property);
      }
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
      // genreCount
      player.genreCount = player["genre1"] + player["genre2"] + player["genre3"] + player["genre4"] + player["genre5"] + player["genre6"] + player["genre7"];
      // gotGenreList
      player.gotGenreList = [1, 2, 3, 4, 5, 6, 7].filter(function(g) {
        return player["genre" + g] == 1;
      }).map(function(g) {
        return property.genre[g - 1];
      }).join(',');

      // pinch, chance
      player.pinch = (player.x == property.losingPoint - 1) && (player.status == 'normal');
      player.chance = (player.genreCount + 1 >= property.winningPoint) && (player.status == 'normal');

      // キーボード入力時の配列の紐付け ローリング等の特殊形式でない場合はこのままでOK\
      player.keyIndex = player.position;
      if (header.pos) {
        player.line = "line1";
      } else {
        player.line = "line2";
      }
    });
  }

  return rule;
}]);