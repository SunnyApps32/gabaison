<template>
  <div class="title-conatiner">
    <div class="upper" :class="teamClass">選手ギャラリー</div>
    <div class="lower" :class="teamClass"></div>
  </div>
  <div class="body-conatiner" :class="teamClass">
    <!-- チーム選択 -->
    <div class="select-container">
      <div class="select-box">
        <label>チームを選択</label>
        <select v-model="selectedTeam" @change="loadPlayers">
          <option value="">未選択</option>
          <option v-for="team in teams" :key="team.name" :value="team.name">{{ team.name }}</option>
        </select>
      </div>
    </div>

    <!-- ポジション選択 -->
    <div class="select-box" v-if="selectedTeam">
      <label>ポジションを選択</label>
      <select v-model="selectedPosition" @change="filterByPosition">
        <option value="">全てのポジション</option>
        <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
      </select>
    </div>


    <!-- 選手表示 -->
    <div class="images-container">
      <div v-if="players.length > 0" class="image-grid">
        <div v-for="(player, index) in displayedPlayers" :key="index" class="image-container" @click="openModal(player)">
          <img :src="player.image" :alt="player.name" />
          <p>{{ player.name }} - #{{ player.number }} - {{ player.position }}</p>
        </div>
      </div>
      <p v-else>選択されたチームの選手が表示されます。</p>

      <!-- ページネーション -->
      <div class="pagination" v-if="players.length > playersPerPage">
        <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1">前</button>
        <button @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage * playersPerPage >= players.length">次</button>
      </div>
    </div>

    <!-- モーダル表示 -->
    <div v-if="modalPlayer" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <img :src="modalPlayer.image" alt="Player" class="modal-image" />
        <p>{{ modalPlayer.name }} - #{{ modalPlayer.number }} - {{ modalPlayer.position }}</p>
      </div>
    </div>
  </div>
</template>

<script>

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const auth = getAuth();
const db = getFirestore();

