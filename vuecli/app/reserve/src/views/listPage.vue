<template>
  <div class="container">
    <div class="div-2">
      <img loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/93df00fc34138266fdb4a1b858262d23dc5dc1d3f04b1fffdd1ac7810d8282ec?"
        class="img" @click="goToHomePage" />
      <div class="div-3">予約一覧
      </div>
      <button class="button-2" @click="update">更新</button>
      <button class="button-2"  @click="exportToCSV">出力</button>
    </div>

    <main class="main">
      <div class="tabs">
        <button v-for="date in dates" :key="date" @click="selectedDate = date" :class="{ active: selectedDate === date }">
          {{ date }}
        </button>
      </div>
      <div class="filters">
        <input v-model="searchName" placeholder="名前で検索" />
        <input v-model="searchFurigana" placeholder="フリガナで検索" />
        <input v-model="searchTel" placeholder="電話番号で検索" />
        <select v-model="searchStatus">
          <option value="">ステータスで検索</option>
          <option value="0">未チェックイン</option>
          <option value="1">チェックイン中</option>
          <option value="2">チェックアウト済</option>
        </select>
        <select v-model="searchTime">
          <option value="">時間で検索</option>
          <option value="9:30~11:20">9:30~11:20</option>
          <option value="12:00~13:50">12:00~13:50</option>
          <option value="15:00~16:50">15:00~16:50</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th>フリガナ</th>
            <th>電話番号</th>
            <th>人数</th>
            <th>ステータス</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in filteredReservations" :key="reservation.id"
            @click="goToCheckInOutPage(reservation.id)" class="clickable-row">
            <td>{{ reservation.name }}</td>
            <td>{{ reservation.furigana }}</td>
            <td>{{ reservation.tel }}</td>
            <td>{{ reservation.customer_num }}</td>
            <td :class="reservationStatusClass(reservation.checkIn)">
              {{ reservationStatus(reservation.checkIn) }}
            </td>

          </tr>
        </tbody>
      </table>
    </main>
  </div>
  <transition-group name="fade" mode="out-in">
    <div v-show="isLoading" class="loader" key="loader">
      <div id="loading">
        <div class="loading">
          <div class="obj"></div>
          <div class="obj"></div>
          <div class="obj"></div>
          <div class="obj"></div>
          <div class="obj"></div>
          <div class="obj"></div>
          <div class="obj"></div>
          <div class="obj"></div>
        </div>
      </div>
    </div>

  </transition-group>
</template>
  
<script>
export default {
  data() {
    return {
      dates: ['8/1(木)', '8/2(金)', '8/3(土)', '8/4(日)', '8/5(月)'],
      reservations: [],
      selectedDate: '8/1(木)',
      searchFurigana: '',
      searchName: '',
      searchTel: '',
      searchStatus: '',
      searchTime: '',
      isLoading: false,
    };
  },
  computed: {

    filteredReservations() {
      return this.reservations
        .filter(reservation => reservation.date === this.selectedDate)
        .filter(reservation => reservation.furigana.includes(this.searchFurigana))
        .filter(reservation => reservation.name.includes(this.searchName))
        .filter(reservation => reservation.tel.includes(this.searchTel))
        .filter(reservation => reservation.checkIn.includes(this.searchStatus))
        .filter(reservation => reservation.time.includes(this.searchTime))
    }
  },
  async created() {

    this.update();
  },
  methods: {
    exportToCSV() {
  let csvContent = "\uFEFF"; // Add BOM
  csvContent += "Date,Time,Name,Furigana,Tel,Email,HomeTown,Id,ReserveTime,Children,Fee\n";

  for (const reservation of this.reservations) {
    csvContent += `${reservation.date},${reservation.time},${reservation.name},${reservation.furigana},${reservation.tel},${reservation.email},${reservation.hometown},${reservation.id},${reservation.time_stamp},${reservation.customer_num},${reservation.fee}\n`;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "reservations.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
},
    goToCheckInOutPage(reservationId) {
      this.$router.push({ name: 'checkInOutPage', params: { reserveId: reservationId } });
    },
    async update() {
      try {

        this.reservations = []
        this.isLoading = true;
        const response = await fetch('', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Pragma': 'no-cache'
          },
        });


        const data = await response.json();


        if (data.status === 'success') {
          this.reservations = data.reservations;
          this.reservations = this.reservations.filter(reservation => reservation.name !== '')

          if (this.dates.length > 0) {
            this.selectedDate = this.dates[0];
          }
        } else {
          console.error('エラーが発生しました: ', data.message);
        }
      } catch (error) {
        console.error('エラーが発生しました: ', error);
      }
      this.isLoading = false
    },
    goToHomePage() {
      this.$router.push({ name: "Home" });
    },
    reservationStatus(status) {
      switch (status) {
        case '0':
          return '未チェックイン';
        case '1':
          return 'チェックイン済';
        case '2':
          return 'チェックアウト済';
        default:
          return '';
      }
    },
    reservationStatusClass(status) {
      switch (status) {
        case '0':
          return 'status-not-checked-in';
        case '1':
          return 'status-checked-in';
        case '2':
          return 'status-checked-out';
        default:
          return '';
      }
    }
  },

};
</script>
  
