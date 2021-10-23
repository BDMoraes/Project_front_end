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
               <b-form-input v-model="Task.entrega" required type="time" placeholder="" :readonly="mode === 'remove'"></b-form-input>
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
                <b-button variant="warning" @click="loadTask(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadTask(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <hr>
        <b-button v-if="this.Tasks.length >= 3" variant="danger" class="ml-2" @click="gerar">Gerar diário</b-button>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  titulo: "TasksAdmin",
  components: { PageTitle },
  data: function() {
    return {
      mode: "save",
      daily: {},
      Task: {
        status: "aguardando",
      },
      Tasks: [],
      fields: [
        { key: "titulo", label: "Titulo" },
        { key: "descricao", label: "Descricao" },
        {
          key: "localizacao",
          label: "Localização",
          sortable: true,
          formatter: "formatLocalizacao",
        },
        {
          key: "prioridade",
          label: "Prioridade",
          sortable: true,
          formatter: "formatPrioridade",
        },
        { key: "entrega", label: "Entrega", formatter: "formatHora" },
        { key: "actions", label: "Ações" },
      ],
      selectedLoc: null,
      selectedPri: null,
      locais: [
        { text: "Selecione", value: null },
        { text: "Atual", value: 1 },
        { text: "Perto", value: 2 },
        { text: "Longe", value: 3 },
      ],
      prioridades: [
        { text: "Selecione", value: null },
        { text: "Alta", value: 1 },
        { text: "Média", value: 2 },
        { text: "Baixa", value: 3 },
      ],
    };
  },
  methods: {
    async loadTasks() {
      const waiting = await axios.get(
        `${baseApiUrl}/query-waiting-dailys/${
          JSON.parse(localStorage.getItem(userKey)).id
        }`
      );
      this.Task.dailyId = waiting.data.id;
      this.daily.id = waiting.data.id;
      this.daily.titulo = waiting.data.titulo;
      await axios
        .get(`${baseApiUrl}/query-waiting-tasks/${waiting.data.id}`)
        .then((res) => {
          this.Task.dailyId = waiting.data.id;
          this.Tasks = res.data;
        });
    },
    reset() {
      this.mode = "save";
      this.Task = { status: "aguardando" };
      this.selectedLoc = null;
      this.selectedPri = null;
      this.loadTasks();
    },
    save() {
      this.Task.prioridade = this.selectedPri;
      this.Task.localizacao = this.selectedLoc;
      const method = this.Task.id ? "put" : "post";
      const id = this.Task.id ? `/${this.Task.id}` : "";
      axios[method](`${baseApiUrl}/tasks${id}`, this.Task)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.Task.id;
      axios
        .delete(`${baseApiUrl}/tasks/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadTask(Task, mode = "save") {
      this.mode = mode;
      this.Task = { ...Task };
      this.Task.entrega = this.formatHora(this.Task.entrega);
      this.selectedLoc = this.Task.localizacao;
      this.selectedPri = this.Task.prioridade;
      if (this.Task.entrega.length < 5) {
        this.Task.entrega = "0" + this.Task.entrega;
      }
    },
    formatPrioridade(value) {
      if (value === 1) {
        return "Alta";
      } else if (value === 2) {
        return "Média";
      } else {
        return "Baixa";
      }
    },
    formatLocalizacao(value) {
      if (value === 1) {
        return "Atual";
      } else if (value === 2) {
        return "Perto";
      } else {
        return "Longe";
      }
    },
    formatHora(value) {
      let hora = value + "";
      let horaCerta = hora.replace(".", ":");
      return horaCerta;
    },
    async gerar() {
      this.daily.userId = JSON.parse(localStorage.getItem(userKey)).id;
      this.daily.status = "andamento";
      await axios.put(`${baseApiUrl}/updateTasks/${this.daily.id}`);
      await axios.put(`${baseApiUrl}/dailys/${this.daily.id}`, this.daily);
      await axios
        .post(`${baseApiUrl}/normalizies/${this.daily.id}`)
        .then(() => {
          this.$toasted.global.organizerSuccess();
          this.$router.push({ path: "toDoList" });
        })
        .catch(showError);
    },
  },
  mounted() {
    this.loadTasks();
  },
};
</script>

<style>
</style>
