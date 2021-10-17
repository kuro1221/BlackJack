//トランプのスイートとランク
const suit = ["H", "D", "C", "S"];
const rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

class Card {
  /*
       String suit : {"H", "D", "C", "S"}から選択
       String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}から選択
    */
  constructor(suit, rank) {
    //スート;
    this.suit = suit;
    //ランク;
    this.rank = rank;
  }

  /*
       return Number : カードのランクを基準とした整数のスコア。
       
        2-10はそのまま数値を返します。
        {"J", "Q", "K"}を含む、フェースカードは10を返します。
        "A」が1なのか11なのかを判断するには手札全体の知識が必要なので、「A」はとりあえず11を返します。
    */
  getRankNumber() {
    //TODO: ここから挙動をコードしてください。
    if (this.rank == "J" || this.rank == "Q" || this.rank == "K") {
      return 10;
    } else if (this.rank == "A") {
      return 11;
    } else {
      return Number(this.rank);
    }
  }
}

// 前回作成したコードをここに貼り付けてください。

class Deck {
  /*
       String gameType : ゲームタイプの指定。{'blackjack'}から選択。
    */
  constructor(gameType) {
    // このデッキが扱うゲームタイプ
    this.gameType = gameType;
    // カードの配列
    this.cards = [];

    // ゲームタイプによって、カードを初期化してください。
    this.resetDeck();
  }

  /*
       return null : このメソッドは、デッキの状態を更新します。

       カードがランダムな順番になるようにデッキをシャッフルします。
    */
  shuffle() {
    //TODO: ここから挙動をコードしてください。
    for (let i = this.cards.length - 1; i >= 0; i--) {
      let rand = Tool.getRandumNumber(0, i);
      let temp = this.cards[rand];
      this.cards[rand] = this.cards[i];
      this.cards[i] = temp;
    }
  }

  /*
       String gameType : どのゲームにリセットするか
       return null : このメソッドは、デッキの状態を更新します。
    

    */
  resetDeck() {
    //TODO: ここから挙動をコードしてください。
    this.cards = [];
    for (let i = 0; i < suit.length; i++) {
      for (let j = 0; j < rank.length; j++) {
        this.cards.push(new Card(suit[i], rank[j]));
      }
    }
  }

  /*
       return Card : ポップされたカードを返します。
       カード配列から先頭のカード要素をポップして返します。
    */
  drawOne() {
    //TODO: code behavior here
    return this.cards.shift();
  }
}

class Player {
  /*
        String name : プレイヤーの名前
        String type : プレイヤータイプ。{'ai', 'user', 'house'}から選択。
        String gameType : {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
        ?Number chips : ゲーム開始に必要なチップ。デフォルトは400。
    */
  constructor(name, type, gameType, chips) {
    this.name = name;
    this.type = type;
    this.gameType = gameType;
    this.hand = [];
    this.chips = chips;
    this.bet = 0;

    // 勝利金額。正の数にも負の数にもなります。
    this.winAmount = 0;

    // プレイヤーのゲームの状態やアクションを表します。
    // ブラックジャックの場合、最初の状態は「betting」です。
    this.gameStatus = "betting";
  }

  /*
       return Number : 手札の合計

       合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます。
    */
  getHandScore() {
    //TODO: ここから挙動をコードしてください。
    let total = 0;
    let countA = 0;
    for (let i = 0; i < this.hand.length; i++) {
      total += this.hand[i].getRankNumber();
      if (this.hand[i].rank == "A") countA += 1;
    }
    while (total > 21 && countA > 0) {
      total -= 10;
      countA -= 1;
    }
    return total;
  }

  toStringHand() {
    let s;
    for (let i = 0; i < this.hand.length; i++) {
      s += this.name + "の手札" + (i + 1) + "枚目:" + this.hand[i].suit + this.hand[i].rank + "\n";
    }
    return s;
  }

