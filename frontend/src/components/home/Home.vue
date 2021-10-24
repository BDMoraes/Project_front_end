<template>
    <div>
        <PageTitle icon="fa fa-folder" main="Dashboard"
            sub="Relatórios de diários concluídos" />
            <b-list-group>
                <div v-for="daily in dailys" :key="daily.id">
                    <b-list-group-item class="task-cards"> 
                        <div>
                            <div> {{ daily.titulo }} </div> 
                        </div>
                        <hr>
                        <div>
                             <b-button variant="info" @click="load()" size="sm">
                                Expandir
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
    };
  },
  methods: {
    async getStats() {
      const data = await axios.get(
        `${baseApiUrl}/query-complete-dailys/${
          JSON.parse(localStorage.getItem(userKey)).id
        }`
      );
      this.dailys = data.data;
    },
    load() {},
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
</style>
