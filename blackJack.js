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
       ?Number userData : モデル外から渡されるパラメータ。nullになることもあります。
       return GameDecision : 状態を考慮した上で、プレイヤーが行った決定。

        このメソッドは、どのようなベットやアクションを取るべきかというプレイヤーの決定を取得します。プレイヤーのタイプ、ハンド、チップの状態を読み取り、GameDecisionを返します。パラメータにuserData使うことによって、プレイヤーが「user」の場合、このメソッドにユーザーの情報を渡すことができますし、プレイヤーが 「ai」の場合、 userDataがデフォルトとしてnullを使います。
    */
  promptPlayer(userData) {
    //TODO: ここから挙動をコードしてください。
    switch (this.type) {
      case "user":
        break;
      case "house":
        break;
      case "ai":
        break;
      default:
        break;
    }
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
      total += this.hand[i];
      if (this.hand[i].rank == "A") countA += 1;
    }
    while (total > 21 && countA > 0) {
      total -= 10;
      countA -= 1;
    }
    return total;
  }
}

class House extends Player {
  constructor(name, type, gameType, chips) {
    super(name, type, gameType, (chips = -1));
  }

  clearBet() {
    this.bet = -1;
  }
}

class User extends Player {
  constructor(name, type, gameType, chips) {
    super(name, type, gameType, (chips = 400));
  }

  clearBet() {
    this.bet = 0;
  }
}

class AI extends Player {
  constructor(name, type, gameType, chips) {
    super(name, type, gameType, (chips = 400));
  }

  clearBet() {
    this.bet = 0;
  }
}

class Game {
  static assignPlayerHands(gameType, players) {}
  static evaluateAndGetRoundResults() {}
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
    this.house = new Player("ハウス", "house", this.gameType);
    this.gamePhase = "betting";
    this.resultsLog = [];
  }
  /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。

        EX:
        プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
  evaluateMove(Player) {
    //TODO: ここから挙動をコードしてください。
  }

  /*
       return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
  evaluateAndGetRoundResults() {
    //TODO: ここから挙動をコードしてください。
  }

  /*
       return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
       NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
    */
  assignPlayerHands() {
    //TODO: ここから挙動をコードしてください。
    Game.assignPlayerHands(this.gameTyped, this.players);
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
  }

  /*
       Number userData : テーブルモデルの外部から渡されるデータです。 
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
  haveTurn(userData) {
    //TODO: ここから挙動をコードしてください。
  }

  /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
  onFirstPlayer() {
    //TODO: ここから挙動をコードしてください。
  }

  /*
        return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
  onLastPlayer() {
    //TODO: ここから挙動をコードしてください。
  }

  /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
  allPlayerActionsResolved() {
    //TODO: ここから挙動をコードしてください。
  }
}

let deck = new Deck();
deck.resetDeck();
deck.shuffle();
console.log(deck.drawOne());
