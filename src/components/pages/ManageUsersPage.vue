<template>
    <div class="container">
        <div class="col-8">
            <page-title class="title" :text="$t('manage_users_page_admins_title')"></page-title>
            <user-list
                :users="admins"
                :refresh="getData" 
                :style="noAdminResultsStyle"
                :noResultsMessage="noAdminResultsMessage"
                :shouldShowNoResultsMessage="true">
            </user-list>
        </div>
        <div class="col-4">
            <base-input :label="$t('manage_users_page_search_users_input_label')" class="search-bar" v-model="enteredQuery" :onChange="getUsers"></base-input>
            <user-list
                :users="users"
                :refresh="getData" 
                :style="noUserResultsStyle"
                :noResultsMessage="noUserResultsMessage"
                :shouldShowNoResultsMessage="enteredQuery.length > 0">
            </user-list>
        </div>
    </div>
</template>

<script>
import UserList from "../users/UserList.vue";
import network from "../../network/network.js";
import "./../../local-storage-helper.js";
import PageTitle from "../base/PageTitle.vue";

export default {
    components: {
        UserList,
        PageTitle
    },
    data() {
        return {
            admins: [],
            users: [],
            enteredQuery: "",
            noAdminResultsMessage: "",
            noAdminResultsError: false,
            noUserResultsMessage: "",
            noUserResultsError: false,
        }
    },
    computed: {
        noAdminResultsStyle() {
            return this.noAdminResultsError ? "error" : ""
        },
        noUserResultsStyle() {
            return this.noUserResultsError ? "error" : ""
        },
    },
    methods: {
        getAdmins() {
            network.searchUsers({
                queryParams: {
                    isAdmin: "yes",
                    excludeMe: "no"
                },
                onSuccess: admins => {
                    let adminIds = admins.map((admin) => {
                        return admin.id;
                    });
                    if (adminIds.includes(localStorage.user().id) == false) {
                        this.$router.push({ name: "home" });
                    } else {
                        this.admins = admins
                        this.noAdminResultsMessage = this.$t('manage_users_page_admins_no_results_message');
                        this.noAdminResultsError = false;
                    }
                },
                onFailure: () => {
                    this.admins = [];
                    this.noAdminResultsMessage = this.$t('manage_users_page_admins_error_message');
                    this.noAdminResultsError = true;
                }
            })
        },
        getUsers() {
            if (this.enteredQuery === "") {
                this.users = [];
                return
            }
            network.searchUsers({
                queryParams: {
                    query: this.enteredQuery,
                    start: 0,
                    end: 50,
                    isAdmin: "no",
                    excludeMe: "no"
                },
                onSuccess: users => {
                    this.users = users;
                    this.noUserResultsMessage = this.$t('manage_users_page_users_no_results_message');
                    this.noUserResultsError = false;
                },
                onFailure: () => {
                    this.users = [];
                    this.noUserResultsMessage =this.$t(' manage_users_page_users_error_message');
                    this.noUserResultsError = true;
                }
            })
        },
        getData() {
            this.getAdmins()
            this.getUsers()
        }
    },
    mounted() {
        if (localStorage.isLoggedIn()) {
            this.getData();
        } else {
            this.$router.push({ name: "login" });
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    column-gap: calc(var(--default-spacing)*2);
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.title {
    margin-bottom: var(--default-spacing);
}
h3 {
    text-align: center;
}
.search-bar {
    margin: var(--default-spacing);
}
@media only screen and (max-width: 768px) {
    .container {
        flex-direction: column;
    }
}
</style>