<style scoped>
.container {
  background-color: #ebfffe;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #000;
  font-weight: 700;
  margin: 0 auto;
}

.header {
  background-color: #2c4e61;
  width: 100%;
  text-align: center;
  padding: 20px 0;
  font-weight: bold;
  font-size: 20px;
  color: #fff;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  width: 100%;
}

.div-2 {
  background-color: #2c4e61;
  display: flex;
  width: 100%;
  align-items: start;
  gap: 20px;

  color: #ebfffe;
  white-space: nowrap;
  text-align: center;
  letter-spacing: -0.38px;
  display: flex;
  justify-content: center;
  /* 子要素を中央揃え */
  position: relative;
  padding: 30px 0 10px;
  font-weight: bold;
  font-size: 20px;

}

.img {
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 54px;
  position: absolute;
  left: 0;
}

.div-3 {
  font-family: M PLUS Code Latin, sans-serif;
  margin: 18px;
  flex-grow: 1;
  flex-basis: auto;
  margin-left: 80px;
}


.button-1 {
  object-fit: auto;
  object-position: center;
  width: 100px;
  align-self: end;
  height: 50px;
  margin-left: 20px;
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 54px;
  position: absolute;
  right: 0;
}

.button-2{
  background-color: #43b1f1;
  color: #ebfffe;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #ccc;
  cursor: pointer;
}

.tabs button.active {
  background-color: #2c4e61;
  color: #fff;
}

.filters {
  margin-bottom: 20px;
}

.filters input {
  margin-right: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #2c4e61;
  color: #fff;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.status-not-checked-in {
  color: red;
}

.status-checked-in {
  color: green;
}

.status-checked-out {
  color: blue;
}


/* ローディング画面 */
.loader {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1080;
}

#loading {
  width: 100vw;
  height: 100vh;
  transition: all 1s;
  background: rgba(0, 0, 0, 1.0);
  position: absolute;
  left: 0;
  top: 0;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 40px;
  display: flex;
  align-items: center;
}

.obj {
  width: 5px;
  height: 40px;
  background: white;
  margin: 0 3px;
  border-radius: 10px;
  animation: loading 0.8s infinite;
}

.obj:nth-child(2) {
  animation-delay: 0.1s;
}

.obj:nth-child(3) {
  animation-delay: 0.2s;
}

.obj:nth-child(4) {
  animation-delay: 0.3s;
}

.obj:nth-child(5) {
  animation-delay: 0.4s;
}

.obj:nth-child(6) {
  animation-delay: 0.5s;
}

.obj:nth-child(7) {
  animation-delay: 0.6s;
}

.obj:nth-child(8) {
  animation-delay: 0.7s;
}

@keyframes loading {
  0% {
    height: 0;
  }

  50% {
    height: 40px;
  }

  100% {
    height: 0;
  }
}</style>
  