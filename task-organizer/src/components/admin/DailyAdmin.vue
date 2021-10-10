<template>
    <div class="daily-admin">
        <b-form v-if="show">
            <input id="daily-id" type="hidden" v-model="daily.id" />
            <b-form-group label="Título:" label-for="daily-titulo">
                <b-form-input id="daily-titulo" type="text"
                    v-model="daily.titulo" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Nome do Diário..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'

export default {
    titulo: 'ArticleAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            show: true,
            daily: {
                status: 'aguardando',
                userId: JSON.parse(localStorage.getItem(userKey)).id
            },
        }
    },
    methods: {
        async loadDailys() {
            const waiting =  await axios.get(`${baseApiUrl}/query-waiting-dailys/${JSON.parse(localStorage.getItem(userKey)).id}`)
            const running = await axios.get(`${baseApiUrl}/query-running-dailys/${JSON.parse(localStorage.getItem(userKey)).id}`)
            if (waiting.data) {
                this.$router.push({ path: 'TasksAdmin' })
            }
            if (running.data) {
                 this.$router.push({ path: '/' })
            }
        },
        reset() {
            this.mode = 'save'
            this.daily = {}
            //this.loadDailys()
        },
        save() {
            const method = 'post'
            axios[method](`${baseApiUrl}/dailys`, this.daily)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.$router.push({ path: 'TasksAdmin' })
                })
                .catch(showError)
        },
    },
    watch: {
        page() {
            this.loadDailys()
        }
    },
    mounted() {
        this.loadDailys()
    }
}
</script>

<style>

</style>