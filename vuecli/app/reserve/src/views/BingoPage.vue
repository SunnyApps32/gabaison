<template>
  <div id="app" :class="teamClass">
    <h1>ビンゴゲーム</h1>
    <div class="bingo-grid">
      <div
        v-for="(cell, index) in bingoCells"
        :key="index"
        :class="['bingo-cell']"
        @click="selectNumber(index, cell)"
        :style="{ backgroundImage: `url(${getImageForType(cell.type,cell.marked)})` }"
      >
        <span class="cell-number">
          <div v-if=!cell.marked>{{ cell.number }}</div></span>
      </div>
    </div>
  </div>

  <h2>試合結果予想</h2>
  <div class="match-info">
    <div class="team">
      <img :src="teamALogo" alt="Team A Logo" class="team-logo" />
      <p>{{ teamAName }}</p>
    </div>
    <div class="score-input">
      <input v-model="teamAScore" type="number" placeholder="点数を予想" />
      <span> - </span>
      <input v-model="teamBScore" type="number" placeholder="点数を予想" />
    </div>
    <div class="team">
      <img :src="teamBLogo" alt="Team B Logo" class="team-logo" />
      <p>{{ teamBName }}</p>
    </div>
  </div>

  <button @click="savePrediction">予想を保存</button> <!-- ここにボタンを追加 -->

  <div v-if="showPopup" class="popup-overlay" @click="closePopup">
    <div class="popup">
      <p>番号 {{ selectedNumber.number }} が選択されました！</p>
      <p>名前 {{ selectedNumber.name }} が選択されました！</p>
      <p>名前 {{ selectedNumber.position }} が選択されました！</p>
      <img :src="selectedNumber.image" :alt="selectedNumber.name" class="player-image"/>
      <button @click="closePopup">OK</button>
    </div>
  </div>
</template>

<script>
import { saganTosuPlayers } from '@/testData/saganTosuPlayers.js'; // テストデータのインポート
//import { koubeTosuPlayers } from '@/testData/koubePlayers.js';
import { onAuthStateChanged } from "firebase/auth";
import Firebase from "../firebase/firebase";
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';

const auth = Firebase.auth;
const db = getFirestore();

