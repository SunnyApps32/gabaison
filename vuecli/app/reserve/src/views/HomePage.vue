<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <div class="title-conatiner">
    <div class="upper" :class="teamClass">ホーム</div>
    <div class="lower"></div>
  </div>
 
  <div class="body-conatiner">
    <div id="app" :class="teamClass">
      <h1>ビンゴゲーム</h1>
      <div class="bingo-grid">
        <div v-for="(cell, index) in bingoCells" :key="index" :class="['bingo-cell']" @click="selectNumber(index, cell)"
          :style="{ backgroundImage: `url(${getImageForType(cell.type, cell.marked)})` }">
          <span class="cell-number">
            <div v-if=!cell.marked>{{ cell.number }}</div>
          </span>
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
 
    <button @click="savePrediction" class="save-prediction-btn">予想を保存</button> <!-- ここにボタンを追加 -->
 
    <div v-if="showPopup" class="popup-overlay" @click="closePopup">
      <div class="popup">
        <!-- type 1: プレイヤー情報 -->
        <div v-if="selectedNumber.type === 1">
          <h3>{{ selectedNumber.name }}</h3>
          <p>背番号: {{ selectedNumber.number }}</p>
          <p>ポジション: {{ selectedNumber.position }}</p>
          <img :src="selectedNumber.image" :alt="selectedNumber.name" class="player-image" />
        </div>
 
        <!-- type 2: 試合結果 -->
        <div v-else-if="selectedNumber.type === 2">
          <h3>試合結果予想</h3>
          <p>予想スコア: {{ selectedNumber.number }}</p>
        </div>
 
        <!-- type 3: 観光地情報 (佐賀城) -->
        <div v-else-if="selectedNumber.type === 3">
          <h3>佐賀城</h3>
          <p>佐賀城は佐賀県佐賀市にある歴史的な城です。</p>
          <img src='@/assets/sagajou.jpg' alt="佐賀城" class="location-image" />
        </div>
 
        <!-- type 4: 観光地情報 (御船山) -->
        <div v-else-if="selectedNumber.type === 4">
          <h3>御船山</h3>
          <p>御船山は美しい自然景観で知られる佐賀県の名所です。</p>
          <img src='@/assets/mifuneyama.jpg' alt="御船山" class="location-image" />
        </div>
 
        <!-- type 5: 観光地情報 (波戸岬) -->
        <div v-else-if="selectedNumber.type === 5">
          <h3>波戸岬</h3>
          <p>波戸岬は海の美しさで有名な佐賀県の観光スポットです。</p>
          <img src='@/assets/hadomisaki.jpg' alt="波戸岬" class="location-image" />
        </div>
 
        <!-- type 6: 観光地情報 (鳥栖駅) -->
        <div v-else-if="selectedNumber.type === 6">
          <h3>鳥栖駅</h3>
          <p>鳥栖駅は交通の要所として知られる駅です。</p>
          <img src='@/assets/tosuStation.jpg' alt="鳥栖駅" class="location-image" />
        </div>
 
        <button @click="closePopup">OK</button>
      </div>
    </div>