  toStringBet() {
    return this.name + "のbet:" + this.bet + "$\n";
  }

  toStringStatus() {
    let s;
    s += "----------------------\n";
    for (let i = 0; i < this.hand.length; i++) {
      s += this.name + "の手札" + (i + 1) + "枚目:" + this.hand[i].suit + this.hand[i].rank + "\n";
    }
    s += this.name + "のbet:" + this.bet + "$\n";
    s += "状態:" + this.gameStatus + "\n";
    s += "----------------------\n";
    return s;
  }
}

class House extends Player {
  constructor(name, type, gameType, chips) {
    super(name, "house", gameType, (chips = -1));
  }

  clearBet() {
    this.bet = -1;
  }

  blackJackPromptPlayer(table) {
    if (table.gamePhase == "betting") {
      let betMoney = -1; //入力値を入れる
      return new GameDecision("bet", betMoney);
    } else if (table.gamePhase == "acting" && this.gameStatus == "bet") {
      let selectAction = "stand";
      return new GameDecision(selectAction, -1);
    }
  }

  blackJackAssignPlayerHands(deck) {
    this.hand.push(deck.drawOne());
  }
}

class User extends Player {
  constructor(name, gameType, chips) {
    super(name, "user", gameType, (chips = 400));
  }

  clearBet() {
    this.bet = 0;
  }

  blackJackAssignPlayerHands(deck) {
    this.hand.push(deck.drawOne());
    this.hand.push(deck.drawOne());
  }

  blackJackPromptPlayer(table) {
    if (table.gamePhase == "betting") {
      let betMoney = 100; //入力値を入れる
      return new GameDecision("bet", betMoney);
    } else if (table.gamePhase == "acting" && this.gameStatus == "bet") {
      let selectAction = "stand";
      return new GameDecision(selectAction, -1);
    }
  }
}

class AI extends Player {
  constructor(name, type, gameType, chips) {
    super(name, "ai", gameType, (chips = 400));
  }

  clearBet() {
    this.bet = 0;
  }

  blackJackPromptPlayer(table) {
    if (table.gamePhase == "betting") {
      let betMoney = 100; //入力値を入れる
      return new GameDecision("bet", betMoney);
    } else if (table.gamePhase == "acting" && this.gameStatus == "bet") {
      let selectAction = "stand";
      return new GameDecision(selectAction, -1);
    }
  }

  blackJackAssignPlayerHands(deck) {
    this.hand.push(deck.drawOne());
    this.hand.push(deck.drawOne());
  }
}

class Game {
  static assignPlayerHands(gameType, players, deck) {
    if (gameType == "BlackJack") {
      for (let i = 0; i < players.length; i++) {
        players[i].blackJackAssignPlayerHands(deck);
      }
    }
  }

  static promptPlayer(gameType, player, table) {
    if (gameType == "BlackJack") {
      return player.blackJackPromptPlayer(table);
    }
  }

  /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。

        EX:
        プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
  static evaluateMove(player, table) {
    //TODO: ここから挙動をコードしてください。
    if (table.gameType == "BlackJack") BlackJack.evaluateMove(player, table);
  }

  static evaluateAndGetRoundResults(table) {
    if (table.gameType == "BlackJack") BlackJack.evaluateAndGetRoundResults(table);
  }

  static allPlayerActionsResolved(table) {
    if (table.gameType == "BlackJack") {
      for (let i = 0; i < table.players.length; i++) {
        if (!BlackJack.setGameStatus[table.players[i].gameStatus]) return false;
      }
      return true;
    }
  }
}

class BlackJack {
  allPlayerActionsResolved;
  static setGameStatus = { broken: 1, bust: 1, stand: 1, surrender: 1 };
  static gameAction = ["surrender", "stand", "hit", "double"];

