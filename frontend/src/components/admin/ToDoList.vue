<template>
    <div class="user-admin">
        <PageTitle icon="fa fa-clipboard" main="Lista de tarefas"
            sub="Acompanhe e conclua as tarefas do seu diário" />
            <div v-if="this.empty === true" class="empty-report"> 
                <h4> Parabéns, diário concluído!!! Clique novamente no menu "Diários" para iniciar uma nova jornada. </h4>
            </div> 
            <b-list-group>
                <div v-for="(task, index) in tasks" :key="task.id">
                    <b-list-group-item class="task-cards"> 
                      <div id="classification"> {{ index + 1 }} º</div> <div id="warning" v-if="verify(task) === 0">Atenção com a entrega desta tarefa!</div>
                        <div class="task-texts" >
                            <div id="divt"> {{ task.titulo }} </div> 
                            <div id="divd"> {{ task.descricao }} </div> 
                            <div id="dive"> {{ task.entrega }} </div>
                        </div>
                        <hr>
                        <div>
                             <b-button id="initBt" variant="primary" @click="iniciar(task)" size="md">
                                iniciar
                             </b-button>
                             <b-button variant="success" @click="concluir(task)" size="md">
                                concluir
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
      empty: false,
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
        this.empty = true;
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
      const init = await axios.get(`${baseApiUrl}/tasks/${task.id}`);

      if (init.data.inicializacao != null) {
        const flag = { v: true };
        const data = new Date();
        if (data.getMinutes() / 10 < 1) {
          let hora = data.getHours() + ".0" + data.getMinutes();
          hora = parseFloat(hora).toFixed(2);
          task.finalizacao = hora;
        } else {
          let hora = data.getHours() + "." + data.getMinutes();
          hora = parseFloat(hora).toFixed(2);
          task.finalizacao = hora;
        }

        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const dataTask = parseFloat(dia + "." + mes).toFixed(2);

        task.diaFinalizacao = dataTask;
        const param1 = parseFloat(task.entrega.replace(":", "."));
        const param2 = parseFloat(task.finalizacao.replace(".", "."));
        if (param1 - param2 >= 0 && this.compara(this.daily.data, dataTask)) {
          task.noPrazo = 1;
        } else {
          task.noPrazo = 0;
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
          this.empty = true;
        } else {
          this.loadTasks();
        }
      } else {
        this.$toasted.global.noInitTask();
      }
    },
    async iniciar(task) {
      const init = await axios.get(`${baseApiUrl}/tasks/${task.id}`);

      if (init.data.inicializacao != null) {
        this.$toasted.global.yetInitTask();
      } else {
        const data_ini = new Date();
        if (data_ini.getMinutes() / 10 < 1) {
          let hora = data_ini.getHours() + ".0" + data_ini.getMinutes();
          hora = parseFloat(hora).toFixed(2);
          task.inicializacao = hora;
        } else {
          let hora = data_ini.getHours() + "." + data_ini.getMinutes();
          hora = parseFloat(hora).toFixed(2);
          task.inicializacao = hora;
        }
        const dia = data_ini.getDate();
        const mes = data_ini.getMonth() + 1;
        const dataTask = parseFloat(dia + "." + mes);
        task.diaInicializacao = dataTask;
        await axios.put(`${baseApiUrl}/initTasks/${task.id}`, task);
        this.$toasted.global.initSuccess();
      }
    },
    verify(task) {
      const data_ini = new Date();
      let hora = data_ini.getHours() + "." + data_ini.getMinutes();
      hora = parseFloat(hora);
      const dia = data_ini.getDate();
      const mes = data_ini.getMonth() + 1;
      const dataTask = parseFloat(dia + "." + mes).toFixed(2);
      const param = parseFloat(task.entrega.replace(":", "."));
      if (
        (param - hora).toFixed(2) <= 0.1 ||
        !this.compara(this.daily.data, dataTask)
      ) {
        if (task.sent === null) {
          axios.post(`${baseApiUrl}/sendAlert`, task);
        }
        return 0;
      } else {
        return 1;
      }
    },
    compara(v1, v2) {
      let vs1 = v1 + "";
      let vs2 = v2 + "";
      var pad = "00";

      var n = vs1;
      vs1 = (pad + n).slice(-(pad.length + 3));

      n = vs2;
      vs2 = (pad + n).slice(-(pad.length + 3));

      vs1 = vs1.padEnd(5, "0");
      vs2 = vs2.padEnd(5, "0");

      let p1_1 = vs1.slice(0, vs1.indexOf("."));
      let p1_2 = vs2.slice(0, vs2.indexOf("."));

      let p2_1 = vs1.slice(vs1.indexOf(".") + 1, vs1.length + 1);
      let p2_2 = vs2.slice(vs2.indexOf(".") + 1, vs2.length + 1);

      p2_1 = p2_1.padEnd(2, "0");
      p2_2 = p2_2.padEnd(2, "0");

      if (p1_1 > p1_2) {
        return true;
      } else if (p1_1 === p1_2 && p2_1 >= p2_2) {
        return true;
      } else {
        return false;
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
  font-size: 25px;
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
.empty-report {
  font-style: italic;
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
#initBt {
  margin-right: 40px;
}
#warning {
  margin-bottom: 20px;
  color: rgba(200, 25, 25, 0.911);
}
</style>