<div class="qr-container">
    <img loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/a735cab541df0a2ebb0694177468ec5832da1c6e573c68524985aa4fcd7d7fdf?"
      class="QRbutton" @click="goToQrpage" />
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
    saveBingoCells() {
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
        marked: false
      }));
 
 
      bingoCells.splice(6, 0, { number: ``, name: '佐賀城', type: 3, marked: false });
      bingoCells.splice(16, 0, { number: ``, name: '御船山', type: 4, marked: false });
      bingoCells.splice(20, 0, { number: ``, name: '波戸岬', type: 5, marked: false });
      bingoCells.splice(23, 0, { number: ``, name: '鳥栖駅', type: 6, marked: false });
 
      bingoCells.splice(0, 0, { number: `${this.teamAScore}-${this.teamBScore}`, name: 'Free', type: 2, marked: false });
      bingoCells.splice(4, 0, { number: `${this.teamAScore}`, name: 'Free', type: 2, marked: false });
      bingoCells.splice(21, 0, { number: `${this.teamBScore}`, name: 'Free', type: 2, marked: false });
      bingoCells.splice(24, 0, { number: `Win`, name: 'Free', type: 2, marked: false });
 
 
      // 中央のセルにデータベースから取得したnumberを設定
      const centerIndex = 12; // ビンゴの中央のセルのインデックス
      bingoCells.splice(centerIndex, 0, { number: this.number, name: 'Central', type: 1, marked: false });
 
 
 
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
    getImageForType(type, marked) {
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
          this.bingoCells.splice(1, 1, { number: `${this.teamAScore}-${this.teamBScore}`, name: 'Free', type: 2, marked: false });
          this.bingoCells.splice(4, 1, { number: `${this.teamAScore}`, name: 'Free', type: 2, marked: false });
          this.bingoCells.splice(22, 1, { number: `${this.teamBScore}`, name: 'Free', type: 2, marked: false });
          console.log(this.bingoCells)
          await this.saveBingoCells();
        } else {
          this.bingoCells = await this.generateBingoCells();
          this.bingoCells.splice(0, 1, { number: `${this.teamAScore}-${this.teamBScore}`, name: 'Free', type: 2, marked: false });
          this.bingoCells.splice(4, 1, { number: `${this.teamAScore}`, name: 'Free', type: 2, marked: false });
          this.bingoCells.splice(22, 1, { number: `${this.teamBScore}`, name: 'Free', type: 2, marked: false });
          await this.saveBingoCells();
        }
      } catch (error) {
        console.error("Error saving prediction: ", error);
        alert("予想点数の保存に失敗しました。");
      }
    },
    goToQrpage() {
      this.$router.push("/qrcode");
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
html {
  padding: 0;
}
 
 
.img {
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 213px;
  height: 213px;
  margin-top: 30px;
  max-width: 100%;
  border-radius: 5px;
}
 
.title-conatiner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
 
.upper {
  width: 100%;
  /*サガン鳥栖*/
  background-color: #00A0D2;
  color: white;
 
 
  text-align: center;
  font-size: 24px;
  padding: 10px 0;
}
 
.upper.vissel {
  background-color: #FFFFFF;
  color: #A40931;
}
 
.lower {
  width: 100%;
  height: 20px;
 
  /*サガン鳥栖*/
  background-color: #EC80B4;
  /*ヴィッセル神戸*/
  /* background-color: #000000; */
}
 
.body-conatiner {
  width: 100%;
  height: 1000px;
  flex-grow: 1;
  /*サガン鳥栖*/
  margin: 0;
  padding-top: 60px;
  /*ヴィッセル神戸*/
  /* background-color: #D9D9D9; */
}
 
.qr-container{
  position: absolute;
  right:10px;
}
.QRbutton {
  height: 100px;
  width: 100px;
  /* position: absolute;
  bottom: 100px;
  right: 10px; */
  border-radius: 50%;
  z-index: 10;
}
 
 
#app {
  width: 370px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  position: relative;
  /* 子要素の配置基準とする */
  border: 2px solid rgb(90, 90, 90);
  /* 黒い線で囲む */
  padding: 20px;
  /* 内側の余白を追加 */
  border-radius: 5px;
  /* 角を少し丸くする場合 */
}
 
#app::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  /* #app の高さに合わせる */
  background-image: url('@/assets/sagantosu.jpg');
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.2;
  /* エンブレム画像の透明度を設定 */
  z-index: -1;
  /* 他のコンテンツの後ろに配置 */
  background-size: auto 100%;
}
 
/* ヴィッセル神戸の場合の背景 */
#app.vissel::before {
  background-image: url('@/assets/fe-vissel-kobe.jpg');
}
 
/* サガン鳥栖の場合の背景 */
#app.tosu::before {
  width: 95%;
  background-image: url('@/assets/sagantosu.jpg');
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
  color: white;
  /* 数字の色を白に設定 */
  text-shadow: 1px 1px 2px black;
  /* 数字の視認性を高めるための影 */
}
 
.bingo-cell:hover {
  background-color: rgba(0, 0, 0, 0.2);
  /* 画像の上にホバー効果を適用 */
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
 
  text-shadow: 2px 2px 4px black;
  /* 数字の視認性を高めるための影 */
}
 
.match-info {
  width: 100%;
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
  width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
  object-fit: cover;
}
 
.location-image {
  width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
  object-fit: cover;
}
 
.save-prediction-btn {
  background-color: #007bff;
  /* 青色の背景 */
  color: #fff;
  /* 白い文字 */
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
 
.save-prediction-btn:hover {
  background-color: #0056b3;
  /* ホバー時に少し濃い青色に変更 */
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