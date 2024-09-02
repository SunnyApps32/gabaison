<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <div class="container">
    <header class="header">
      <h4>ウォーターパークからつ<br>予約サイト</h4>
    </header>

    <img :src="require(`../assets/tirashi.jpg`)" />

    <div v-if="isBeforeJuly20At10" class="infomation">
          7月20日10時から予約可能です
    </div>
    <div v-else>
    <main class="main">
      <section class="children-count">
        <div class="label">お子様の人数</div>
        <div class="attention" v-if="!selectedTime">人数を選択してください</div>
        <select v-model="childrenCount" class="selector">
          <option value="1" class="select-chiled-num">1人</option>
          <option value="2" class="select-chiled-num">2人</option>
          <option value="3" class="select-chiled-num">3人</option>
        </select>


        <div class="note">
          ※保護者１名につき、お子様3名まで入場可能<br>
          ※お子様１名様当たり入場料300円
        </div>
      </section>
      <hr class="divider">
      <section  class="availability">
        <div class="label">施設の空き状況</div>
        <div class="attention" v-if="!selectedDate">日付を選択してください</div>
        <div class="dates">
          <button v-for="(times, date) in reservations" :key="date" class="date" :class="{ selected: selectedDate === date }" @click="selectDate(date)">
            <div class="date-info">
              <span class="date-number">{{ formatDate(date).split(' ')[0] }}</span><br>
              <span class="day">({{ formatDate(date).split(' ')[1] }})</span>
            </div>
            <div class="separator"></div>
            <div class="remaining">残 <br> {{ maxReservation*3 - remainingSeats(date) }}</div>
          </button>
        </div>
      </section>
      <hr class="divider">
      <section v-if="selectedDate" class="time-selection">


        <div class="label">時間指定</div>
        <div class="attention" v-if="!selectedTime && selectedDate">時間を選択してください</div>

  
        <div v-for="(count, time) in reservations[selectedDate]" :key="time">
          <button class="time" :class="{ selected: selectedTime === time , disabled: isDisabled(count)}" @click="selectTime(time)" :disabled="isDisabled(count)">
            <div class="timeLabel"></div> {{ time }} <br> <div class="count">残{{ extraCount(count) }}</div>
          </button>
        </div>


      </section>
      <button class="next-button" @click="goToFormPage">
        <div class="button-text">次へ</div>
        <img loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/85a4ea9eccff0bec15ba05e7cc9172489a4d73653f5d894c94c6e6c502440469?"
          class="button-icon" />
      </button>
    </main>
  </div>

    <footer class="footer">
      supported by <a href="https://sunapp.jp" class="sunapp">sunapp</a> LLC.
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: null,
      selectedTime: null,
      childrenCount: null, // Default to 1 child
      event_id: 'Uxn6sTM3Tw',
      reservations: {},
      maxReservation: 0,
      today: new Date()
    };
  },
  mounted() {


  },
  async created(){
    try {
      const response = await fetch("https://sunapp.jp/sunappForReserve/api/getReserveCount.php");
      const data = await response.json();
      if (data.status === "success") {
        console.log(data.data)
        this.reservations = data.data;
      } else {
        console.error("エラーが発生しました: ", data.message);
      }
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }

    try {
      const response2 = await fetch("https://sunapp.jp/sunappForReserve/api/getMaxReservation.php");
      const data2 = await response2.json();
      if (data2.status === "success") {
        
       this.maxReservation = parseInt(data2.max_reservation, 10);
        console.log(this.maxReservation)
      } else {
        console.error("エラーが発生しました: ", data2.message);
      }
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }

  },
  computed: {
    isBeforeJuly20At10() {
      const july20At10 = new Date(this.today.getFullYear(), 6, 20, 10); // 7月20日10時
      console.log(july20At10)
      return this.today < july20At10;
    }
  },

  watch: {
    childrenCount(newCount, oldCount) {
      if (newCount !== oldCount) {
      
        this.selectedTime = null; // Reset the selected time as well
      }
    },
    selectedDate(newCount, oldCount) {
      if (newCount !== oldCount) {
        this.selectedTime = null; // Reset the selected time as well
      }
    }
  },
  methods: {
    selectDate(date) {
      console.log("Selected date:", date);
      this.selectedDate = date;
    },
    selectTime(time) {
      console.log("Selected time:", time);
      this.selectedTime = time;
    },
    goToFormPage() {
      if (this.selectedDate && this.selectedTime && this.childrenCount) {
        // Construct the route with parameters
        const routeParams = {
          name: 'formPage',
          params: {
            selectedDate: this.selectedDate,
            selectedTime: this.selectedTime,
            childrenCount: this.childrenCount,
          }
        };

        // Push the route with parameters
        this.$router.push(routeParams);
      } else {
        alert('日にちと時間、お子様の人数を選択してください。');
      }
    },
    remainingSeats(date) {
      if (this.reservations[date]) {
        return Object.values(this.reservations[date]).reduce((sum, count) => sum + count, 0);
      }
      return 0;
    },
    formatDate(date) {
      const [d, w] = date.split('(');
      const day = w.slice(0, w.length - 1); // Remove the trailing ')' from the weekday
      return `${d} ${day}`;
    },
    extraCount(count){
      if (this.maxReservation -  parseInt(count , 10) > 0){
        return this.maxReservation -  parseInt(count , 10)
      }else{
        return 0
      }
      //return this.maxReservation -  parseInt(count , 10)
    },
    isDisabled(count) {
      return this.childrenCount > this.extraCount(count);
    }
  }
}
</script>


