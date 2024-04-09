export default{
    state:{
        username:"",
        userId:0,
        avatarSrc:"",
        type:"",
        token:"",
    },
    mutations:{
        removeUser(state){
            state.username="";
            state.userId="";
            state.password="";
            state.token=""
        },
        loginUser(state,data){
            console.log("loginUser",data)
            state.username=data.userName;
            state.userId=data.id;
            state.avatarSrc=data.avatarSrc;
            state.type=data.type
        },
        removeToken(state){
            state.token=""
        },
        setToken(state,token){
            console.log("设置token",token)
            state.token=token
        },
        updatedAvatarSrc(state,data) {
            state.avatarSrc=data
            localStorage.setItem("avatarSrc",data)
            
            
        },
    }
}