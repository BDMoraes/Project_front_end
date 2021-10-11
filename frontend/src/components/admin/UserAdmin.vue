<template>
    <div class="user-admin">
        <PageTitle icon="fa fa-user" main="Administração de Usuário"
            sub="Altere a senha do usuário" />
        <b-form>
            <input id="user-id" type="hidden" v-model="user.id" />
            <b-row v-show="mode === 'save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha:" label-for="user-senha">
                        <b-form-input id="user-senha" type="password"
                            v-model="user.senha"
                            placeholder="Informe a nova senha do Usuário..." />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Confirmação de Senha:" 
                        label-for="user-confirm-senha">
                        <b-form-input id="user-confirm-senha" type="password"
                            v-model="user.confirmSenha"
                            placeholder="Confirme a nova senha do Usuário..." />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-button variant="success" v-if="mode === 'save'"
                        @click="save">Salvar</b-button>
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <hr>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'

export default {
    nome: 'UserAdmin',
    components: {PageTitle},
    data: function() {
        return {
            mode: 'save',
            user: {
                nome: null
            }
        }
    },
    methods: {
        reset() {
            this.mode = 'save'
            this.user = {}
            this.loadUsers()
        },
        save() {
            this.user.nome = JSON.parse(localStorage.getItem(userKey)).nome
            this.user.id = JSON.parse(localStorage.getItem(userKey)).id
            this.user.email = JSON.parse(localStorage.getItem(userKey)).email
            axios.put(`${baseApiUrl}/users/${this.user.id}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
    },
    mounted() {
    }
}
</script>

<style>

</style>