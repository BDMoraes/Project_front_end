<template>
    <div class="auth-content">
        <div class="auth-modal">
            <img src="@/assets/logo.png" width="100" alt="Logo" />
            <hr>
            <div class="auth-title">{{ showSignup ? 'Cadastre-se' : 'Entrar' }}</div>
            <input v-if="showSignup" v-model="user.nome" type="text" placeholder="Nome">
            <input v-model="user.email" name="email" type="text" placeholder="E-mail">
            <input v-model="user.senha" name="senha" type="password" placeholder="Senha">
            <input v-if="showSignup" v-model="user.confirmSenha"
                type="password" placeholder="Confirme a Senha">

            <div class="auth-button">
                <b-button variant="info" v-if="showSignup" @click="signup">Registrar</b-button>
                <b-button variant="info" v-else @click="signin">Login</b-button>
            </div>
           
            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Login</span>
                <span v-else>Registrar</span>
            </a>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "Auth",
  data: function() {
    return {
      showSignup: false,
      user: {},
    };
  },
  methods: {
    signin() {
      axios
        .post(`${baseApiUrl}/signin`, this.user)
        .then((res) => {
          this.$store.commit("setUser", res.data);
          localStorage.setItem(userKey, JSON.stringify(res.data));
          this.$router.push({ path: "/" });
        })
        .catch(showError);
    },
    signup() {
      axios
        .post(`${baseApiUrl}/signup`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.user = {};
          this.showSignup = false;
        })
        .catch(showError);
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
