export default {
    state: {
        userName: "",
        userId: 0,
        avatarSrc: "",
        userType: "",
        token: "",
    },
    mutations: {
        removeUser(state) {
            state.username = "";
            state.userId = "";
            state.password = "";
            state.token = ""
        },
        loginUser(state, data) {
            console.log("loginUser", data)
            state.userName = data.userName;
            state.userId = data.userId;
            // state.avatarSrc = data.avatarSrc;
            state.userType = data.userType
        },
        getUserId(state) {
            return state.id
        },
        removeToken(state) {
            state.token = ""
        },
        setToken(state, token) {
            console.log("设置token", token)
            state.token = token
        },
        updatedAvatarSrc(state, data) {
            state.avatarSrc = data
            localStorage.setItem("avatarSrc", data)


        },
    }
}