<style scoped>

.container {
  background-color: #ebfffe;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-weight: 700;
  margin: 0 auto;
}

.header {
  background-color: #2c4e61;
  width: 100%;
  text-align: center;
  padding: 10px 0;
  font-weight: bold;
  font-size: 20px;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  margin-top: 30px;
  width: 100%;
}



.children-count,
.availability,
.time-selection {
  text-align: center;
}

.count {
  font-size: 12px;
}


.time.disabled{
  background-color: gray;
}

.select-chiled-num {
  text-align: center;
  font-size: large;
}

.label {
  font-size: 18px;
  font-weight: bold;
}

.selector {
  display: flex;
  justify-content: flex-end;
  border-radius: 5px;
  border: 1px solid #000;
  background-color: #fff;
  margin-top: 10px;
  gap: 25px;
  padding: 10px 31px;
  width: 300px;
}

.text {
  font-family: 'M PLUS Code Latin', sans-serif;
}

.icon {
  width: 16px;
  aspect-ratio: 1;
}


.sunapp {
  color: #ebfffe;
}

.note {
  color: #b40000;
  margin-top: 20px;
  font: 13px Inter, sans-serif;
  font-weight: bold;
}

.divider {
  border: 0.1px solid rgba(138, 138, 138, 1);
  width: 95%;
  margin: 40px auto 0;
}

.dates {
  display: flex;
  gap: 4px;
  margin-top: 20px;
  color: #fff;
}

.date {
  
  flex-direction: column;
  flex: 1;
  padding: 5px 12px;
  background-color: rgba(44, 78, 97, 1);
  text-align: center;
  cursor: pointer;
  border: none;
  color: #fff;
}

.date.selected {
  background-color: #84c3ff;
  /* 選択されたときの色 */
  color: #000;
}



.date-info {
  font: 15px/23px 'M PLUS Code Latin', sans-serif;
  font-weight: bold;
  text-align: center;
}

.date-number {
  font-size: 16px;
  text-align: center;
}

.day {
  font-size: 10px;
  font-weight: 600;
}

.separator {
  border: 1px solid #fff;
  background-color: #fff;
  margin: 2px 0;
  height: 0.1px;
  width: 100%;
}

.remaining {
  margin-top: 9px;
  font: 14px/150% 'M PLUS Code Latin', sans-serif;
  font-weight: bold;
}

.time-selection {
  margin-top: 30px;
}

.time {
  background-color: #2c4e61;
  color: #ebfffe;
  margin-top: 20px;
  padding: 10px 24px;
  border-radius: 1.6px;
  font: 16px/150% 'M PLUS Code Latin', sans-serif;
  letter-spacing: 2px;
  width: 200px;
}

.time.selected {
  background-color: #84c3ff;
  /* 選択されたときの色 */
  color: #000;
}

.next-button {
  background-color: #2c4e61;
  color: #ebfffe;
  margin-top: 60px;
  padding: 10px 17px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 16px;
  letter-spacing: 1.6px;
  cursor: pointer;
}

.button-text {
  font-family: 'M PLUS Code Latin', sans-serif;
}

.button-icon {
  width: 13px;
  aspect-ratio: 0.81;
}

.footer {
  background-color: #2c4e61;
  text-align: center;
  padding: 19px 0;
  margin-top: 30px;
  font: 14px/150% 'M PLUS Code Latin', sans-serif;
  font-weight: bold;
}

.attention{
  color: #006414;
  font-size: 9px;
  font-weight: lighter ;
}

.infomation {
  margin-top: 20px;
  color: #000;
  font-size: 20px;
}

/*タブレット版*/
@media (max-width: 768px) {
  .header {
    padding: 10px 0;
  }

  .main {
    margin-top: 19px;
  }

  .selector {
    padding: 10px 20px;
  }

  .note {
    margin-top: 16px;
  }

  .divider {
    width: 90%;
    margin-top: 30px;
  }
  
}
</style>