export default {
  data() {
    return {
      uid: '', // FirebaseのユーザーIDを格納
      team: '', // チーム名を格納
      teams: [
        {
          name: 'サガン鳥栖',
          players: [
            { number: 1, name: 'アルナウ', image: require('@/assets/01_ARNAU-Riera-Rodriguez_EG-2.jpg'), position: 'GK' },
            { number: 2, name: '山﨑　浩介', image: require('@/assets/02_Kosuke-YAMAZAKI_EG-2.jpg'), position: 'DF' },
            { number: 3, name: '木村　誠二', image: require('@/assets/03_Seiji-KIMURA_EG-2.jpg'), position: 'DF' },
            { number: 4, name: '今津　佑太', image: require('@/assets/今津選手_l.jpg'), position: 'DF' },
            { number: 6, name: "福田 翔斗", image: require('@/assets/06_Akito-FUKUTA_EG-1.jpg'), position: 'MF' },
            { number: 8, name: "中原 輝", image: require('@/assets/08_Hikaru-NAKAHARA_EG-1.jpg'), position: 'MF' },
            { number: 10, name: "本田 風智", image: require('@/assets/10_Fuchi-HONDA_EG.jpg'), position: 'MF' },
            { number: 11, name: "ヴィニシウス アラウージョ", image: require('@/assets/11_Vinicius-Vasconcelos-Araujo_EG-2.jpg'), position: 'FW' },
            { number: 14, name: "藤田 直之", image: require('@/assets/14_Naoyuki-FUJITA_EG-3.jpg'), position: 'MF' },
            { number: 16, name: "上夷 克典", image: require('@/assets/16_Katsunori-UEEBISU_EG-3.jpg'), position: 'DF' },
            { number: 18, name: "日野 翔太", image: require('@/assets/18_Shota-HINO_EG-3.jpg'), position: 'MF' },
            { number: 19, name: "森谷 賢太郎", image: require('@/assets/19_Kentaro-MORIYA_EG-3.jpg'), position: 'MF' },
            { number: 20, name: "キム テヒョン", image: require('@/assets/20_KIM-Tae-Hyeon_EG-2.jpg'), position: 'DF' },
            { number: 21, name: "堀米 勇輝", image: require('@/assets/21_Yuki-HORIGOME_EG-3.jpg'), position: 'MF' },
            { number: 22, name: "富樫 敬真", image: require('@/assets/22_Cayman-TOGASHI_EG-3.jpg'), position: 'FW' },
            { number: 24, name: "久保　藤次郎", image: require('@/assets/24_久保_l.jpg'), position: 'MF' },
            { number: 25, name: "渡邉 緑平", image: require('@/assets/25_Ryohei-Watanabe_EG-3.jpg'), position: 'MF' },
            { number: 27, name: "椿原 慶樹", image: require('@/assets/27_Yoshiki-NARAHARA_EG-3.jpg'), position: 'MF' },
            { number: 28, name: "丸橋 祐介", image: require('@/assets/28_Yusuke-MARUHASHI_EG-3.jpg'), position: 'DF' },
            { number: 29, name: "井上　太聖", image: require('@/assets/29_Taisei-INOUE_EG-3.jpg'), position: 'DF' },
            { number: 31, name: "岡本 昌弘", image: require('@/assets/31_Masahiro-OKAMOTO_EG-3.jpg'), position: 'GK' },
            { number: 32, name: "堺屋 佳介", image: require('@/assets/32_Keisuke-SAKAIYA_EG-3.jpg'), position: 'FW' },
            { number: 33, name: "西矢　健人", image: require('@/assets/33_Kento-NISHIYA_EG.jpg'), position: 'MF' },
            { number: 36, name: "北島 郁哉", image: require('@/assets/36_Fumiya-KITAJIMA_EG-3.jpg'), position: 'DF' },
            { number: 37, name: "寺山　翼", image: require('@/assets/寺山選手_l.jpg'), position: 'MF' },
            { number: 42, name: "原田 昌", image: require('@/assets/42_Wataru-HARADA_EG-3.jpg'), position: 'DF' },
            { number: 46, name: "エジケ 唯吹ヴィンセントジュニア", image: require('@/assets/NO-IMAGE-3.jpg'), position: 'GK' },
            { number: 47, name: "鈴木　大馳", image: require('@/assets/47_Daichi-SUZUKI_EG-3.jpg'), position: 'FW' },
            { number: 51, name: "イ ユンスン", image: require('@/assets/51_LEE-Yoonsung_EG-3.jpg'), position: 'GK' },
            { number: 55, name: "清武　弘嗣", image: require('@/assets/55_Hiroshi-KIYOTAKE_EG.jpg'), position: 'MF' },
            { number: 70, name: "ジャジャ　シルバ", image: require('@/assets/JAJASILVA_EG.jpg'), position: 'MF' },
            { number: 71, name: "朴 一圭", image: require('@/assets/71_IlGyu-PARK_EG-3.jpg'), position: 'GK' },
            { number: 77, name: "ヴィキンタス　スリヴカ", image: require('@/assets/77_VYKINTAS-SLIVKA_EG-1.jpg'), position: 'MF' },
            { number: 99, name: "マルセロ ピアン", image: require('@/assets/99_MARCELO-RYAN-Silvestre-Dos-Santos_EG-3.jpg'), position: 'FW' }

          ],
        },
        {
          name: 'ヴィッセル神戸',
          emblem: require('@/assets/fe-vissel-kobe.webp'),
          players: [
            { number: 1, name: "前川　黛也", image: require('@/assets/koube/01.jpg'), position: 'GK' },
            { number: 2, name: "飯野　七聖", image: require('@/assets/koube/02.jpg'), position: 'MF' },
            { number: 3, name: "マテウス トゥーレル", image: require('@/assets/koube/03.jpg'), position: 'DF' },
            { number: 4, name: "山川　哲史", image: require('@/assets/koube/04.jpg'), position: 'DF' },
            { number: 6, name: "扇原　貴宏", image: require('@/assets/koube/06.jpg'), position: 'MF' },
            { number: 7, name: "井手口　陽介", image: require('@/assets/koube/07.jpg'), position: 'MF' },
            { number: 9, name: "宮代　大聖", image: require('@/assets/koube/09.jpg'), position: 'FW' },
            { number: 10, name: "大迫　勇也", image: require('@/assets/koube/10.jpg'), position: 'FW' },
            { number: 11, name: "武藤　嘉紀", image: require('@/assets/koube/11.jpg'), position: 'FW' },
            { number: 14, name: "汰木　康也", image: require('@/assets/koube/14.jpg'), position: 'MF' },
            { number: 15, name: "本多　勇喜", image: require('@/assets/koube/15.jpg'), position: 'DF' },
            { number: 16, name: "齊藤　未月", image: require('@/assets/koube/16.jpg'), position: 'MF' },
            { number: 18, name: "井出　遥也", image: require('@/assets/koube/18.jpg'), position: 'MF' },
            { number: 19, name: "初瀬　亮", image: require('@/assets/koube/19.jpg'), position: 'DF' },
            { number: 21, name: "新井　章太", image: require('@/assets/koube/21.jpg'), position: 'GK' },
            { number: 22, name: "佐々木　大樹", image: require('@/assets/koube/22.jpg'), position: 'MF' },
            { number: 23, name: "広瀬　陸斗", image: require('@/assets/koube/23.jpg'), position: 'DF' },
            { number: 24, name: "酒井　高徳", image: require('@/assets/koube/24.jpg'), position: 'DF' },
            { number: 25, name: "鍬先　祐弥", image: require('@/assets/koube/25.jpg'), position: 'MF' },
            { number: 26, name: "ジェアン パトリッキ", image: require('@/assets/koube/26.jpg'), position: 'FW' },
            { number: 30, name: "山内　翔", image: require('@/assets/koube/30.jpg'), position: 'MF' },
            { number: 31, name: "中坂　勇哉", image: require('@/assets/koube/31.jpg'), position: 'MF' },
            { number: 35, name: "冨永　虹七", image: require('@/assets/koube/35.jpg'), position: 'FW' },
            { number: 39, name: "髙山　汐生", image: require('@/assets/koube/39.jpg'), position: 'GK' },
            { number: 44, name: "日髙　光揮", image: require('@/assets/koube/44.jpg'), position: 'MF' },
            { number: 50, name: "オビ パウエル オビンナ", image: require('@/assets/koube/50.jpg'), position: 'GK' },
            { number: 55, name: "岩波　拓也", image: require('@/assets/koube/55.jpg'), position: 'GK' },
            { number: 81, name: "菊池　流帆", image: require('@/assets/koube/81.jpg'), position: 'DF' },
            { number: 88, name: "森岡　亮太", image: require('@/assets/koube/88.jpg'), position: 'MF' },
            { number: 96, name: "山口　蛍", image: require('@/assets/koube/96.jpg'), position: 'MF' }

          ],

        },
        // 他のチームを追加
      ],
      selectedTeam: '',
      selectedPosition: '',
      players: [],
      filteredPlayers: [],
      displayedPlayers: [],
      currentPage: 1,
      playersPerPage: 6, // 1ページあたり10人表示（5×2）
      modalPlayer: null,
    };
  },
  computed: {
    positions() {
      const allPositions = this.players.map(player => player.position);
      return [...new Set(allPositions)]; // 重複を除いたポジションリストを返す
    },
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
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;

        console.log(this.uid);
        this.getUserData()
      } else {
        console.log('User is not logged in.');
      }
    });
  },

  methods: {
    async getUserData() {
      try {
        const querySnapshot = await getDoc(doc(db, 'user', this.uid));
        this.userData = querySnapshot.data()
        this.team = this.userData["team"]
        console.log(this.userData)
      } catch (error) {

        console.error('Error: ', error);
      }
    },
    loadPlayers() {
      const team = this.teams.find(t => t.name === this.selectedTeam);
      if (team) {
        this.players = team.players;
        this.selectedPosition = ''; // ポジション選択をリセット
        this.currentPage = 1;
        this.filterByPosition();
      } else {
        this.players = [];
        this.filteredPlayers = [];
        this.displayedPlayers = [];
      }
    },
    filterByPosition() {
      if (this.selectedPosition) {
        this.filteredPlayers = this.players.filter(player => player.position === this.selectedPosition);
      } else {
        this.filteredPlayers = this.players;
      }
      this.updateDisplayedPlayers();
    },
    updateDisplayedPlayers() {
      const startIndex = (this.currentPage - 1) * this.playersPerPage;
      const endIndex = startIndex + this.playersPerPage;
      this.displayedPlayers = this.filteredPlayers.slice(startIndex, endIndex);
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.updateDisplayedPlayers();
    },
    openModal(player) {
      this.modalPlayer = player;
    },
    closeModal() {
      this.modalPlayer = null;
    }
  }
};
</script>

