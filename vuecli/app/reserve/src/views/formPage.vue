<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <div class="div">
    <div class="div-2">
      <img loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/93df00fc34138266fdb4a1b858262d23dc5dc1d3f04b1fffdd1ac7810d8282ec?"
        class="img" @click="$router.go(-1)" />
      <div class="div-3">予約フォーム</div>
    </div>
    <div class="div-4">
      <div class="div-5">※まだ、予約は完了していません。</div>
      <div class="div-6">
        <p>
          選択日：{{ selectedDate }} {{ selectedTime }}<br>
          子ども：{{ childrenCount }}人<br>
          料金 : {{ allowance }}円<br>
        </p>
      </div>
      <div class="div-9">保護者名</div>
      <table>
        <tbody>
          <tr>
            <th><input type="text" class="textbox1" placeholder="姓" v-model="lastName"></th>
            <th><input class="textbox1" placeholder="名" v-model="firstName"></th>
          </tr>
          <tr>
            <th><input type="text" class="textbox1" placeholder="セイ" v-model="lastNameKana"></th>
            <th><input class="textbox1" placeholder="メイ" v-model="firstNameKana"></th>
          </tr>
        </tbody>
      </table>
      <input class="textbox5" placeholder="電話番号(ハイフンなし)" v-model="phoneNumber" type="tel">
      <div v-if="phoneNumberError" class="error">{{ phoneNumberError }}</div>
      <input class="textbox6" placeholder="メールアドレス(予約完了メール受信用)" v-model="email">
      <div v-if="emailError" class="error">{{ emailError }}</div>
      <div class="div-23">居住地</div>
      <select class="selectbox1" v-model="residence">
        <option value="">選択</option>
        <option value="唐津市">唐津市</option>
        <option value="佐賀県（唐津市除く）">佐賀県（唐津市除く）</option>
        <option value="福岡県">福岡県</option>
        <option value="長崎県">長崎県</option>
        <option value="その他">その他</option>
      </select>
      <div class="div-30">
        <p>
          1. 利用人数について<br>
          &nbsp; 安全管理のため、大人１名につきお子様は３名様までの入場となります。<br><br>
          2. 利用人数の変更について<br>
          &nbsp;
          利用人数に変更がある場合は、一度キャンセルいただき、再度予約をお願いいたします。尚、万が一当日予約人数より大人数でご来場いただいた際は入場を制限させていただく可能性もございます。あらかじめご了承ください。<br><br>
          3. ご予約の上限について<br>
          &nbsp;多くの方にご参加いただくため、ご予約の上限を３件までとさせていただいております。
          あらかじめご了承ください。<br><br>
          4. 写真等の撮影、使用について<br>
          &nbsp;イベントの様子をスタッフが撮影し、SNSなどで使用させていただく場合があります。あらかじめご了承ください。<br>
        </p>
      </div>
      <select class="selectbox3" v-model="termsConfirmed">
        <option value="">選択</option>
        <option value="確認しました">確認しました</option>
      </select>
      <div class="div-31">注意事項・利用規約</div>
      <div class="div-32">
        <p>
          ・保護者の方１名につき、お子様は３名様までとさせていただいております。なお、混雑時においては入場を制限する場合があります。<br>
          ・予約人数より多い場合は、状況によってはご入場を制限させていただく場合がございます。必ず予約人数でのご利用をお願いいたします。<br>
          ・保護者の方（扶養者または２０歳以上の方）が、必ずお子様と一緒に入場ください。お子様を残されてのご退場はお断りさせていただきます。<br>
          ・おむつ交換スペースや授乳室は、特設の更衣室またはボートレース場内の専用コーナーをご利用ください。<br>
          ・天災等により予約された当日、安全確保のため中止となる場合がございますので、あらかじめご了承ください。なお、その際はボートレースからつ公式ホームページよりご確認ください。<br>
          ・お子様の対象年齢は３歳～小学生までです。<br>
          ・予約枠上限の関係で、ご入力いただいた人数ではご予約できない可能性があります。<br>
          ・お子様のオムツ着用につきましては、衛生上の観点から通常のオムツを着用したプールの利用は固くお断りしております。オムツ着用の際は、必ず水遊び用オムツを着用の上ご参加ください。<br>
          ・入力された情報は、当イベントの実施目的以外で使用することはございません。<br>
        </p>
      </div>
      <div class="div-33">
        <div class="div-34">確認事項・利用規約に同意する</div>
        <input type="checkbox" class="checkbox" v-model="checked" />
      </div>
      <button class="div-35" @click="submit" :disabled="isLoading">
        <img loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/93e967e79835e11ca3ed54f2acdf7c70f0cc442dfc8d74f1cfefd9ec0f48f353?"
          class="img-6" />
        <div class="div-36">予約確定</div>
      </button>
    </div>
    <div class="div-37">  supported by <a href="https://sunapp.jp" class="sunapp">sunapp</a> LLC..</div>
  </div>
