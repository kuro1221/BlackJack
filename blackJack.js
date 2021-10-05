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

class Tool {
  static getRandumNumber(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
}

let deck = new Deck();
deck.resetDeck();
deck.shuffle();
console.log(deck.drawOne());
