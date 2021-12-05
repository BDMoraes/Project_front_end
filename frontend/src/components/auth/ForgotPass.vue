<template>
    <div class="auth-content">
        <div class="auth-modal">
            <img src="@/assets/logo.png" width="100" alt="Logo" />
            <hr>
            <div class="auth-title">Resetar senha</div>
            <input v-model="user.email" name="email" type="text" placeholder="E-mail">
            <div class="auth-button">
                <b-button variant="info" @click="forgotPass">Resetar</b-button>
            </div>
             <a href @click.prevent="login()">
                <span>Voltar ao login</span>
             </a>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError} from "@/global";
import axios from "axios";

export default {
  name: "ForgotPass",
  data: function() {
    return {
      user: {},
    };
  },
  methods: {
    async forgotPass() {
     await axios
        .post(`${baseApiUrl}/forgotPass`, this.user)
        .then(() => {
          this.$toasted.global.passResetSuccess();
          this.$router.push({ path: "auth" });
        })
        .catch(showError);
    },
     login() {
      this.$router.push({ path: "auth" });
    },
  },
};
</script>

<style>
.auth-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-modal {
  background-color: rgb(255, 255, 255);
  width: 350px;
  padding: 35px;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
  background-color: #abdafd71;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-title {
  font-size: 1.2rem;
  font-weight: 100;
  margin-top: 10px;
  margin-bottom: 15px;
}

.auth-modal input {
  border: 1px solid rgb(37, 48, 149);
  width: 100%;
  margin-bottom: 15px;
  padding: 3px 8px;
  outline: none;
  border-radius: 8px;
}

.auth-modal button {
  align-self: center;
  color: #fff;
  padding: 5px 15px;
  border-radius: 8px;
}

.auth-modal a {
  margin-top: 35px;
}
</style>