<style scoped>
.title-conatiner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upper {
  width: 100%;

  /*サガン鳥栖*/

  /*ヴィッセル神戸*/
  /* background-color: #FFFFFF; */
  /* color: #A40931; */

  text-align: center;
  font-size: 24px;
  padding: 10px 0;
}

.upper.vissel {
  background-color: #FFFFFF;
  color: #A40931;
}

.upper.tosu {
  background-color: #00A0D2;
  color: white;
}

.lower {
  width: 100%;
  height: 20px;

  /*サガン鳥栖*/

  /*ヴィッセル神戸*/
  /* background-color: #000000; */
}

.lower.vissel {
  background-color: #000000;
}


.lower.tosu {
  background-color: #EC80B4;
} 

.body-conatiner {
  width: 100%;
  height: 1000px;
  flex-grow: 1;

  /*サガン鳥栖*/
  
  /*ヴィッセル神戸*/
  /* background-color: #D9D9D9; */
}

.body-conatiner.vissel {
  background-color: #D9D9D9;
}

.body-conatiner.tosu {
  background-color: #CAE3EC;
}


.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.select-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.select-box {
  flex: 1;
  margin: 0 10px;
  padding: 10px;
}

.select-box label {
  display: block;
  margin-bottom: 5px;
}

.select-box select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.images-container {
  margin-top: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 横に5列 */
  grid-auto-rows: 1fr;
  /* 行の高さを固定 */
  gap: 10px;
  /* 画像間のスペースを設定 */
  padding: 10px;
  place-content: center;
  place-items: center;
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  height: 150px;
}

.image-container img {
  width: 100%;
  height: 100px;
  object-fit: contain;
  border-radius: 5px;
  cursor: pointer;
}

.image-container p {
  word-wrap: break-word;
  text-align: center;
  margin: 5px 0 0;
  font-size: 12px;
  width: 100%;
  max-width: 100%;
}

.pagination {
  margin-top: 10px;
  /* ボタンをもう少し上に */
}

.pagination button {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* モーダルのスタイル */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close {
  color: #aaa;
  align-self: flex-end;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.modal-image {
  max-width: 100%;
  margin: 10px 0;
}
</style>