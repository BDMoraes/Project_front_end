<template>
    <aside id="menu" v-show="isMenuVisible">
        <nav>
            <div>
                <a id="link-1" href="#">
                  <router-link to="/admin">Diários</router-link>
                </a>
            </div>
             <div>
                <a id="link-1" href="#">
                  <router-link to="/">Relatórios</router-link>
                </a>
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
        justify-content: flex-start;
        align-items: center;
        font-size: 25px;
        text-decoration: none;
        border: 2px red;
    } 
    #menu a {
        text-decoration: none;
        border: 2px red solid;
    } 
    
</style>
