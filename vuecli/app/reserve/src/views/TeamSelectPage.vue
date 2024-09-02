<template>
  <div>
    <h1>お気に入りのサッカーチームと選手を選んでください</h1>

    <!-- チーム選択 -->
    <div>
      <label for="team">サッカーチームを選ぶ:</label>
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
    <div v-if="players.length > 0">
      <label for="player">選手を選ぶ:</label>
      <div class="dropdown">
        <div class="selected-option" @click="togglePlayerDropdown">
          <img v-if="selectedPlayerObject" :src="selectedPlayerObject.image" :alt="selectedPlayer" class="player-image" />
          {{ selectedPlayer || '選手を選んでください' }}
        </div>
        <ul v-if="showPlayerDropdown" class="options-list">
          <li v-for="player in players" :key="player.name" @click="selectPlayer(player)">
            <img :src="player.image" :alt="player.name" class="player-image" />
            {{ player.name }} - {{ player.position }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 選択内容の表示 -->
    <div v-if="selectedTeam && selectedPlayer">
      <h2>選択内容</h2>
      <p>チーム: {{ selectedTeam }}</p>
      <p>選手: {{ selectedPlayer }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTeam: null,
      selectedPlayer: null,
      selectedTeamObject: null,
      selectedPlayerObject: null,
      showTeamDropdown: false,
      showPlayerDropdown: false,
      teams: [
        { 
          name: 'チームA', 
          emblem: require('@/assets/sagantosu.webp'), 
          players: [
            { name: '選手A1', image: require('@/assets/01_ARNAU-Riera-Rodriguez_EG-2.jpg'), position: 'フォワード' }
          ]
        },
        // 他のチームを追加
      ],
      players: []
    };
  },
  methods: {
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
    }
  }
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.selected-option {
  padding: 8px;
  border: 1px solid #ccc;
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

.team-emblem, .player-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
}
</style>
