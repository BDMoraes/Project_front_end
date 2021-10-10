<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="Administração de Diário"
            sub="Administre seus diários e tarefas" />
        <div class="admin-pages-tabs">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Diário" active>
                        <DailyAdmin />
                    </b-tab>
                    <!-- <b-tab title="Tarefas">
                        <TasksAdmin />
                    </b-tab> -->
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import DailyAdmin from './DailyAdmin'
import TasksAdmin from './TasksAdmin'

export default {
    name: 'AdminPages',
    components: { PageTitle, DailyAdmin, TasksAdmin}
}
</script>

<style>

</style>
