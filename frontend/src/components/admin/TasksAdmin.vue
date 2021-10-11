<template>
    <div class="Task-admin">
         <PageTitle icon="fa fa-book" main="Administração de Tarefas"
            sub="Administre suas tarefas" />
        <b-form>
            <input id="Task-id" type="hidden" v-model="Task.id" />
            <b-form-group label="Título:" label-for="Task-titulo">
                <b-form-input id="Task-titulo" type="text"
                    v-model="Task.titulo" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Título da Tarefa..." />
            </b-form-group>
              <b-form-group label="Descricao:" label-for="Task-descricao">
                <b-form-input id="Task-descricao" type="text"
                    v-model="Task.descricao" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe uma breve descrição..." />
            </b-form-group>
            <b-form-group label="Localização:" label-for="Task-localizacao">
                <b-form-select v-if="mode === 'save'"
                    id="Task-localizacao"
                    :options="locais" v-model="selectedLoc"
                    :readonly="mode === 'remove'"/>
            </b-form-group>
            <b-form-group label="Prioridade:" label-for="Task-prioridade">
                <b-form-select v-if="mode === 'save'"
                    id="Task-prioridade"
                    :options="prioridades" v-model="selectedPri" required
                    :readonly="mode === 'remove'"/>
            </b-form-group>
            <b-form-group label="Entrega:" label-for="Task-entrega">
               <b-form-input v-model="Task.entrega" required type="time" placeholder=""></b-form-input>
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="Tasks" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadTasks(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadTasks(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <hr>
        <b-button variant="danger" class="ml-2" @click="reset">Gerar diário</b-button>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'

export default {
    titulo: 'TasksAdmin',
    components: {PageTitle},
    data: function() {
        return {
            mode: 'save',
            Task: {
                status: 'aguardando',
            },
            Tasks: [],
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'titulo', label: 'Titulo'},
                { key: 'descricao', label: 'Descricao'},
                { key: 'localizacao', label: 'Localização'},
                { key: 'pripridade', label: 'Prioridade', sortable: true },
                { key: 'entrega', label: 'Entrega'},
                { key: 'actions', label: 'Ações' }
            ],
             selectedLoc: null,
             selectedPri: null,
             locais: [{ text: 'Selecione', value: null }, { text: 'Atual', value: 1 }, { text: 'Perto', value: 2 }, { text: 'Longe', value: 3 }],
             prioridades: [{ text: 'Selecione', value: null },{ text: 'Alta', value: 1}, { text: 'Média', value: 2 }, { text: 'Baixa', value: 3 }],
        }
    },
    methods: {
        async loadTasks() {
            const waiting = await axios.get(`${baseApiUrl}/query-waiting-dailys/${JSON.parse(localStorage.getItem(userKey)).id}`)
            this.Task.dailyId = waiting.data.id
            const url = await axios.get(`${baseApiUrl}/query-waiting-tasks/${waiting.data.id}`)
            axios.get(url).then(res => {
                this.Task.dailyId = waiting.data.id
                this.Tasks = JSON.parse(res.data)
                this.Tasks = res.data.map(Task => {
                    return { ...Task, value: Task.id, text: '' }
                })
            })
        },
        reset() {
            this.mode = 'save'
            this.Task = { status: 'aguardando'}
            this.selectedLoc = null
            this.selectedPri = null
            this.loadTasks()
        },
        save() {
            this.Task.prioridade = this.selectedPri
            this.Task.localizacao = this.selectedLoc
            const method = this.Task.id ? 'put' : 'post'
            const id = this.Task.id ? `/${this.Task.id}` : ''
            axios[method](`${baseApiUrl}/tasks${id}`, this.Task)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.Task.id
            axios.delete(`${baseApiUrl}/Tasks/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadTaskss(Task, mode = 'save') {
            this.mode = mode
            this.Task = { ...Task }
        }
    },
    mounted() {
        this.loadTasks()
    }
}
</script>

<style>

</style>