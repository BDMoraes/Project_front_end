<template>
    <div>
        <PageTitle icon="fa fa-folder" main="Dashboard"
            sub="Relatórios de diários concluídos" />
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
                        </div>
                        <hr>
                        <div>
                             <b-button variant="info" @click="load(daily)" size="sm">
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
      dailys: [],
      tasks: {
        noPrazo: 0,
        foraPrazo: 0,
        total: 0,
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
      for (let index = 0; index < t_data.data.length; index++) {
        if (t_data.data[index].noPrazo === 1) {
          this.tasks.noPrazo++;
        } else {
          this.tasks.foraPrazo++;
        }
      }
    },
    reset() {
      this.tasks.noPrazo = 0;
      this.tasks.foraPrazo = 0;
      this.tasks.total = 0;
    },
    formatData(value) {
      let data = value + "";
      let dataCerta = data.replace(".", "/");
      if (dataCerta.substring(4, 5) === "0") {
        let sub = parseInt(dataCerta.substring(3, 4)) + 1;
        dataCerta = dataCerta.substring(0, 3) + '' + sub;
      }else{
        let sub = parseInt(dataCerta.substring(3, 5)) + 1;
        dataCerta = dataCerta.substring(0, 3) + '' + sub;
      }

      return dataCerta;
    },
  },
  mounted() {
    this.getStats();
  },
};
</script>

<style>
.task-cards {
  background-color: rgba(191, 206, 243, 0.671);
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

#total-layout {
  background-color: rgba(19, 57, 228, 0.835);
}
#noPrazo-layout {
  background-color: rgba(19, 228, 54, 0.835);
}
#foraPrazo-layout {
  background-color: rgba(228, 43, 19, 0.835);
}
</style>
