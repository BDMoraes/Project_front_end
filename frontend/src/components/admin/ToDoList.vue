<template>
    <div class="user-admin">
        <PageTitle icon="fa fa-clipboard" main="Lista de tarefas"
            sub="Acompanhe e conclua as tarefas do seu diário" />
            <b-list-group>
                <div v-for="(task, index) in tasks" :key="task.id">
                    <b-list-group-item class="task-cards"> 
                      <div id="classification"> {{ index + 1 }} º </div> 
                        <div class="task-texts" >
                            <div id="divt"> {{ task.titulo }} </div> 
                            <div id="divd"> {{ task.descricao }} </div> 
                            <div id="dive"> {{ task.entrega }} </div>
                        </div>
                        <hr>
                        <div>
                             <b-button variant="success" @click="concluir(task)" size="md">
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
      num: { v: 0 },
    };
  },
  methods: {
    async loadTasks() {
      const waiting = await axios.get(
        `${baseApiUrl}/query-running-dailys/${
          JSON.parse(localStorage.getItem(userKey)).id
        }`
      );

      if (waiting.data.length === 0) {
        this.$router.push({ path: "adminPages" });
      }

      this.daily.id = waiting.data.id;
      this.daily.data = waiting.data.data;

      await axios
        .get(`${baseApiUrl}/query-organized-tasks/${this.daily.id}`)
        .then((res) => {
          this.tasks = res.data;
          for (let index = 0; index < res.data.length; index++) {
            this.tasks[index].entrega = this.formatHora(
              this.tasks[index].entrega
            );
          }
        })
        .catch(showError);
    },
    formatHora(value) {
      let hora = value + "";
      let horaCerta = hora.replace(".", ":");
      return horaCerta;
    },
    getNum() {
      this.num.v = this.num.v + 1;
      return this.num.v;
    },
    async concluir(task) {
      const flag = { v: true };
      const data = new Date();
      let hora = data.getHours() + "." + data.getMinutes();
      hora = parseFloat(hora);
      task.finalizacao = hora;

      const dia = data.getDate();
      const mes = data.getMonth();
      const dataTask = parseFloat(dia + "." + mes);

      if (hora > parseFloat(task.entrega) || dataTask > this.daily.data) {
        task.noPrazo = 0;
      } else {
        task.noPrazo = 1;
      }

      const finalize = await axios.put(
        `${baseApiUrl}/finalizeTasks/${this.daily.id}`,
        task
      );

      this.$toasted.global.taskSuccess();

      if (finalize.data) {
        this.$toasted.global.dailySuccess();
        flag.v = false;
      }

      this.tasks = this.tasks.filter(function(obj) {
        return obj.id !== task.id;
      });

      if (!flag.v) {
        this.$router.push({ path: "adminPages" });
      } else {
        this.loadTasks();
      }
    },
  },
  mounted() {
    this.loadTasks();
  },
};
</script>

<style>
.task-cards {
  background-color: rgba(80, 162, 238, 0.377);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 7px;
  font-size: 18px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
}
.task-texts {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.task-texts div {
  margin-right: 10px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
#classification {
  margin-bottom: 40px;
  font-size: 20px;
}

#divt {
  background-color: rgb(95, 148, 218);
}
#divd {
  background-color: rgb(203, 224, 82);
}
#dive {
  background-color: rgb(219, 156, 84);
}
</style>