  static evaluateMove(player, table) {
    let gameDecision = player.blackJackPromptPlayer(table);
    if (table.gamePhase == "betting") {
      player.gameStatus = gameDecision.action;
      player.bet = gameDecision.amount;
    } else if (table.gamePhase == "acting") {
      switch (gameDecision.action) {
        case "surrender":
          player.gameStatus = "surrender";
          break;
        case "stand":
          player.gameStatus = "stand";
          break;
        case "hit":
          player.hand.push(table.deck.drawOne());
          if (player.getHandScore() > 21) player.gameStatus = "bust";
          break;
        case "double":
          player.hand.push(table.deck.drawOne());
          player.bet *= 2;
          if (player.getHandScore() > 21) player.gameStatus = "bust";
          break;
      }
    }
  }

  static evaluateAndGetRoundResults(table) {
    let house = table.players[0];
    BlackJack.evaluatePhaseHouseDrow(house, table);
    BlackJack.evaluateBlackJack(table);
    BlackJack.evaluateBet(house, table);
  }

  static evaluatePhaseHouseDrow(house, table) {
    while (house.getHandScore() < 17) {
      house.hand.push(table.deck.drawOne());
    }
    if (house.getHandScore() > 21) house.gameStatus = "bust";
  }

  static evaluateBlackJack(table) {
    for (let i = 0; i < table.players.length; i++) {
      //手札が2枚で合計値が21ならBlackJack
      if (table.players[i].length == 2 && table.players[i].getHandScore() == 21) {
        table.players[i].gameStatus = "BlackJack";
      }
    }
  }

  static evaluateBet(house, table) {
    let result;
    let getChips = 0;
    for (let i = 1; i < table.players.length; i++) {
      let player = table.players[i];
      if (player.gameStatus == "surrender") {
        result = "surrender";
      } else {
        if (house.gameStatus == "BlackJack") {
          if (player.gameStatus == "BlackJack") result = "push";
          else {
            result = "lost";
            getChips = -player.chips;
          }
        } else if (house.gameStatus == "bust") {
          if (player.gameStatus == "BlackJack") {
            result = "win";
            getChips = player.bet * 1.5;
          } else if (player.gameStatus == "bust") result = "lpush";
          else {
            result = "lost";
            getChips = -player.chips;
          }
        } else {
          if (player.getHandScore() > house.getHandScore()) {
            result = "win";
            getChips = player.bet;
          } else if (player.getHandScore() < house.getHandScore()) {
            result = "lost";
            getChips = -player.bet;
          } else {
            result = "push";
          }
        }
      }
      player.chips += getChips;
      Log.outputEvaluateBlackJackLog(player, result, getChips);
      getChips = 0;
      result = "";
    }
  }
}

class Tool {
  static getRandumNumber(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
}

class GameDecision {
  /*
       String action : プレイヤーのアクションの選択。（ブラックジャックでは、hit、standなど。）
       Number amount : プレイヤーが選択する数値。

       これはPlayer.promptPlayer()は常にreturnする、標準化されたフォーマットです。
    */
  constructor(action, amount) {
    // アクション
    this.action = action;
    // プレイヤーが選択する数値
    this.amount = amount;
  }
}

class Table {
  /*
       String gameType : {"blackjack"}から選択。
       Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
       return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
    */
  constructor(gameType, betDenominations = [5, 20, 50, 100]) {
    // ゲームタイプを表します。
    //this.gameType = gameType;
    // プレイヤーが選択できるベットの単位。
    //this.betDenominations = betDenominations;
    // テーブルのカードのデッキ
    //this.deck = new Deck(this.gameType);
    // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
    // 今回はとりあえず3人のAIプレイヤーとハウス、「betting」フェースの始まりにコミットしましょう。
    //this.players = []
    // プレイヤーをここで初期化してください。
    //this.house = new Player('house', 'house', this.gameType);
    //this.gamePhase = 'betting'
    // これは各ラウンドの結果をログに記録するための文字列の配列です。
    //this.resultsLog = []
    this.gameType = gameType;
    this.betDenominations = betDenominations;
    this.deck = new Deck(this.gameType);
    this.players = [];
    this.house = new House("ハウス", "house", this.gameType);
    this.gamePhase = "betting";
    this.resultsLog = [];
    this.turnCounter = 0;
  }