export default {
  data() {
    return {
      bingoCells: [],
      showPopup: false,
      selectedNumber: null,
      teamAScore: '',
      teamBScore: '',
      uid: '',
      number: 0,
      userData: '',
      team: '',
      teamALogo: require('@/assets/bingo-saganL.png'),
      teamBLogo: require('@/assets/bingo-visselL.png'),
    };
  },
  async created() {
    // ユーザ情報取得
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
      } else {
        console.log('User is not logged in.');
      }
    });

    await this.getUserData();

    if (this.userData.bingoCells) {
      this.bingoCells = this.userData.bingoCells;
      console.log(this.bingoCells)
    } else {
      this.bingoCells = await this.generateBingoCells();
      await this.saveBingoCells();
    }
  },
  methods: {
    saveBingoCells(){
      setDoc(doc(db, 'user', this.uid), {
        bingoCells: this.bingoCells,
        timestamp: new Date(),
      }, { merge: true }
      );


    },
    generateBingoCells() {
      const selectedPlayers = this.getRandomPlayers(16); // 中央のセル以外のプレイヤー番号を選択
      // プレイヤー番号とタイプを使ってビンゴのセルを作成
      const bingoCells = selectedPlayers.map(player => ({
        number: player.number,
        name: player.name,
        image: player.image,
        position: player.position,
        type: 1,
        marked:false
      }));

      bingoCells.splice(6, 0, { number: ``, name: 'Free', type: 3 , marked:false});
      bingoCells.splice(16, 0, { number: ``, name: 'Free', type: 4 , marked:false});
      bingoCells.splice(20, 0, { number: ``, name: 'Free', type: 5, marked:false });
      bingoCells.splice(23, 0, { number: ``, name: 'Free', type: 6, marked:false });  

      // 中央のセルにデータベースから取得したnumberを設定
      const centerIndex = 12; // ビンゴの中央のセルのインデックス
      bingoCells.splice(centerIndex, 0, { number: this.number, name: 'Central', type: 1, marked:true });

      return bingoCells;
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    getRandomPlayers(count) {
      //const shuffled = this.shuffleArray(koubePlayers);
      const shuffled = this.shuffleArray(saganTosuPlayers); // シャッフルして
      console.log('シャッフル');
      console.log(shuffled);
      return shuffled.slice(0, count); // 指定した数だけ選択
    },
    selectNumber(index, cell) {
      this.selectedNumber = cell;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    getImageForType(type,marked) {
      // タイプに応じた画像パスを返す
      if (marked) {
        switch (type) {
          case 1:
            if (this.team === 'ヴィッセル神戸') {
              return require('@/assets/bingo-visselT_on.png'); // ヴィッセル神戸の画像
            } else {
              return require('@/assets/bingo-saganT_on.png'); // サガン鳥栖の画像
            }
          case 2:
            return require('@/assets/bingo-studium-on.png');
          case 3:
            return require('@/assets/sagajou-on.png');
          case 4:
            return require('@/assets/mihuneyama-on.png');
          case 5:
            return require('@/assets/hadomisaki-on.png');
          case 6:
            return require('@/assets/tosueki-on.png');
        }
      } else {
        switch (type) {
          case 1:
            if (this.team === 'ヴィッセル神戸') {
              return require('@/assets/bingo-visselT.png'); // ヴィッセル神戸の画像
            } else {
              return require('@/assets/bingo-saganT.png'); // サガン鳥栖の画像
            }
          case 2:
            return require('@/assets/bingo-studium.png');
          case 3:
            return require('@/assets/sagajou.jpg');
          case 4:
            return require('@/assets/mifuneyama.jpg');
          case 5:
            return require('@/assets/hadomisaki.jpg');
          case 6:
            return require('@/assets/tosuStation.jpg');
        }
      }
      
    },
    async getUserData() {
      try {
        const querySnapshot = await getDoc(doc(db, 'user', this.uid));
        this.userData = querySnapshot.data();
        this.number = this.userData["number"];
        this.team = this.userData["team"];
        if ("teamAScore" in this.userData && "teamBScore" in this.userData) {
          console.log("team プロパティが存在します:", this.userData["teamAScore"], this.userData["teamBScore"]);
          this.teamAScore = this.userData["teamAScore"];
          this.teamBScore = this.userData["teamBScore"];
        }
        else {
          console.log("team プロパティは存在しません");
        } 
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    },
    async savePrediction() {
      if (this.teamAScore === '' || this.teamBScore === '') {
        alert("点数を入力してください");
        return;
      }

      try {
        // Firestoreに予想点数を保存する
        await setDoc(doc(db, 'user', this.uid), {
          teamAScore: this.teamAScore,
          teamBScore: this.teamBScore,
          timestamp: new Date(),
        }, { merge: true }
        );
        alert("予想点数が保存されました！");
        //再度値を取得
        await this.getUserData();
        if (this.userData.bingoCells) {
          this.bingoCells = this.userData.bingoCells;
          this.bingoCells.splice(0, 1, { number: `${this.teamAScore}-${this.teamBScore}`, name: 'Free', type: 2, marked:false });
          this.bingoCells.splice(4, 1, { number: `${this.teamAScore}`, name: 'Free', type: 2, marked:false });
          this.bingoCells.splice(22, 1, { number: `${this.teamBScore}`, name: 'Free', type: 2, marked:false });
          console.log(this.bingoCells)
          await this.saveBingoCells();
        } else {
          this.bingoCells = await this.generateBingoCells();
          this.bingoCells.splice(0, 1, { number: `${this.teamAScore}-${this.teamBScore}`, name: 'Free', type: 2, marked:false });
          this.bingoCells.splice(4, 1, { number: `${this.teamAScore}`, name: 'Free', type: 2, marked:false });
          this.bingoCells.splice(22, 1, { number: `${this.teamBScore}`, name: 'Free', type: 2, marked:false });
          await this.saveBingoCells();
        }
      } catch (error) {
        console.error("Error saving prediction: ", error);
        alert("予想点数の保存に失敗しました。");
      }
    },
  },
  computed: {
    teamClass() {
      console.log(this.team)
      if (this.team === 'サガン鳥栖') {
        return 'tosu';
      } else if (this.team === 'ヴィッセル神戸') {
        return 'vissel';
      } else {
        return '';
      }
    },
  },
};
</script>


<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
  position: relative; /* 子要素の配置基準とする */
  border: 2px solid rgb(90, 90, 90); /* 黒い線で囲む */
  padding: 20px; /* 内側の余白を追加 */
  border-radius: 5px; /* 角を少し丸くする場合 */
}

#app::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* #app の高さに合わせる */
  background-image: url('/app/reserve/src/assets/sagantosu.webp');
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.2; /* エンブレム画像の透明度を設定 */
  z-index: -1; /* 他のコンテンツの後ろに配置 */
  background-size: auto 100%; 
}

/* ヴィッセル神戸の場合の背景 */
#app.vissel::before {
  background-image: url('/app/reserve/src/assets/fe-vissel-kobe.webp');
}

/* サガン鳥栖の場合の背景 */
#app.tosu::before {
  background-image: url('/app/reserve/src/assets/sagantosu.webp');
}

.bingo-grid {
  display: grid;
  grid-template-columns: repeat(5, 60px);
  grid-gap: 10px;
  justify-content: center;
}

.bingo-cell {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  /* 背景画像をセルのサイズに合わせる */
  background-position: center;
  border: 2px solid #ccc;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  position: relative;
  transition: background-color 0.3s, transform 0.3s;
  color: white; /* 数字の色を白に設定 */
  text-shadow: 1px 1px 2px black; /* 数字の視認性を高めるための影 */
}

.bingo-cell:hover {
  background-color: rgba(0, 0, 0, 0.2); /* 画像の上にホバー効果を適用 */
  transform: scale(1.1);
  color: white;
  /* 数字の色を白に設定 */
  text-shadow: 1px 1px 2px black;
  /* 数字の視認性を高めるための影 */
}



.bingo-cell.selected {


  background-color: rgba(255, 204, 0, 0.6);
  /* 画像の上に選択時の背景色を適用 */
  border-color: #ff9900;
}

.cell-number {
  position: absolute;
  font-size: 24px;
  font-weight: bold;
  color: white;

  text-shadow: 2px 2px 4px black; /* 数字の視認性を高めるための影 */
}

.match-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
}

.team-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.score-input {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.score-input input {
  width: 50px;
  padding: 5px;
  font-size: 18px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 5px;
  text-shadow: 2px 2px 4px black;
  /* 数字の視認性を高めるための影 */
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 300px;
  animation: popup-show 0.3s ease-out;
}

.popup p {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.popup button {
  background-color: #ffcc00;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.popup button:hover {
  background-color: #ff9900;
}

.player-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
}

@keyframes popup-show {
  from {
    transform: scale(0.5);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

</style>
