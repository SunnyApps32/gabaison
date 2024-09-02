<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <div class="div">
    <div class="div-2">予約完了</div>
    <div class="div-3">
      予約が完了しました。<br />QRコードを保存してください。<br />
      当日ご提示をお願い致します。<br /><br />
     
    </div>

    <div ref="qrCodeContainer">
      <img
        :src="url"
        :alt="reserveId"
        class="img"
      />
    </div>
    <button class="div-4" @click="saveQrCode">
      <div class="div-5">QRコードを保存</div>
    </button>
    <div class="div-3">
      登録内容について必ず確認お願いします。<br />登録内容に誤りがある場合や不正が確認された場合は予約を取り消す場合があります。
    </div>
    <div class="div-7">
      <div class="div-8">予約内容</div>
      <div class="div-9">※予約確認メールにお送りしています。</div>
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
    <div class="div-11">  supported by <a href="https://sunapp.jp" class="sunapp">sunapp</a> LLC.</div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';

export default {
  props: {
    reserveId: String,
  },
  data() {
    return {
      url: '',
      childrenCount: 0,
      reservation: null,
    };
  },
  async created() {
    this.url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(this.reserveId)}&bgcolor=F2F2F2&color=111111&qzone=0&margin=0&ecc=L&size=213x213`;
    
  
    try {

      
   
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
          console.log(this.reservation)
        } else {
          console.error('エラーが発生しました: ', data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error('エラーが発生しました: ', error);
        alert('予約情報の取得に失敗しました。');
      }

  },
  computed: {
    allowance() {
      return 300 * this.childrenCount;
    },
  },
  methods: {
    async saveQrCode() {
      try {
        const response = await fetch(this.url);
        const blob = await response.blob();
        saveAs(blob, 'qrcode.png');
      } catch (error) {
        console.error('Error saving QR code:', error);
      }
    },
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
    color: #b40000;
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
  .div-6 {
    border-color: rgba(138, 138, 138, 1);
    border-style: solid;
    border-width: 0.1px;
    background-color: #8a8a8a;
    margin-top: 26px;
    width: 90%;
    max-width: 100%;
    height: 0.1px;
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

  /*タブレット用*/
  @media (max-width: 768px) {
  .div {
    background-color: #ebfffe;
    display: flex;
    flex-direction: column;
    color: #fff;
    font-weight: 700;
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
    color: #b40000;
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
    border-radius: 10%;
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
  .div-6 {
    border-color: rgba(138, 138, 138, 1);
    border-style: solid;
    border-width: 0.1px;
    background-color: #8a8a8a;
    margin-top: 26px;
    width: 365px;
    max-width: 100%;
    height: 0.1px;
  }
  .div-7 {
    display: flex;
    margin-top: 29px;
    white-space: nowrap;

  }
  .div-8 {
    color: #000;
    font: 800 19px Inter, sans-serif;
  }
  .div-9 {
    color: #b40000;
    font: 300 12px Inter, sans-serif;
  }
  .div-10 {
    color: #000;
    margin-top: 5px;
    font: 400 18px/27px Inter, sans-serif;
    text-align: left;

  }
  .div-11 {
    background-color: #2c4e61;
    margin-top: 30px;
    width: 100%;
    align-items: center;
    color: #fff;
    text-align: center;
    letter-spacing: -0.27px;
    justify-content: center;
    padding: 19px 0px;
    font: 700 20px M PLUS Code Latin, sans-serif;
  }
}



  /*スマホ用*/
  @media (max-width: 428px) {
  .div {
    background-color: #ebfffe;
    display: flex;
    max-width: 480px;
    flex-direction: column;
    color: #fff;
    font-weight: 700;
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
    color: #b40000;
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
    border-radius: 10%;
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
  .div-6 {
    border-color: rgba(138, 138, 138, 1);
    border-style: solid;
    border-width: 0.1px;
    background-color: #8a8a8a;
    margin-top: 26px;
    width: 365px;
    max-width: 100%;
    height: 0.1px;
  }
  .div-7 {
    display: flex;
    margin-top: 29px;
    white-space: nowrap;

  }
  .div-8 {
    color: #000;
    font: 800 19px Inter, sans-serif;
  }
  .div-9 {
    color: #b40000;
    font: 300 12px Inter, sans-serif;
  }
  .div-10 {
    color: #000;
    margin-top: 5px;
    font: 400 18px/27px Inter, sans-serif;
    text-align: left;

  }
  .div-11 {
    background-color: #2c4e61;
    margin-top: 20px;
    width: 100%;
    align-items: center;
    color: #fff;
    text-align: center;
    letter-spacing: -0.27px;
    justify-content: center;
    padding: 19px 0px;
    font: 700 14px M PLUS Code Latin, sans-serif;
  }
}

</style>