  /*
       return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
       NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
    */
  assignPlayerHands() {
    //TODO: ここから挙動をコードしてください。
    Game.assignPlayerHands(this.gameType, this.players, this.deck);
  }

  /*
       return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
    */
  clearPlayerHandsAndBets() {
    //TODO: ここから挙動をコードしてください。
    this.deck.resetDeck();
    this.deck.shuffle();
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].hand = [];
      this.players[i].clearBet();
    }
  }

  /*
       return Player : 現在のプレイヤー
    */
  getTurnPlayer() {
    //TODO: ここから挙動をコードしてください。
    return this.players[this.turnCounter % this.players.length];
  }

  /*
       Number userData : テーブルモデルの外部から渡されるデータです。 
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
  haveTurn(userData) {
    //TODO: ここから挙動をコードしてください。
    let currentUser = this.getTurnPlayer();
    //ベットフェーズ
    if (this.gamePhase == "betting") {
      if (this.turnCounter == 0) {
        this.clearPlayerHandsAndBets();
        this.assignPlayerHands();
      }
      Game.evaluateMove(currentUser, this);
      if (this.turnCounter == this.players.length - 1) {
        this.gamePhase = "acting";
      }
      this.turnCounter += 1;
      //アクティングフェーズ
    } else if (this.gamePhase == "acting") {
      Game.evaluateMove(currentUser, this);
      if (this.turnCounter % this.players.length == this.players.length - 1) {
        //全プレイヤーがセットされている場合、roundOverフェーズに移行
        if (Game.allPlayerActionsResolved(this)) this.gamePhase = "evaluatingWinners";
      }
      this.turnCounter += 1;
      //評価フェーズ
    } else if (this.gamePhase == "evaluatingWinners") {
      Game.evaluateAndGetRoundResults(this);
      this.gamePhase = "betting";
      this.turnCounter = 0;
    }
  }

  /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
  onFirstPlayer() {
    //TODO: ここから挙動をコードしてください。
    if (this.getTurnPlayer() == this.players[0]) return true;
  }

  /*
        return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
  onLastPlayer() {
    //TODO: ここから挙動をコードしてください。
    if (this.getTurnPlayer() == this.players[this.players.length - 1]) return true;
  }

  /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
}

class Controller {
  constructor(table) {
    this.table = table;
  }

  bettingPhase() {
    for (let i = 0; i < this.table.players.length; i++) {
      this.table.haveTurn();
    }
  }

  acttingPhase() {
    while (this.table.gamePhase == "acting") {
      this.table.haveTurn();
    }
  }
}

class Log {
  static outputLog() {
    let table = new Table("BlackJack");
    table.players.push(table.house);
    table.players.push(new User("player1", table.gameType));
    table.players.push(new AI("AI1", table.gameType));
    let controller = new Controller(table);
    controller.bettingPhase();
    // table.haveTurn();
    // table.haveTurn();
    // table.haveTurn();
    console.log("【ターン1:Bet ステータス】");
    console.log(table.players[0].toStringStatus());
    console.log(table.players[1].toStringStatus());
    console.log(table.players[2].toStringStatus());
    console.log("【ターン2:Act ステータス】");
    controller.acttingPhase();
    console.log(table.players[0].toStringStatus());
    console.log(table.players[1].toStringStatus());
    console.log(table.players[2].toStringStatus());
    table.haveTurn();
    console.log("ラウンド終了");
  }

  static outputEvaluateBlackJackLog(player, result, getChips) {
    let s;
    s = player.name + "result:" + result + " chips:$" + getChips + "\n";
    console.log(s);
    // return;
  }
}

Log.outputLog();
