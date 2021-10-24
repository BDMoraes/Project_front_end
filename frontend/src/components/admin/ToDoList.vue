<template>
    <div class="user-admin">
        <PageTitle icon="fa fa-clipboard" main="Lista de tarefas"
            sub="Acompanhe e conclua as tarefas do seu diário" />
            <b-list-group>
                <div v-for="task in tasks" :key="task.id">
                    <b-list-group-item> 
                        <div>
                            {{ task.titulo }} - {{ task.descricao }} - {{ task.entrega }}
                        </div>
                        <hr>
                        <div>
                             <b-button variant="outline-info" @click="concluir(task)" size="sm">
                                <i class="fa fa-check"></i>
                             </b-button>
                        </div> 
                    </b-list-group-item> 
                </div>
            </b-list-group>
        <hr>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  nome: "To Do List",
  components: { PageTitle },
  data: function() {
    return {
      tasks: [],
      daily: {},
    };
  },
  methods: {
    async loadTasks() {
      const waiting = await axios.get(
        `${baseApiUrl}/query-running-dailys/${
          JSON.parse(localStorage.getItem(userKey)).id
        }`
      );

      if (!waiting) {
        this.$router.push({ path: "adminPages" });
      }
      this.daily.id = waiting.data.id;

      await axios
        .get(`${baseApiUrl}/query-ordanized-tasks/${this.daily.id}`)
        .then((res) => {
          this.tasks = res.data;
        })
        .catch(showError);
    },
    formatHora(value) {
      let hora = value + "";
      let horaCerta = hora.replace(".", ":");
      return horaCerta;
    },

    async concluir(task) {
      const data = new Date();
      let hora = data.getHours() + "." + data.getMinutes();
      hora = parseFloat(hora);

      if (hora > parseFloat(task.entrega)) {
        task.noPrazo = 0;
      } else {
        task.noPrazo = 1;
      }

      const finalize = await axios.put(
        `${baseApiUrl}/finalizeTasks/${this.daily.id}`,
        task
      );

      if (finalize.data.id) {
        this.$toasted.global.dailySuccess();
      }

      this.$toasted.global.taskSuccess();
    },
  },
  mounted() {
    this.loadTasks();
  },
};
</script>

<style>
</style>