</template>

<script>
export default {
  props: {
    selectedDate: String,
    selectedTime: String,
    childrenCount: Number,
  },
  data() {
    return {
      checked: false,
      lastName: '',
      lastNameKana: '',
      firstName: '',
      firstNameKana: '',
      phoneNumber: '',
      email: '',
      residence: '',
      termsConfirmed: '',
      event_id: 'Uxn6sTM3Tw',
      maxReservation: 0,
      reservations: {},
      isLoading: false,
      emailError: '',
      phoneNumberError: '',
    }
  },
  mounted() {
    console.log('Received props:', this.selectedDate, this.selectedTime, this.childrenCount);
    // Use the received props as needed
  },
  computed: {
    allowance() {
      return 300 * this.childrenCount;
    },
  },
  methods: {
    validatePhoneNumber() {
      const phonePattern = /^[0-9]{10,11}$/;
      if (!phonePattern.test(this.phoneNumber)) {
        this.phoneNumberError = '電話番号の形式が正しくありません。';
        return false;
      }
      this.phoneNumberError = '';
      return true;
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = 'メールアドレスの形式が正しくありません。';
        return false;
      }
      this.emailError = '';
      return true;
    },
    submit() {
      if (this.checked &&
        this.lastName &&
        this.lastNameKana &&
        this.firstName &&
        this.firstNameKana &&
        this.phoneNumber &&
        this.email &&
        this.residence &&
        this.validatePhoneNumber() &&
        this.validateEmail() &&
        this.termsConfirmed === '確認しました') {
        // Construct the route with parameters
      
        this.submitBooking()
        // Push the route with parameters
       
      } else {
        if ( this.validatePhoneNumber() &&
        this.validateEmail()){
          alert('入力項目が正しいか確認してください');

        }else{
          alert('全ての項目が入力されていません。');
        }
       
      }

    },
    async submitBooking() {

      this.isLoading = true
      
const targetChars = ["ー", "-", " "];
this.phoneNumber = [...this.phoneNumber].filter(char => !targetChars.includes(char)).join("");
console.log(this.phoneNumber); 

      try {
      const response = await fetch("https://sunapp.jp/sunappForReserve/api/getReserveCount.php");
      const data = await response.json();
      if (data.status === "success") {
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
      } else {
        console.error("エラーが発生しました: ", data2.message);
      }
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }

    if (this.extraCount() >= this.childrenCount){
      const reserve = {
        name: this.lastName + ' ' + this.firstName,
        furigana: this.lastNameKana + ' ' + this.firstNameKana,
        tel: this.phoneNumber,
        email: this.email,
        hometown: this.residence,
        event_id: this.event_id,
        customer_num: this.childrenCount,
        fee: this.allowance,
        date: this.selectedDate,
        time: this.selectedTime,
        id: this.generateRandomString(13),
      }

      try {
        const response = await fetch("https://sunapp.jp/sunappForReserve/api/postReserve.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reserve),
        });
        const result = await response.json();
        if (result.status === "success") {
          this.message = "予約が正常に追加されました";
         

          const routeParams = {
          name: 'InfoPage',
          params: {
            reserveId: reserve.id,
          }
        };

        this.$router.push(routeParams);
        } else if (result.status === "b"){
          alert('同一の電話番号・メールアドレスからの予約は3件までとなっております。')

        }else{
          this.message = `エラーが発生しました: ${result.message}`;
          console.log(result.message)
        }
      } catch (error) {
        this.message = `エラーが発生しました: ${error.message}`;
       
      }
    }else{
      alert('予約に失敗しました．再度やり直してください')
      this.$router.push({name: 'Home'});
    }

    this.isLoading = false
    },

    generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  extraCount(){
      return this.maxReservation  -  parseInt(this.reservations[this.selectedDate][this.selectedTime] , 10)
    },
  }
};
</script>
<style scoped>
.checkbox {
  transform: scale(1.4);
}

