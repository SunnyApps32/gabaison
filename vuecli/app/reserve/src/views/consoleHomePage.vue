<template>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div class="div">
      <div class="div-2">管理者 Home</div>
      <div class="div-3">
       現在のご利用者数<br /><br />
    
      </div>

      <div class="div-4"> {{ now_checkined }}名</div>


    
      <button @click="goToListpage" class="div-6">予約者一覧</button>
     
      
     
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/a735cab541df0a2ebb0694177468ec5832da1c6e573c68524985aa4fcd7d7fdf?"
      class="img"
      @click="goToQrpage"
    />
      <div class="div-11">  supported by <a href="https://sunapp.jp" class="sunapp">sunapp</a> LLC.</div>
    </div>
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
        now_checkined: 0,
      };
    },
    async created() {
   
      // try {
      //     const response = await fetch('https://sunapp.jp/sunappForReserve/api/getReservationById.php', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //       body: JSON.stringify({ reserveid: this.reserveId })
      //     });
  
      //     const data = await response.json();
      //     this.reservation = data.reservation;
         
      //     if (data.status === 'success') {
      //       this.reservation = data.reservation;
      //       console.log(this.reservation)
      //     } else {
      //       console.error('エラーが発生しました: ', data.message);
      //       alert(data.message);
      //     }
      //   } catch (error) {
      //     console.error('エラーが発生しました: ', error);
      //     alert('予約情報の取得に失敗しました。');
      //   }
  
      try {
      const response2 = await fetch("https://sunapp.jp/sunappForReserve/api/getCurrentCheckInCount.php", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Pragma': 'no-cache'
            },
          });
      const data2 = await response2.json();
      console.log(data2.data)
      if (data2.status === "success") {
       this.now_checkined = data2.data;
        console.log(this.now_checkined)
      } else {
        console.error("エラーが発生しました: ", data2.message);
      }
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
    },
    computed: {
    
    },
    methods: {
        goToQrpage(){
            this.$router.push({name: "qrcodeReader"});
        },
        goToListpage(){
          this.$router.push({name: "list"});
        }
      
    },
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
      align-self: stretch;
      width: 100%;
      align-items: center;
      color: #ebfffe;
      white-space: nowrap;
      text-align: center;
      letter-spacing: -0.38px;
      padding: 30px 0px 10px;
      font: 700 20px M PLUS Code Latin, sans-serif;
    }
    .div-3 {
      color: #000;
      text-align: center;
      margin-top: 25px;
      width: 324px;
      font: 700 20px/30px Inter, sans-serif;
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
    .div-4 {
        color: #000;
      text-align: center;
      margin-top: 25px;
      width: 324px;
      font: 700 40px/50px Inter, sans-serif;
    }

    .div-6 {
      border-radius: 5.481px;
      background-color: #2c4e61;
      display: flex;
      margin-top: 40px;
      gap: 1px;
      font-size: 19px;
      color: #ebfffe;
      font-weight: 700;
      white-space: nowrap;
      text-align: center;
      padding: 4px 50px;
    }

  
  .sunapp {
    color: #ebfffe;
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
  

  
  </style>