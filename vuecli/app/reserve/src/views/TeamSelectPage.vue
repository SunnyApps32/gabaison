<template>
  <div class="title-conatiner">
    <div class="upper" :class="teamClass">応援チーム･推し選手 登録
    </div>
    <div class="lower" :class="teamClass"></div>
  </div>
  <div class="body-conatiner">
    <div class="ask">
      <b>あなたの応援チームと推し選手を選んでください</b>
    </div>

    <!-- チーム選択 -->
    <div class="select-container">
      <span>応援チーム</span>
      <div class="dropdown">
        <div class="selected-option" @click="toggleTeamDropdown">
          <img v-if="selectedTeamObject" :src="selectedTeamObject.emblem" :alt="selectedTeam" class="team-emblem" />
          {{ selectedTeam || 'チームを選んでください' }}
        </div>
        <ul v-if="showTeamDropdown" class="options-list">
          <li v-for="team in teams" :key="team.name" @click="selectTeam(team)">
            <img :src="team.emblem" :alt="team.name" class="team-emblem" />
            {{ team.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 選手選択 -->
    <div v-if="players.length > 0" class="select-container">
      <label for="player">推し選手</label>
      <div class="dropdown">
        <div class="selected-option" @click="togglePlayerDropdown">
          <img v-if="selectedPlayerObject" :src="selectedPlayerObject.image" :alt="selectedPlayer"
            class="player-image" />
          {{ selectedPlayer || '選手を選んでください' }}
        </div>
        <ul v-if="showPlayerDropdown" class="options-list">
          <li v-for="player in players" :key="player.name" @click="selectPlayer(player)">
            <img :src="player.image" :alt="player.name" class="player-image" />
            {{ player.name }} - {{ player.position }} - #{{ player.number }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 選択内容の表示 -->
    <div v-if="selectedTeam && selectedPlayer">
      <h2>選択内容</h2>
      <p>応援チーム: {{ selectedTeam }}</p>
      <p>推し選手: {{ selectedPlayer }}</p>
      <p>背番号: {{ selectedPlayerObject.number }}</p>

      <!-- 決定ボタン -->
      <button @click="confirmSelection" class="confirm-button">決定</button>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const auth = getAuth();
const db = getFirestore();

export default {
  data() {
    return {
      selectedTeam: null,
      selectedPlayer: null,
      selectedTeamObject: null,
      selectedPlayerObject: null,
      showTeamDropdown: false,
      showPlayerDropdown: false,
      uid: '', // FirebaseのユーザーIDを格納
      team: '', // チーム名を格納
      teams: [
        {
          name: 'サガン鳥栖',
          emblem: require('@/assets/sagantosu.webp'),
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
      players: []
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        this.loadSelection();
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
    async loadSelection() {
      const userDocRef = doc(db, 'user', this.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        this.selectedTeam = data.team;
        const selectedNumber = data.number;

        // チームの選択状態を復元
        const team = this.teams.find(t => t.name === this.selectedTeam);
        if (team) {
          this.selectTeam(team);

          // 選手の選択状態を復元
          const player = team.players.find(p => p.number === selectedNumber);
          if (player) {
            this.selectPlayer(player);
          }
        }
      } else {
        console.log('No previous selection found.');
      }
    },
    toggleTeamDropdown() {
      this.showTeamDropdown = !this.showTeamDropdown;
    },
    selectTeam(team) {
      this.selectedTeam = team.name;
      this.selectedTeamObject = team;
      this.players = team.players;
      this.selectedPlayer = null;
      this.selectedPlayerObject = null;
      this.showTeamDropdown = false;
    },
    togglePlayerDropdown() {
      this.showPlayerDropdown = !this.showPlayerDropdown;
    },
    selectPlayer(player) {
      this.selectedPlayer = player.name;
      this.selectedPlayerObject = player;
      this.showPlayerDropdown = false;
    },
    async confirmSelection() {
      if (!this.uid) {
        console.log('User is not logged in.');
        return;
      }

      const userDocRef = doc(db, 'user', this.uid);

      try {
        await setDoc(userDocRef, {
          team: this.selectedTeam,

          number: this.selectedPlayerObject.number
        }, { merge: true });

        console.log('Selection saved successfully.');
        alert('選択が保存されました！');
      } catch (error) {
        console.error('Error saving selection: ', error);
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
}
};
</script>

<style scoped>
.title-conatiner {
  width: 100%;
  display: flex;
  flex-direction: column;
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


.ask {
  padding: 10px 0;
}

.select-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.selected-option {
  padding: 8px;
  margin: 10px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.options-list {
  position: absolute;
  z-index: 1;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.options-list li {
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.options-list li:hover {
  background-color: #eee;
}

.team-emblem,
.player-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
}

.confirm-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1e90ff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.confirm-button:hover {
  background-color: #1c7ed6;
}
</style>
