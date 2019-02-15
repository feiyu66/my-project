<template>
    <div class="login">
        <div class="login_box">
            <div class="logo">
                <img src="http://doctor.dlcaring.com/LOG.png" alt="">
            </div>
            <h1>运营管理系统</h1>
            <div class="main">
                <div class="userName cent">
                    <img class="imag" src="http://doctor.dlcaring.com/name_icon.png" alt="">
                    <el-input v-model="username" class="ipt" placeholder="请输入用户名" v-on:input='inputData' clearable></el-input>
                    <p v-if="nameFlag" class="show">
                        <img src="http://doctor.dlcaring.com/hint_icon.png"/>
                        {{useName}}
                    </p>
                </div>
                <div class="password cent">
                    <img class="imag" src="http://doctor.dlcaring.com/password_icon.png" alt="">
                    <el-input  v-model="password" class="ipt" placeholder="请输入密码" type="password" v-on:input='inputData' clearable></el-input>
                    <p v-if="pwdFlag" class="show">
                        <img src="http://doctor.dlcaring.com/hint_icon.png"/>
                        {{pwd}}
                    </p>
                </div>
                <div class="check-box">
                    <el-checkbox v-model="checked">记住我</el-checkbox>
                </div>
                <div class="button">
                    <button class="btn" @click="submitForm" :class="disabledFlag == true ? 'on' : ''">登录</button>
                </div>
            </div>
        </div>
        <div class="foo">
            <p>Copyright@北京动亮健康科技有限公司.All Right Service.</p>
        </div>
    </div>
</template>
<script>
import hex_md5 from 'js-md5'
import localhost from '../../util/localhost'
import $ from 'jQuery'
export default {
    name: "login",
    data() {
        return {
            useName: '请输入用户名',
            pwd: '请输入密码',
            username: '',
            password: '',
            checked: false,
            disabledFlag: false,
            nameFlag: false,
            pwdFlag: false
        };
    },
    created () {
        this.username = localStorage.getItem('phone')
    },
    methods: {
        inputData() {
            let reg = /^[1][3-9][0-9]{9}$/
            if (reg.test(this.username) && this.password.length == '6'){
               this.disabledFlag = true 
            } else {
                this.disabledFlag = false
            }
        },
        submitForm() {
            let reg = /^[1][3-9][0-9]{9}$/
            let obj = {
                'telephone': this.username,
                'password': hex_md5(this.password).toUpperCase()
            }
            if (this.username.length > 0 && this.password.length > 0) {
                $.ajax({
                    type: "post",
                    url: localhost + "backstage/login/user",
                    dataType: "json",
                    xhrFields:{cookie:true},
                    xhrFields:{withCredentials:true},
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(obj),
                    success: (data) => {
                        console.log(data)
                        let code = data.code
                        let msg = data.msg
                        if (code === '200'){
                            this.nameFlag = false
                            this.pwdFlag = false
                            let id = data.data.id
                            let token = data.data.token
                            localStorage.setItem('username', this.username)
                            localStorage.setItem('id', id)
                            localStorage.setItem('token', token)
                            this.$router.replace('/statistics/attribute')
                            if(this.checked) {
                                localStorage.setItem('phone', this.username)
                            } else {
                                localStorage.setItem('phone', '')
                            }
                        } else if (code === '202') {
                            if (msg === '没有此用户') {
                                this.useName = '没有此用户'
                                this.nameFlag = true
                                this.pwdFlag = false
                            } else if (msg === '密码错误') {
                                this.pwd = '密码错误'
                                this.password = ''
                                this.pwdFlag = true
                                this.nameFlag = false
                            } else if (msg == '登录授权过期，请重新登录！') {
                                this.$message.error(msg);
                                this.$router.replace('/login')
                            }
                        } 
                    }
                });
            }
        }
    }
}
</script>
<style lang="less">
    .ipt{
        .el-input__inner{
            color: #333333;
            border: none;
            background-color: #F3F3FB;
            padding: 0;
        }
    }
    
</style>

<style lang="less" scoped>
    .login{
        width: 100%;
        height: 100%;
        background: url(http://doctor.dlcaring.com/login.png) no-repeat;
        background-size: cover;
        background-position: center top;
    }
    .login_box{
        width: 500px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 30px #999999;
        border-radius: 20px;
        background: #F3F3FB;
        .logo{
            width: 100%;
            height: 200px;
            text-align: center;
            img{
                width: 125px;
                height: 125px;
                margin-top: 30px;
            }
        }
        h1{
            text-align: center;
            font-size: 24px;
        }
        .main{
            padding: 30px;
            .cent{
                display: -webkit-flex;
                align-items: center;
                line-height: 50px;
                height: 50px;
                border-bottom: 1px solid #dddddd;
                margin-top: 20px;
                .imag{
                    width: 22px;
                    height: 30px;
                    margin-left: 10px;
                }
                .ipt{
                    width: 240px;
                    height: 100%;
                    border: #F3F3FB;
                    outline: none;
                    background: none;
                    padding-left: 10px;
                    margin-left: 20px;
                    font-size: 19px;
                }
                .show{
                    margin-left: 20px;
                    color: #f75050;
                    font-size: 13px;
                    img{
                        width: 18px;
                        height: 18px;
                        margin-right: 10px;
                        margin-bottom: -4px;
                    }
                }
            }
            .button{
                height: 68px;
                .btn{
                    width: 100%;
                    height: 68px;
                    background: #999999;
                    color: #ffffff;
                    border: none;
                    outline: none;
                    border-radius: 5px;
                    font-size: 28px;
                    cursor: pointer;
                }
                .on{
                    background: #02B3ED;
                }
            }
            .check-box{
                width: 100%;
                height: 40px;
                margin-bottom: 20px;
                text-align: right;
                line-height: 40px;
            }
        }
    }
    .foo{
        position: absolute;
        bottom: 5%;
        width: 100%;
        p{
            text-align: center;
            color: #676767;
        }
    }
</style>
