<template>
    <div class="pwd-box">
        <div class="pwd-head">
            <p>修改密码</p>
        </div>
        <div class="pwd-main">
            <div class="password">
                <div class="cipher">
                    <p class="tip">旧密码:</p>
                    <input autocomplete="new-password" v-model="oldCipher" class="ipts" type="password" placeholder="请输入旧密码">
                    <p class="too" v-if="flag1">
                        <img src="http://p8lzo644o.bkt.clouddn.com/hint_icon.png"/>
                        原密码错误
                    </p>
                </div>
                <div class="cipher">
                    <p class="tip">新密码:</p>
                    <input v-model="newCipher" class="ipts" type="password" placeholder="6位数字新密码">
                    <p class="too" v-if="flag2">
                        <img src="http://p8lzo644o.bkt.clouddn.com/hint_icon.png"/>
                        请输入6位数字密码
                    </p>
                </div>
                <div class="cipher">
                    <p class="tip">确认新密码:</p>
                    <input v-model="pwd" class="ipts" type="password" placeholder="再次输入新密码">
                    <p class="too" v-if="flag3">
                        <img src="http://p8lzo644o.bkt.clouddn.com/hint_icon.png"/>
                        两次新密码输入不一致
                    </p>
                </div>
                <div class="button">
                    <button class="btn" @click="submitForm">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import hex_md5 from 'js-md5'
    import localhost from '../../util/localhost'
    import $ from 'jQuery'
    export default {
        name: "password",
        data() {
            return {
                oldCipher: '',
                newCipher: '',
                pwd: '',
                flag1: false,
                flag2: false,
                flag3: false
            };
        },
        mounted() {
            this.upToTop()
        },
        methods: {
            submitForm() {
                if(this.oldCipher.length < 1) {
                    this.flag1 = true;
                } else if (this.newCipher.length < 1 || this.newCipher.length < 6) {
                    this.flag1 = false
                    this.flag2 = true
                } else if (this.pwd.length < 1 || this.pwd !== this.newCipher) {
                    this.flag2 = false
                    this.flag3 = true
                } else {
                    let modifyPwd = {
                        originPwd: hex_md5(this.oldCipher).toUpperCase(),
                        newPwd: hex_md5(this.newCipher).toUpperCase(),
                        confirmPwd: hex_md5(this.pwd).toUpperCase()
                    }
                    $.ajax({
                        type: "post",
                        url: localhost + "backstage/user/modifyPwd",
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        xhrFields:{withCredentials:true},
                        data: JSON.stringify(modifyPwd),
                        success: (data) => {
                            let code = data.code
                            if (code === '202') {
                                this.flag3 = false
                                this.$message.error(data.msg)
                            } else if (code === '200') {
                                this.$message.success(data.msg)
                                this.flag3 = false
                                setTimeout(() => {
                                    this.$router.replace('/login')
                                    localStorage.setItem('id', '')
                                    localStorage.setItem('token', '')
                                }, 3000)
                            }
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .pwd-box{
        width: 70%;
        height: 70%;
        background: #ffffff;
        margin: 5% auto;
        border-radius: 10px;
        box-shadow: 0 0 20px #D1D1D1;
        .pwd-head{
            width: 100%;
            height: 60px;
            border-bottom: 1px solid #eeeeee;
            display: -webkit-flex;
            align-items: center;
            p{
                height: 25px;
                line-height: 25px;
                border-left: 3px solid #02B3ED;
                margin-left: 20px;
                padding-left: 10px;
                font-size: 17px;
                color: #666666;
            }
        }
    }
    .pwd-main{
        position: relative;
        width: 100%;
        height: 400px;
    }
    .password{
        width: 650px;
        height: 320px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .cipher{
            height: 80px;
            display: -webkit-flex;
            align-items: center;
            .tip{
                width: 100px;
                display: -webkit-flex;
                justify-content: flex-end;
                margin-right: 20px;
                font-size: 16px;
                color: #666666;
            }
            .ipts{
                width: 300px;
                height: 50px;
                border-radius: 5px;
                border: 1px solid #ccc;
                outline: none;
                padding-left: 20px;
                font-size: 16px;
                color: #666666;
                
            }
            input::input-placeholder{
                color:#dddddd;
            }
            input::-webkit-input-placeholder{ 
                color: #dddddd; 
            } 
            input:-moz-placeholder{ 
                color: #dddddd; 
            } 
            input::-moz-placeholder{ 
                color: #dddddd; 
            } 
            input:-ms-input-placeholder { 
                color: #dddddd; 
            } 
            .too{
                height: 40px;
                line-height: 40px;
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
            height: 80px;
            display: -webkit-flex;
            align-items: center;
            margin-left: 120px;
            .btn{
                width: 320px;
                height: 50px;
                font-size: 18px;
                display: -webkit-flex;
                justify-content: center;
                align-items: center;
                background: #02B3ED;
                border: none;
                color: #ffffff;
                border-radius: 5px;
                outline: none;
                cursor: pointer;
            }
        }
    }
</style>
