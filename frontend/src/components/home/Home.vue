<template>
    <div>
        <PageTitle icon="fa fa-folder" main="Painel de relatórios"
            sub="Relatórios de diários concluídos" />
            <div v-if="this.empty === true" class="empty-report"> 
                <h4> Você ainda não tem diários concluídos! </h4>
            </div> 
            <b-list-group>
                <div v-for="daily in dailys" :key="daily.id">
                    <b-list-group-item class="task-cards"> 
                        <div>
                            <div> 
                              <h4> {{ daily.titulo }} - {{ daily.data }} </h4>
                            </div> 
                        </div>
                        <div class="task-stats" v-if="mostrar === daily.id">
                            <div id="total-layout"> Total de tarefas do diário: {{ tasks.total }} </div> 
                            <div id="noPrazo-layout"> Total de tarefas no prazo: {{ tasks.noPrazo }} </div>
                            <div id="foraPrazo-layout"> Total de tarefas fora do prazo: {{ tasks.foraPrazo }} </div>
                            <div>
                              {{ tasks.prod }} % de produtividade
                            </div>
                             <div v-for="ttask in Ttasks" :key="ttask.id">
                              Tarefa: {{ ttask.titulo }} / Previsão: {{ formatHora(ttask.entrega) }} / Iniciada: {{ formatHora(ttask.inicializacao) }} - Finalizada: {{ formatHora(ttask.finalizacao) }}
                              <div id="horario"> Tempo executando: {{ calculaTempo(ttask) }}</div> 
                            </div>
                        </div>
                        <hr>
                        <div>
                             <b-button variant="info" @click="load(daily)">
                                Detalhar
                             </b-button>
                        </div> 
                    </b-list-group-item> 
                </div>
            </b-list-group>
    </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import axios from "axios";
import { baseApiUrl, userKey } from "@/global";

export default {
  name: "Home",
  components: { PageTitle },
  data: function() {
    return {
      empty: false,
      Ttasks: [],
      dailys: [],
      tasks: {
        noPrazo: 0,
        foraPrazo: 0,
        total: 0,
        prod: 0,
      },
      mostrar: 0,
      id_user: 0,
    };
  },
  methods: {
    async getStats() {
      this.id_user = JSON.parse(localStorage.getItem(userKey)).id;

      const d_data = await axios.get(
        `${baseApiUrl}/query-complete-dailys/${this.id_user}`
      );
      this.dailys = d_data.data;

      if (d_data.data.length === 0) {
        this.empty = true;
      }

      for (let index = 0; index < d_data.data.length; index++) {
        d_data.data[index].data = this.formatData(d_data.data[index].data);
      }
    },
    async load(daily) {
      this.mostrar = daily.id;

      this.reset();

      const t_data = await axios.get(
        `${baseApiUrl}/query-complete-tasks/${daily.id}`
      );
      this.tasks.total = t_data.data.length;
      this.Ttasks = t_data.data;
      for (let index = 0; index < t_data.data.length; index++) {
        if (t_data.data[index].noPrazo === 1) {
          this.tasks.noPrazo++;
        } else {
          this.tasks.foraPrazo++;
        }
      }
      this.tasks.prod = ((this.tasks.noPrazo * 100) / this.tasks.total).toFixed(
        2
      );
    },
    reset() {
      this.tasks.noPrazo = 0;
      this.tasks.foraPrazo = 0;
      this.tasks.total = 0;
      this.tasks.prod = 0;
      this.Ttasks = [];
    },
    formatData(value) {
      let data = value + "";
      let dataCerta = data.replace(".", "/");
      return dataCerta;
    },
    formatHora(value) {
      let hora = value + "";
      let horaCerta = hora.replace(".", ":");
      return horaCerta;
    },
    calculaTempo(ttask) {
      let multi_dias = parseInt(ttask.diaFinalizacao - ttask.diaInicializacao);
      if (multi_dias === 0) {
        multi_dias = " ";
      } else {
        multi_dias = multi_dias + " dias";
      }
      let value = this.calculaTempoX(ttask);
      if (value != -1) {
        value = value + "";
      } else {
        value = "";
      }
      let horaCerta = multi_dias + "" + value;
      return horaCerta;
    },
    calculaTempoX(ttask) {
      let v1 = ttask.inicializacao;
      let v2 = ttask.finalizacao;
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
      let h = p1_2 * 60 + parseInt(p2_2) - (p1_1 * 60 + parseInt(p2_1));
      if (h < 0) {
        return -1;
      } else {
        return this.NumToTime(h);
      }
    },
    NumToTime(num) {
      var hours = Math.floor(num / 60);
      var minutes = num % 60;
      if (minutes + "".length < 2) {
        minutes = "0" + minutes;
      }
      return hours + " h : " + minutes + " m";
    },
  },
  mounted() {
    this.getStats();
  },
};
</script>

<style>
.task-cards {
  background-color: rgba(46, 140, 228, 0.445);
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
.task-stats {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 18px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
}
.task-stats div {
  margin-top: 10px;
  padding: 7px;
  border-radius: 10px 40px 40px 10px;
}

.empty-report {
  font-style: italic;
}

#total-layout {
  background-color: rgba(19, 57, 228, 0.835);
}
#noPrazo-layout {
  background-color: rgba(19, 228, 54, 0.835);
}
#foraPrazo-layout {
  background-color: rgba(228, 43, 19, 0.835);
}
#horario {
  background-color: rgba(18, 209, 243, 0.835);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