.div {
  background-color: #ebfffe;
  display: flex;
  width: 100%;
  flex-direction: column;
  font-weight: 700;
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
   display: flex;
    justify-content: center; /* 子要素を中央揃え */
    position: relative;

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

.div-4 {
  display: flex;
  margin-top: 10px;
  width: 100%;
  flex-direction: column;
  font-size: 16px;
  color: #000;
  font-weight: 300;


}

.div-5 {
  color: #b40000;
  align-self: center;
  font: 700 15px Inter, sans-serif;
}

.div-6 {
  font-family: Inter, sans-serif;
  font-weight: 700;
  margin-top: 5px;
  align-self: center;
  text-align: left;
}

.div-7 {
  display: flex;
  margin-top: 5px;
  font-size: 10px;
  color: #6e6e6e;
  letter-spacing: -0.19px;
}

.div-8 {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.div-9 {
  font-family: Yanone Kaffeesatz, sans-serif;
  text-align: auto;
  width: 90px;
  margin-top: 20px;
  color: #999;
  width: 100px;
  font-size: 16px;
}

.textbox1 {
  margin: 0 auto;
  margin-top: 1px;
  width: 90%;
  /* 幅を設定 */
  height: 30px;
  /* 高さを設定 */
  padding: 5px;
  /* 内側の余白を設定 */
  color: rgba(0, 0, 0, 0.8);
  letter-spacing: -0.22px;
  font: 500 15px Inter, sans-serif;
  border-radius: 5px;

}

.textbox1::placeholder {
  color: #999;
  /* プレースホルダーの色 */
  font-size: 10px;
  /* プレースホルダーのフォントサイズ */
  font-family: Arial, sans-serif;
  /* プレースホルダーのフォントファミリー */
  text-align: left;
  /* プレースホルダーのテキストを左揃え */
}

.textbox1:placeholder-shown {
  padding-top: 0px;
}

.textbox2 {
  margin: 0 auto;
  margin-top: 20px;
  width: 70%;
  /* 幅を設定 */
  height: 30px;
  /* 高さを設定 */
  padding: 5px;
  /* 内側の余白を設定 */
  color: rgba(0, 0, 0, 0.8);
  letter-spacing: -0.22px;
  font: 500 15px Inter, sans-serif;
  border-radius: 5px;

}

.textbox2::placeholder {
  color: #999;
  /* プレースホルダーの色 */
  font-size: 10px;
  /* プレースホルダーのフォントサイズ */
  font-family: Arial, sans-serif;
  /* プレースホルダーのフォントファミリー */
  text-align: left;
  /* プレースホルダーのテキストを左揃え */
}

.textbox2:placeholder-shown {
  padding-top: 0px;
}

.div-14 {
  align-self: start;
  display: flex;
  margin-top: 5px;
  flex-direction: column;
  flex: 1;
}

.textbox3 {
  margin: 0 auto;
  margin-top: 20px;
  width: 70%;
  /* 幅を設定 */
  height: 30px;
  /* 高さを設定 */
  padding: 5px;
  /* 内側の余白を設定 */
  color: rgba(0, 0, 0, 0.8);
  letter-spacing: -0.22px;
  font: 500 15px Inter, sans-serif;
  border-radius: 5px;

}

.textbox3::placeholder {
  color: #999;
  /* プレースホルダーの色 */
  font-size: 10px;
  /* プレースホルダーのフォントサイズ */
  font-family: Arial, sans-serif;
  /* プレースホルダーのフォントファミリー */
  text-align: left;
  /* プレースホルダーのテキストを左揃え */
}

.textbox3:placeholder-shown {
  padding-top: 0px;
}

.textbox4 {
  margin: 0 auto;
  margin-top: 20px;
  width: 70%;
  /* 幅を設定 */
  height: 30px;
  /* 高さを設定 */
  padding: 5px;
  /* 内側の余白を設定 */
  color: rgba(0, 0, 0, 0.8);
  letter-spacing: -0.22px;
  font: 500 15px Inter, sans-serif;
  border-radius: 5px;

}

.textbox4::placeholder {
  color: #999;
  /* プレースホルダーの色 */
  font-size: 10px;
  /* プレースホルダーのフォントサイズ */
  text-align: left;
  /* プレースホルダーのテキストを左揃え */
}

.textbox4:placeholder-shown {
  padding-top: 0px;
}

.textbox5 {
  color: #6e6e6e;
  letter-spacing: -0.19px;
  margin-top: 20px;
  width: 85.5%;
  height: 30px;
  font: 15px Yanone Kaffeesatz, sans-serif;
  align-self: center;
  border-radius: 5px;
}

.textbox5::placeholder {
  color: #999;
  /* プレースホルダーの色 */
  font-size: 10px;
  /* プレースホルダーのフォントサイズ */
  text-align: left;
  /* プレースホルダーのテキストを左揃え */
}

.textbox5:placeholder-shown {
  padding-top: 0px;
}

.textbox6 {
  color: #6e6e6e;
  letter-spacing: -0.19px;
  margin-top: 20px;
  width: 85.5%;
  height: 30px;
  font: 15px Yanone Kaffeesatz, sans-serif;
  align-self: center;
  border-radius: 5px;
}

.textbox6::placeholder {
  color: #999;
  /* プレースホルダーの色 */
  font-size: 10px;
  /* プレースホルダーのフォントサイズ */
  text-align: left;
  /* プレースホルダーのテキストを左揃え */
}

.textbox6:placeholder-shown {
  padding-top: 0px;
}

.div-23 {
  margin-top: 20px;
  color: #999;
  font-family: Yanone Kaffeesatz, sans-serif;
  text-align: auto;
  width: 100px;

}

.selectbox1 {
  color: #000;
  text-align: auto;
  letter-spacing: -0.19px;
  margin-top: 5px;
  width: 86%;
  height: 30px;
  font: 15px Yanone Kaffeesatz, sans-serif;
  border-radius: 5px;
  align-self: center;
  text-align: center;

}

.div-24 {
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 1);
  border-style: solid;
  border-width: 1px;
  background-color: #fff;
  display: flex;
  margin-top: 8px;
  width: 87%;
  font-weight: 400;
  white-space: nowrap;
  margin: 0 auto;
}

.div-25 {
  display: flex;
  gap: 9px;
}

.div-26 {
  font-family: Inter, sans-serif;
}

.img-2 {
  aspect-ratio: 1.45;
  object-fit: auto;
  object-position: center;
  width: 13px;
  fill: #000;
  margin: auto 0;
}

.div-27 {
  display: flex;
  letter-spacing: -0.25px;
  margin-top: 30px;
  text-align: left;
  padding: 0px 20px;
  width: 90%;
  font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
    sans-serif;
}


.sunapp {
  color: #ebfffe;
}


.selectbox2 {
  color: #000;
  text-align: auto;
  letter-spacing: -0.19px;
  margin-top: 10px;
  width: 120px;
  height: 30px;
  font: 15px Yanone Kaffeesatz, sans-serif;
  margin-right: 130px;
  align-self: end;
  border-radius: 5px;

}

.div-28 {
  align-self: end;
  display: flex;
  gap: 10px;
  font-weight: 400;
  white-space: nowrap;
  margin: 4px 38px 0 0;
}

.div-29 {
  font-family: Inter, sans-serif;
}

.img-3 {
  aspect-ratio: 1.33;
  object-fit: auto;
  object-position: center;
  width: 12px;
  fill: #000;
  margin: auto 0;
}

.div-30 {

  letter-spacing: -0.25px;
  margin: 20px auto;
  margin-top: 10px;
  text-align: left;
  padding: 0px 20px;
  width: 90%;

}

.selectbox3 {
  color: #000;
  text-align: auto;
  letter-spacing: -0.19px;
  margin-top: 10px;
  width: 120px;
  height: 30px;
  font: 15px Yanone Kaffeesatz, sans-serif;
  margin-right: 10%;
  align-self: end;
  border-radius: 5px;

}

.img-4 {
  aspect-ratio: 1.33;
  object-fit: auto;
  object-position: center;
  width: 12px;
  fill: #000;
  align-self: end;
  margin-right: 38px;
}

.div-31 {
   margin-top: 20px;
    color: #999;
    font-family: Yanone Kaffeesatz, sans-serif;
    text-align: auto;
    width: 200px;
}

.div-32 {

   display: flex;
    letter-spacing: -0.25px;
  
    text-align: left;
    width: 90%;
    font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
      sans-serif;
    width: 80%;
    margin: 20px auto;
    /* 中央に配置 */
    padding: 20px;
    /* 内側の余白を設定 */
    background-color: #fff;
    /* 背景色を白に設定 */
    border: 1px solid #ccc;
    /* ボーダーを設定 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /* 影を設定 */
    border-radius: 5px;
    /* 角丸を設定 */
    border-color: #000;

    margin-top: 1px;
}

.error {
  color: red;
  font-size: 12px;
}

.div-33 {
  align-self: center;
  display: flex;
  margin-top: 46px;
  gap: 8px;
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  line-height: 100%;
}

.div-34 {
  font-family: Noto Sans JP, sans-serif;
  margin: auto 0;
}

.img-5 {
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 24px;
}

.div-35 {
  border-radius: 12px;
  background-color: #2c4e61;
  align-self: center;
  display: flex;
  margin-top: 60px;
  gap: 16px;
  color: #ebfffe;
  font-weight: 700;
  white-space: nowrap;
  text-align: center;
  letter-spacing: 1.6px;
  padding: 2px 16px;
}

.img-6 {
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 32px;
}

.div-36 {
  font-size: 15px;
  font-family: M PLUS Code Latin, sans-serif;
  margin: auto 0;
}

.div-37 {
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

/*タブレット*/
@media (max-width: 768px) {
  .div {
    background-color: #ebfffe;
    display: flex;
    width: 100%;
    flex-direction: column;
    font-weight: 700;
    line-height: 150%;
    margin: 0 auto;
  }

  .div-2 {
    background-color: #2c4e61;
     display: flex;
    font-size: 20px;
    color: #ebfffe;
    padding: 0;
      display: flex;
    justify-content: center; /* 子要素を中央揃え */
    position: relative;
  }

  .img {
    aspect-ratio: 1;
    object-fit: auto;
    object-position: center;
    width: 50px;
      position: absolute;
    left: 0; 
  }

  .div-3 {
  font-family: M PLUS Code Latin, sans-serif;
  margin: 18px;
  flex-grow: 1;
  flex-basis: auto;
  }

  .div-4 {
    display: flex;
    margin-top: 10px;
    width: 100%;
    flex-direction: column;
    font-size: 16px;
    color: #000;
    font-weight: 300;
  }

  .div-5 {
    color: #b40000;
    align-self: center;
    font: 700 15px Inter, sans-serif;
  }

  .div-6 {
    font-family: Inter, sans-serif;
    font-weight: 700;
    margin-top: 5px;
    align-self: center;
    text-align: left;
  }

  .div-7 {
    display: flex;
    margin-top: 5px;
    font-size: 10px;
    color: #6e6e6e;
    letter-spacing: -0.19px;
  }

  .div-8 {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .div-9 {
    font-family: Yanone Kaffeesatz, sans-serif;
    text-align: auto;
    width: 90px;
  }

  .textbox1 {
    margin: 0 auto;
    margin-top: 1px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox1::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    font-family: Arial, sans-serif;
    /* プレースホルダーのフォントファミリー */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox1:placeholder-shown {
    padding-top: 0px;
  }

  .textbox2 {
    margin: 0 auto;
    margin-top: 20px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox2::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    font-family: Arial, sans-serif;
    /* プレースホルダーのフォントファミリー */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox2:placeholder-shown {
    padding-top: 0px;
  }

  .div-14 {
    align-self: start;
    display: flex;
    margin-top: 5px;
    flex-direction: column;
    flex: 1;
  }

  .textbox3 {
    margin: 0 auto;
    margin-top: 20px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox3::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    font-family: Arial, sans-serif;
    /* プレースホルダーのフォントファミリー */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox3:placeholder-shown {
    padding-top: 0px;
  }

  .textbox4 {
    margin: 0 auto;
    margin-top: 20px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox4::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox4:placeholder-shown {
    padding-top: 0px;
  }

  .textbox5 {
    color: #6e6e6e;
    letter-spacing: -0.19px;
    margin-top: 20px;
    width: 87%;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    align-self: center;
    border-radius: 5px;
  }

  .textbox5::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox5:placeholder-shown {
    padding-top: 0px;
  }

  .textbox6 {
    color: #6e6e6e;
    letter-spacing: -0.19px;
    margin-top: 20px;
    width: 87%;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    align-self: center;
    border-radius: 5px;
  }

  .textbox6::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox6:placeholder-shown {
    padding-top: 0px;
  }

  .div-23 {
    margin-top: 20px;
    color: #999;
    font-family: Yanone Kaffeesatz, sans-serif;
    text-align: auto;
    width: 100px;

  }

  .selectbox1 {
    color: #000;
    text-align: auto;
    letter-spacing: -0.19px;
    margin-top: 5px;
    width: 87%;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    border-radius: 5px;
    align-self: center;
    text-align: center;

  }

  .div-24 {
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border-color: rgba(0, 0, 0, 1);
    border-style: solid;
    border-width: 1px;
    background-color: #fff;
    display: flex;
    margin-top: 8px;
    width: 87%;
    font-weight: 400;
    white-space: nowrap;
    margin: 0 auto;
  }

  .div-25 {
    display: flex;
    gap: 9px;
  }

  .div-26 {
    font-family: Inter, sans-serif;
  }

  .img-2 {
    aspect-ratio: 1.45;
    object-fit: auto;
    object-position: center;
    width: 13px;
    fill: #000;
    margin: auto 0;
  }

  .div-27 {
    display: flex;
    letter-spacing: -0.25px;
    margin-top: 30px;
    text-align: left;
    padding: 0px 20px;
    width: 90%;
    font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
      sans-serif;
  }

  .selectbox2 {
    color: #000;
    text-align: auto;
    letter-spacing: -0.19px;
    margin-top: 10px;
    width: 120px;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    margin-right: 50px;
    align-self: end;
    border-radius: 5px;

  }

  .div-28 {
    align-self: end;
    display: flex;
    gap: 10px;
    font-weight: 400;
    white-space: nowrap;
    margin: 4px 38px 0 0;
  }

  .div-29 {
    font-family: Inter, sans-serif;
  }

  .img-3 {
    aspect-ratio: 1.33;
    object-fit: auto;
    object-position: center;
    width: 12px;
    fill: #000;
    margin: auto 0;
  }

  .div-30 {
    display: flex;
    letter-spacing: -0.25px;
    margin: 20px auto;
    margin-top: 10px;
    text-align: left;
    padding: 0px 20px;
    width: 90%;
    font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
      sans-serif;
  }

  .selectbox3 {
    color: #000;
    text-align: auto;
    letter-spacing: -0.19px;
    margin-top: 10px;
    width: 120px;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    margin-right: 10%;
    align-self: end;
    border-radius: 5px;

  }

  .img-4 {
    aspect-ratio: 1.33;
    object-fit: auto;
    object-position: center;
    width: 12px;
    fill: #000;
    align-self: end;
    margin-right: 38px;
  }

  .div-31 {
    margin-top: 20px;
    color: #999;
    font-family: Yanone Kaffeesatz, sans-serif;
    text-align: auto;
    width: 200px;
  }

  .div-32 {
    display: flex;
    letter-spacing: -0.25px;
    margin-top: 1px;
    text-align: left;
    width: 90%;
    font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
      sans-serif;
    width: 80%;
    margin: 20px auto;
    /* 中央に配置 */
    padding: 20px;
    /* 内側の余白を設定 */
    background-color: #fff;
    /* 背景色を白に設定 */
    border: 1px solid #ccc;
    /* ボーダーを設定 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /* 影を設定 */
    border-radius: 5px;
    /* 角丸を設定 */
    border-color: #000;
      margin-top: 1px;
  }

  .div-33 {
    align-self: center;
    display: flex;
    margin-top: 46px;
    gap: 8px;
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap;
    line-height: 100%;
  }

  .div-34 {
    font-family: Noto Sans JP, sans-serif;
    margin: auto 0;
  }

  .img-5 {
    aspect-ratio: 1;
    object-fit: auto;
    object-position: center;
    width: 24px;
  }

  .div-35 {
    border-radius: 12px;
    background-color: #2c4e61;
    align-self: center;
    display: flex;
    margin-top: 60px;
    gap: 16px;
    color: #ebfffe;
    font-weight: 700;
    white-space: nowrap;
    text-align: center;
    letter-spacing: 1.6px;
    padding: 2px 16px;
  }

  .img-6 {
    aspect-ratio: 1;
    object-fit: auto;
    object-position: center;
    width: 32px;
  }

  .div-36 {
    font-size: 15px;
    font-family: M PLUS Code Latin, sans-serif;
    margin: auto 0;
  }

  .div-37 {
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


/*スマホ版*/
@media (max-width: 428px) {
  .div {
    background-color: #ebfffe;
    display: flex;
    width: 100%;
    flex-direction: column;
    font-weight: 700;
    line-height: 150%;
    margin: 0 auto;
  }

  .div-2 {
    background-color: #2c4e61;
     display: flex;
    font-size: 20px;
    color: #ebfffe;
    padding: 0;
      display: flex;
    justify-content: center; /* 子要素を中央揃え */
    position: relative;
  }

  .img {
    aspect-ratio: 1;
    object-fit: auto;
    object-position: center;
    width: 50px;
      position: absolute;
    left: 0; 
  }

  .div-3 {
    font-family: M PLUS Code Latin, sans-serif;
  margin: 18px;
  flex-grow: 1;
  flex-basis: auto;
  }

  .div-4 {
    display: flex;
    margin-top: 10px;
    width: 100%;
    flex-direction: column;
    font-size: 16px;
    color: #000;
    font-weight: 300;
  }

  .div-5 {
    color: #b40000;
    align-self: center;
    font: 700 15px Inter, sans-serif;
  }

  .div-6 {
    font-family: Inter, sans-serif;
    font-weight: 700;
    margin-top: 5px;
    align-self: center;
    text-align: left;
  }

  .div-7 {
    display: flex;
    margin-top: 5px;
    font-size: 10px;
    color: #6e6e6e;
    letter-spacing: -0.19px;
  }

  .div-8 {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .div-9 {
    font-family: Yanone Kaffeesatz, sans-serif;
    text-align: auto;
    width: 90px;
  }

  .textbox1 {
    margin: 0 auto;
    margin-top: 1px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox1::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    font-family: Arial, sans-serif;
    /* プレースホルダーのフォントファミリー */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox1:placeholder-shown {
    padding-top: 0px;
  }

  .textbox2 {
    margin: 0 auto;
    margin-top: 20px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox2::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    font-family: Arial, sans-serif;
    /* プレースホルダーのフォントファミリー */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox2:placeholder-shown {
    padding-top: 0px;
  }

  .div-14 {
    align-self: start;
    display: flex;
    margin-top: 5px;
    flex-direction: column;
    flex: 1;
  }

  .textbox3 {
    margin: 0 auto;
    margin-top: 20px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox3::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    font-family: Arial, sans-serif;
    /* プレースホルダーのフォントファミリー */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox3:placeholder-shown {
    padding-top: 0px;
  }

  .textbox4 {
    margin: 0 auto;
    margin-top: 20px;
    width: 70%;
    /* 幅を設定 */
    height: 30px;
    /* 高さを設定 */
    padding: 5px;
    /* 内側の余白を設定 */
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: -0.22px;
    font: 500 15px Inter, sans-serif;
    border-radius: 5px;

  }

  .textbox4::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox4:placeholder-shown {
    padding-top: 0px;
  }

  .textbox5 {
    color: #6e6e6e;
    letter-spacing: -0.19px;
    margin-top: 20px;
    width: 87%;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    align-self: center;
    border-radius: 5px;
  }

  .textbox5::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox5:placeholder-shown {
    padding-top: 0px;
  }

  .textbox6 {
    color: #6e6e6e;
    letter-spacing: -0.19px;
    margin-top: 20px;
    width: 87%;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    align-self: center;
    border-radius: 5px;
  }

  .textbox6::placeholder {
    color: #999;
    /* プレースホルダーの色 */
    font-size: 10px;
    /* プレースホルダーのフォントサイズ */
    text-align: left;
    /* プレースホルダーのテキストを左揃え */
  }

  .textbox6:placeholder-shown {
    padding-top: 0px;
  }

  .div-23 {
    margin-top: 20px;
    color: #999;
    font-family: Yanone Kaffeesatz, sans-serif;
    text-align: auto;
    width: 100px;

  }

  .selectbox1 {
    color: #000;
    text-align: auto;
    letter-spacing: -0.19px;
    margin-top: 5px;
    width: 87%;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    border-radius: 5px;
    align-self: center;
    text-align: center;

  }

  .div-24 {
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border-color: rgba(0, 0, 0, 1);
    border-style: solid;
    border-width: 1px;
    background-color: #fff;
    display: flex;
    margin-top: 8px;
    width: 87%;
    font-weight: 400;
    white-space: nowrap;
    margin: 0 auto;
  }

  .div-25 {
    display: flex;
    gap: 9px;
  }

  .div-26 {
    font-family: Inter, sans-serif;
  }

  .img-2 {
    aspect-ratio: 1.45;
    object-fit: auto;
    object-position: center;
    width: 13px;
    fill: #000;
    margin: auto 0;
  }

  .div-27 {
    display: flex;
    letter-spacing: -0.25px;
    margin-top: 30px;
    text-align: left;
    padding: 0px 20px;
    width: 90%;
    font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
      sans-serif;
  }

  .selectbox2 {
    color: #000;
    text-align: auto;
    letter-spacing: -0.19px;
    margin-top: 10px;
    width: 120px;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    margin-right: 20px;
    align-self: end;
    border-radius: 5px;

  }

  .div-28 {
    align-self: end;
    display: flex;
    gap: 10px;
    font-weight: 400;
    white-space: nowrap;
    margin: 4px 38px 0 0;
  }

  .div-29 {
    font-family: Inter, sans-serif;
  }

  .img-3 {
    aspect-ratio: 1.33;
    object-fit: auto;
    object-position: center;
    width: 12px;
    fill: #000;
    margin: auto 0;
  }

  .div-30 {
    display: flex;
    letter-spacing: -0.25px;
    margin: 20px auto;
    margin-top: 10px;
    text-align: left;
    padding: 0px 20px;
    width: 90%;
    font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
      sans-serif;
  }

  .selectbox3 {
    color: #000;
    text-align: auto;
    letter-spacing: -0.19px;
    margin-top: 10px;
    width: 120px;
    height: 30px;
    font: 15px Yanone Kaffeesatz, sans-serif;
    margin-right: 10%;
    align-self: end;
    border-radius: 5px;

  }

  .img-4 {
    aspect-ratio: 1.33;
    object-fit: auto;
    object-position: center;
    width: 12px;
    fill: #000;
    align-self: end;
    margin-right: 38px;
  }

  .div-31 {
    margin-top: 20px;
    color: #999;
    font-family: Yanone Kaffeesatz, sans-serif;
    text-align: auto;
    width: 200px;
  }

  .div-32 {
    display: flex;
    letter-spacing: -0.25px;
    margin-top: 1px;
    text-align: left;
    width: 90%;
    font: 13px/20px Yanone Kaffeesatz, -apple-system, Roboto, Helvetica,
      sans-serif;
    width: 80%;
    margin: 20px auto;
    /* 中央に配置 */
    padding: 20px;
    /* 内側の余白を設定 */
    background-color: #fff;
    /* 背景色を白に設定 */
    border: 1px solid #ccc;
    /* ボーダーを設定 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /* 影を設定 */
    border-radius: 5px;
    /* 角丸を設定 */
    border-color: #000;
      margin-top: 1px;
  }

  .div-33 {
    align-self: center;
    display: flex;
    margin-top: 46px;
    gap: 8px;
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap;
    line-height: 100%;
  }

  .div-34 {
    font-family: Noto Sans JP, sans-serif;
    margin: auto 0;
  }

  .img-5 {
    aspect-ratio: 1;
    object-fit: auto;
    object-position: center;
    width: 24px;
  }

  .div-35 {
    border-radius: 12px;
    background-color: #2c4e61;
    align-self: center;
    display: flex;
    margin-top: 60px;
    gap: 16px;
    color: #ebfffe;
    font-weight: 700;
    white-space: nowrap;
    text-align: center;
    letter-spacing: 1.6px;
    padding: 2px 16px;
  }

  .img-6 {
    aspect-ratio: 1;
    object-fit: auto;
    object-position: center;
    width: 32px;
  }

  .div-36 {
    font-size: 15px;
    font-family: M PLUS Code Latin, sans-serif;
    margin: auto 0;
  }

  .div-37 {
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