<template>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div class="div">
      <div class="div-2">
        <img loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/93df00fc34138266fdb4a1b858262d23dc5dc1d3f04b1fffdd1ac7810d8282ec?"
        class="img" @click="this.$router.go(-1)" />
        <div class="div-44">チェックイン/アウト</div>
        <button class="button-1"  @click="confirmDelete">予約削除</button>
    
    </div>
      <div class="div-3">

        <div v-if="checkInFlag===0" class="div-5">未チェックイン</div>
        <div v-else-if="checkInFlag===1" class="div-6">チェックイン済</div>
        <div v-else-if="checkInFlag===2" class="div-66">チェックアウト済</div>
       
      </div>
     
      <div class="div-7">
        <div class="div-8">予約内容</div>
      </div>
      <div class="div-10">
  
        <p v-if="reservation">
          予約日 ：{{ this.reservation["date"] ?? 0}} {{ this.reservation["time"] ?? 0 }}<br>
          同伴人数： {{ this.reservation["customer_num"] ?? 0 }}人<br>
          名前  ： {{ this.reservation["name"] ?? 1 }}<br>
          電話番号： {{ this.reservation["tel"] ?? 0 }}<br>
          Email ： {{ this.reservation["email"] ?? 0 }}<br>
          居住地 ： {{ this.reservation["hometown"] ?? 0 }}<br>
          利用料金： {{ this.reservation["fee"] ?? 1 }}円<br>
        </p>
      </div>

      <button class="div-4" @click="saveQrCode" :disabled="isLoading">
        <div v-if="checkInFlag===0" class="div-5" @click="checkIn">チェックイン</div>
        <div v-else-if="checkInFlag===1" class="div-5" @click="checkOut">チェックアウト</div>
        <div v-else-if="checkInFlag===2" class="div-55" @click="reset">未チェックインへ戻す</div>
      </button>
   

       <!-- 削除確認モーダル -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDeleteModal">&times;</span>
        <h2>予約削除確認</h2>
        <p>本当に削除しますか？</p>
        <p>削除するには「Delete」と入力してください。</p>
        <input v-model="deleteConfirmationText" placeholder="Deleteを入力" />
        <button @click="deleteReserve" :disabled="deleteConfirmationText !== 'Delete'">削除</button>
      </div>
    </div>

    <div class="div-11">  supported by <a href="https://sunapp.jp" class="sunapp">sunapp</a> LLC.</div>
    </div>
    <transition-group
      name="fade"
      mode="out-in"
  >
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
    props: {
      reserveId: String,
    },
    data() {
      return {
        url: '',
        childrenCount: 0,
        reservation: null,
        checkInFlag: 0,
        isLoading: false,
        showDeleteModal: false,
      deleteConfirmationText: '',
      };
    },
    async created() {
      try {
        this.isLoading = true
          const response = await fetch('https://sunapp.jp/sunappForReserve/api/getReservationById.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reserveid: this.reserveId })
          });
  
          const data = await response.json();
          this.reservation = data.reservation;
          
         
          if (data.status === 'success') {
            this.reservation = data.reservation;
           
            this.checkInFlag = this.reservation["checkIn"];
           
        

          } else {
            console.error('エラーが発生しました: ', data.message);
            alert(data.message);
           
          }
        } catch (error) {
          console.error('エラーが発生しました: ', error);
          alert('予約情報の取得に失敗しました。');
         
        }
        this.isLoading = false
    },
    computed: {
      allowance() {
        return 300 * this.childrenCount;
      },
    },
    methods: {
        goToQrpage(){
            this.$router.push({name: "qrcodeReader"});
        },
        async checkIn(){
            this.isLoading = true;
            try {
          const response = await fetch('https://sunapp.jp/sunappForReserve/api/checkInOut.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reserveId: this.reserveId, command: "checkIn" })
          });
  
          const data = await response.json();
         
          if (data.status === 'success') {
            // alert("正常に処理されました");
            this.isLoading = false;
            this.$router.go(-1)

          } else {
            this.isLoading = false;
            console.error('エラーが発生しました: ', data.message);
            alert(data.message);
            
          }
        } catch (error) {
          this.isLoading = false;
          console.error('エラーが発生しました: ', error);
          alert('予約情報の取得に失敗しました。');
         
        }
        this.isLoading = false;
  

        },
        async checkOut(){
            this.isLoading = true;
            try {
          const response = await fetch('https://sunapp.jp/sunappForReserve/api/checkInOut.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reserveId: this.reserveId, command: "checkOut" })
          });
  
          const data = await response.json();
         
          if (data.status === 'success') {
            this.isLoading = false;
            // alert("正常に処理されました");
            
            this.$router.go(-1)
            

          } else {
            this.isLoading = false;
            console.error('エラーが発生しました: ', data.message);
            alert(data.message);
            
          }
        } catch (error) {
          this.isLoading = false;
          console.error('エラーが発生しました: ', error);
          alert('予約情報の取得に失敗しました。');
          
        }
        this.isLoading = false;
        },
        async reset(){
            this.isLoading = true;
            try {
          const response = await fetch('https://sunapp.jp/sunappForReserve/api/checkInOut.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reserveId: this.reserveId, command: "reset" })
          });
  
          const data = await response.json();
         
          if (data.status === 'success') {
            this.isLoading = false;
            // alert("正常に処理されました");
            
            this.$router.go(-1)
            

          } else {
            this.isLoading = false;
            console.error('エラーが発生しました: ', data.message);
            alert(data.message);
            
          }
        } catch (error) {
          this.isLoading = false;
          console.error('エラーが発生しました: ', error);
          alert('予約情報の取得に失敗しました。');
          
        }
        this.isLoading = false;
        },

        confirmDelete() {
      if (confirm('本当に削除しますか？')) {
        this.showDeleteModal = true;
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteConfirmationText = '';
    },
    async deleteReserve() {
      if (this.deleteConfirmationText !== 'Delete') {
        alert('削除するには「Delete」と入力してください。');
        return;
      }

      const reserve = {
        name: this.reservation["name"],
        furigana: this.reservation["furigana"],
        tel: this.reservation["tel"],
        email: this.reservation["email"],
        hometown: this.reservation["hometown"],
        event_id: this.reservation["event_id"],
        customer_num: this.reservation["customer_num"],
        fee: this.reservation["fee"],
        date: this.reservation["date"],
        time: this.reservation["time"],
        reserveid: this.reserveId,
      }
      this.isLoading = true;
      try {
        const response = await fetch("https://sunapp.jp/sunappForReserve/api/deleteFromConsole.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reserve),
        });
        const result = await response.json();
        if (result.status === "success") {
          this.message = "予約が削除されました";
          this.isLoading = false;
        //  alert('予約が削除されました')
          this.$router.push({name: 'Home'});
         
        }else{
          this.message = `エラーが発生しました: ${result.message}`;
          this.isLoading = false;
          console.log(result.message)
        }
      } catch (error) {
        this.isLoading = false;
        this.message = `エラーが発生しました: ${error.message}`;
      }
      this.isLoading = false;
    },
    }
  };
  </script>
    
    <style scoped>
    .div {
      background-color: #ebfffe;
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
      line-height: 150%;
      margin: 0 auto;
    }
    .div-2 {
      background-color: #2c4e61;
      display: flex;
      width: 100%;
      align-items: start;
      gap: 20px;
      font-size: 20px;
      color: #ebfffe;
      white-space: nowrap;
      text-align: center;
      letter-spacing: -0.38px;
      justify-content: center;
      position: relative;
      font-weight: bold;
    }
    
    .img {
      aspect-ratio: 1;
      object-fit: auto;
      object-position: center;
      width: 100px;
      align-self: end;
      margin-top: 355px;
      max-width: 100%;
      margin-right: 20px;
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
    
    .div-3 {
      font-family: M PLUS Code Latin, sans-serif;
      margin: 18px;
      flex-grow: 1;
      flex-basis: auto;
    }
    
    .div-3 {
      color: #b40000;
      text-align: center;
      margin-top: 25px;
      width: 324px;
      font: 700 20px/30px Inter, sans-serif;
    }
    
    .div-4 {
      border-radius: 5.481px;
      background-color: #2c4e61;
      display: flex;
      margin-top: 15px;
      gap: 1px;
      font-size: 19px;
      color: #ebfffe;
      font-weight: 700;
      white-space: nowrap;
      text-align: center;
      padding: 4px 20px;
    }
    
    .div-44 {
      font-family: M PLUS Code Latin, sans-serif;
      margin: 18px;
      flex-grow: 1;
      flex-basis: auto;
    }
    .img-2 {
      aspect-ratio: 1;
      object-fit: auto;
      object-position: center;
      width: 38px;
    }
    .div-5 {
      font-family: Inter, sans-serif;
      flex-grow: 1;
      flex-basis: auto;
      margin: auto 0;
    }
    
    .div-55 {
      font-family: Inter, sans-serif;
      flex-grow: 1;
      flex-basis: auto;
      margin: auto 0;
      color: #ef3b3b;
    }
    .div-6 {
      font-family: Inter, sans-serif;
      flex-grow: 1;
      flex-basis: auto;
      margin: auto 0;
      color:green;
    }
    
    .div-66 {
      font-family: Inter, sans-serif;
      flex-grow: 1;
      flex-basis: auto;
      margin: auto 0;
      color: blue;
    }
    
    .sunapp {
      color: #ebfffe;
    }
    
    .div-7 {
      display: flex;
      margin-top: 29px;
      gap: 20px;
      white-space: nowrap;
    }
    .div-8 {
      color: #000;
      font: 800 20px Inter, sans-serif;
    }
    .div-9 {
      color: #b40000;
      text-align: center;
      flex-grow: 1;
      flex-basis: auto;
      margin: auto 0;
      font: 400 12px Inter, sans-serif;
    }
    .div-10 {
      color: #000;
      margin-top: 5px;
      font: 400 18px/27px Inter, sans-serif;
      text-align: left;
    }
    .div-11 {
      background-color: #2c4e61;
      align-self: stretch;
      margin-top: 20px;
      width: 100%;
      align-items: center;
      color: #fff;
      text-align: center;
      letter-spacing: -0.27px;
      justify-content: center;
      font: 700 20px M PLUS Code Latin, sans-serif;
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
      justify-content: center;
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
      background-color: rgb(0, 0, 0);
      background-color: rgba(0, 0, 0, 0.4);
    }
    
    .modal-content {
      background-color: #fefefe;
      margin: auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }
    
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
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
  background: rgba(0,0,0,1.0);
  position: absolute;
  left: 0;
  top: 0;
}
.loading{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 40px;
    display: flex;
    align-items: center;
}
.obj{
    width: 5px;
    height: 40px;
    background: white;
    margin: 0 3px;
    border-radius: 10px;
    animation: loading 0.8s infinite;
}
.obj:nth-child(2){
    animation-delay: 0.1s;
}
.obj:nth-child(3){
    animation-delay: 0.2s;
}
.obj:nth-child(4){
    animation-delay: 0.3s;
}
.obj:nth-child(5){
    animation-delay: 0.4s;
}
.obj:nth-child(6){
    animation-delay: 0.5s;
}
.obj:nth-child(7){
    animation-delay: 0.6s;
}
.obj:nth-child(8){
    animation-delay: 0.7s;
}
@keyframes loading{
    0%{
        height: 0;
    }
    50%{
        height: 40px;
    }
    100%{
        height: 0;
    }
}

    </style>