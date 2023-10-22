import { defineStore } from 'pinia'

export const useUserStore = defineStore({
    id: 'User',
    state: () => ({
        UserID: 0,
        UserName: "",
        Ruolo: 0 // 1 = admin; 2 = user
    }),
    getters: {
        GetUserID(state) { return state.UserID},
        GetRuolo(state) {return state.Ruolo},
        LoggedIn(state) {return state.UserID !== 0},
    },
    actions: {
        async register(UserId, Username, ruolo) {
            this.UserID = UserId;
            this.Ruolo = ruolo;
            this.UserName = Username;
        },
        async UnRegister(){
            this.UserID = 0;
            this.UserName = "";
            this.Ruolo = 0;
        }
    },
})