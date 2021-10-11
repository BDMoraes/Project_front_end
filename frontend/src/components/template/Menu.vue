<template>
    <aside id="menu" v-show="isMenuVisible">
        <nav>
            <div id="div">
                <div id="link">
                    <a href="#">
                        <router-link to="/admin">Diários</router-link>
                    </a>
                </div>
            </div>
             <div id="div">
                 <div id="link">
                    <a href="#">
                        <router-link to="/">Relatórios</router-link>
                    </a>
                 </div>
            </div>
        </nav>
    </aside>
</template>

<script>
import { mapState } from 'vuex'
import Tree from 'liquor-tree'
import { baseApiUrl } from '@/global'
import axios from 'axios'

export default {
    name: 'Menu',
    components: { Tree },
    computed: mapState(['isMenuVisible']),
    data: function() {
        return {
            treeFilter: '',
            treeData: this.getTreeData(),
            treeOptions: {
                propertyNames: { 'text': 'name' },
                filter: { emptyText: 'Categoria não encontrada' }
            }
        }
    },
    methods: {
        getTreeData() {
            const url = `${baseApiUrl}/categories/tree`
            return axios.get(url).then(res => res.data)
        },
        onNodeSelect(node) {
            this.$router.push({
                name: 'articlesByCategory',
                params: { id: node.id }
            })

            if(this.$mq === 'xs' || this.$mq === 'sm') {
                this.$store.commit('toggleMenu', false)
            }
        }
    },
    mounted() {
        this.$refs.tree.$on('node:selected', this.onNodeSelect)
    }
}
</script>

<style>
    #menu {
        display: flex;
        flex-direction: column;
        background: linear-gradient(to right, #232526, #414345);
        justify-content: initial;
        align-items: initial;
        font-size: 25px;
    }
    #menu div {
        flex-wrap: wrap;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }  
    #menu a {
        color: rgb(213, 230, 230);
        text-decoration: none;
    }
     #div:hover {
        text-decoration: none;
        background-color: rgba(90, 88, 88, 0.87);
    }
    #link {
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
