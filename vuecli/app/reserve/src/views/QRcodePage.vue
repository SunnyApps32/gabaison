<template>
  <div class="div">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div class="div-2">
      <img loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/93df00fc34138266fdb4a1b858262d23dc5dc1d3f04b1fffdd1ac7810d8282ec?"
        class="img" @click="goToHomePage" />
        <div class="div-3">QRコードリーダー</div></div>
    <div class="scanner">
      <div class="instructions">QRコードを<br />カメラにかざしてください</div>
      <div id="qr-reader" class="qr-reader"></div>
      <div id="qr-reader-results" class="results"></div>
      <div id="qr-reader-error" class="error"></div>

      <div class="manual-input">
        <input type="text" v-model="manualReserveId" placeholder="予約IDでチェックイン" class="input-field"/>
        <button @click="submitManualReserveId" class="submit-button">次へ</button>
      </div>
    </div>
    <div class="div-11">supported by <a href="https://sunapp.jp" class="sunapp">sunapp</a> LLC.</div>
  </div>
</template>

<script>
import { Html5Qrcode } from "html5-qrcode";

export default {
  name: 'QrCodeScanner',
  data() {
    return {
      html5QrCode: null
    };
  },
  mounted() {
    this.startScanner();
  },

  methods: {
    startScanner() {
      this.html5QrCode = new Html5Qrcode("qr-reader");
      const qrCodeSuccessCallback = (decodedText) => {
        this.html5QrCode.stop().then(() => {
          this.$router.push({
            name: 'checkInOutPage',
            params: {
              reserveId: decodedText,
            }
          });  // QRコード読み取り成功後に次のページに遷移
        }).catch((err) => {
          console.error("Failed to stop scanning.", err);
        });
      };
      const qrCodeErrorCallback = (errorMessage) => {
        console.log(`Error: ${errorMessage}`);
      };
      const config = { fps: 10, qrbox: 250 };

      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          if (videoDevices.length > 0) {
            this.html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback).catch(qrCodeErrorCallback);
          } else {
            alert('カメラデバイスが見つかりませんでした。');
          }
        })
        .catch(err => {
          console.log(`Error: ${err.message}`);
        });
    },
    submitManualReserveId() {
      if (this.manualReserveId.trim() !== '') {
        this.$router.push({
          name: 'checkInOutPage',
          params: {
            reserveId: this.manualReserveId,
          }
        });
      } else {
        alert('予約IDを入力してください。');
      }
    },
    goToHomePage(){
      this.$router.push({name: "Home"});
    }
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

  color: #ebfffe;
  white-space: nowrap;
  text-align: center;
  letter-spacing: -0.38px;
   display: flex;
    justify-content: center; /* 子要素を中央揃え */
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

}

.container {
  background-color: #646464;
  display: flex;
  max-width: 480px;
  width: 100%;
  flex-direction: column;
  color: #fff;
  font-weight: 700;
  text-align: center;
  line-height: 150%;
  margin: 0 auto;
}
.header {
  background-color: #2c4e61;
  width: 100%;
  align-items: center;
  white-space: nowrap;
  letter-spacing: -0.38px;
  padding: 60px 60px 18px;
  font: 20px M PLUS Code Latin, sans-serif;
}
.scanner {
  display: flex;
  margin-top: 65px;
  width: 100%;
  flex-direction: column;
  font-size: 28px;
  color: #ebfffe;
  white-space: nowrap;
  letter-spacing: -0.53px;
  line-height: 42px;
  padding: 0 30px;
}
.instructions {
  font-family: M PLUS Code Latin, sans-serif;
  color: black;
}
.qr-reader {
  margin: 0px auto;
  width: 100%;
}
.results {
  margin-top: 20px;
  font-size: 18px;
}
.error {
  margin-top: 20px;
  font-size: 18px;
  color: red;
}
.footer {
  background-color: #2c4e61;
  margin-top: 55px;
  width: 100%;
  align-items: center;
  letter-spacing: -0.27px;
  justify-content: center;
  padding: 20px 60px;
  font: 14px M PLUS Code Latin, sans-serif;
}
.sunapp {
  color: #ebfffe;
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
