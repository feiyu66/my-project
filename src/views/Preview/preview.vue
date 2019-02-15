<template>
    <div class="preview">
        <p class="title">文章管理</p>
        <div class="main">
            <div class="head">
                <p class="left">文章预览</p>
                <p class="toBack" @click="toBack">返回</p>
            </div>
            <div class="main-content">
                <div class="imags">
                    <img class="phoneImg" src="http://doctor.dlcaring.com/phoneImg.png" alt="">
                    <div class="box">
                        <div v-if="!nothingFlag">
                            <div class="phone-box">
                                <div class="box-title"><p class="tip">{{title}}</p></div>
                                <div class="dataOrigin">
                                    <p class="data">{{uploadTime.split(' ')[0]}}</p>
                                    <p class="origin">出自：{{origin}}</p>
                                </div>
                                <div class="imageUrl"><img class="imgs" :src="imageUrl + '?x-oss-process=style/dl-m-style'" alt=""></div>
                                <div class="phone-content">
                                    <div class="words" v-html="content"></div>
                                </div>
                            </div>
                            <div class="footer" v-if="questionFlag">
                                <p class="foo" @click="problemData">查看问题</p>
                            </div>
                            <div class="problemBox" v-if="problemFlag">
                                <div class="problemMain">
                                    <div class="close">
                                        <img @click="closeData" class="icon_cancel" src="http://doctor.dlcaring.com/icon_cancel.png" alt="">
                                    </div>
                                    <div class="problem">
                                        <p class="tooltip">请回答</p>
                                        <p class="question">{{questionTitle}}</p>
                                        <div class="answers" v-for="(item, index) in answer" :key='index'>
                                            <img class="uncheck" src="http://doctor.dlcaring.com/uncheck.png" alt="">
                                            <p class="options">{{item.option}}、{{item.answer}}</p>
                                            <img class="icon_right" v-if="item.flag" src="http://doctor.dlcaring.com/icon_right.png" alt="">
                                        </div>
                                    </div>
                                    <p @click="closeData" class="know">知道了</p>
                                </div>
                            </div>
                        </div>
                        <p v-else class="nothing">未查询到此文章！</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jQuery'
    import localhost from '../../util/localhost'
    export default {
        name: 'preview',
        data () {
            return {
                title: '', // 文章题目
                uploadTime: '', // 时间
                origin: '', // 出处
                imageUrl: '', // 图片路径
                content: '<p></p>', // 文章内容
                problemFlag: false, // 问题查看
                questionTitle: '', // 问题题目
                answer: [],
                nothingFlag: false, // 无文章
                questionFlag: true, // 非必读不显示问题
            }
        },
        mounted () {
            let articleId = this.$route.params.id
            $.ajax({
                type: 'get',
                url: localhost + 'backstage/article/' + articleId,
                xhrFields:{withCredentials:true},
                contentType : "application/json; charset=UTF-8",
                dataType: "json",
                headers: {
                    // 'Login_Authorization': localStorage.getItem('token'),
                    // 'User_Id': localStorage.getItem('id')
                },
                success: data => {
                    console.log(data)
                    if (data.code == 200) {
                        if (data.data.plate == '必读') {
                            this.questionFlag = true
                            this.questionTitle = data.data.question.title
                            let questionAnswer = data.data.question
                            let obj = {}
                            obj.answer = questionAnswer.answerA
                            obj.option = 'A'
                            obj.flag = false
                            this.answer.push(obj)
                            let obj2 = {}
                            obj2.answer = questionAnswer.answerB
                            obj2.option = 'B'
                            obj2.flag = false
                            this.answer.push(obj2)
                            let obj3 = {}
                            obj3.answer = questionAnswer.answerC
                            obj3.option = 'C'
                            obj3.flag = false
                            this.answer.push(obj3)
                            let obj4 = {}
                            obj4.answer = questionAnswer.answerD
                            obj4.option = 'D'
                            obj4.flag = false
                            this.answer.push(obj4)
                            this.answer[questionAnswer.rightKey - 1].flag = true
                        } else {
                            this.questionFlag = false
                        }
                        this.nothingFlag = false
                        this.title = data.data.title
                        this.uploadTime = data.data.uploadTime
                        this.origin = data.data.origin
                        this.imageUrl = data.data.imageUrl
                        this.content = data.data.content
                    } else {
                        this.nothingFlag = true
                    }
                }
            })
        },
        methods: {
            problemData () {
                this.problemFlag = true
            },
            closeData () {
                this.problemFlag = false
            },
            toBack () {
                this.$router.replace('/patient-content/contentManagement')
            }
        }
    }
</script>
<style lang="less" scoped>
.wscnph{
        width: 300px;
        height: 200px;
    }
    .preview{
        padding: 30px;
        .title{
            margin-bottom: 20px;
            font-size: 14px;
            color: rgb(102, 102, 102)
        }
        .main{
            background-color: #ffffff;
            border-radius: 10px;
            display: -webkit-flex;
            flex-direction: column;
            .head{
                width: 100%;
                height: 50px;
                border-bottom: 1px solid #eeeeee;
                display: -webkit-flex;
                align-items: center;
                justify-content: space-between;
                .left{
                    height: 25px;
                    line-height: 25px;
                    border-left: 3px solid #02B3ED;
                    margin-left: 20px;
                    padding-left: 10px;
                }
                .toBack{
                    cursor: pointer;
                    margin-right: 20px;
                    width: 80px;
                    height: 35px;
                    font-size: 14px;
                    text-align: center;
                    line-height: 35px;
                    background: rgb(2, 179, 237);
                    color: #ffffff;
                    border-radius: 25px;
                }
            }
            .main-content{
                display: -webkit-flex;
                justify-content: center;
                align-items: center;
                .imags{
                    width: 360px;
                    height: 700px;
                    margin-top: 30px;
                    margin-bottom: 30px;
                    position: relative;
                    .phoneImg{
                        width: 360px;
                        height: 700px;
                    }
                    .box{
                        position: absolute;
                        left: 37px;
                        top: 58px;
                        width: 287px;
                        height: 571px;
                        background: #ffffff;
                    }
                }
            }
        }
    }
    .nothing{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #cccccc;
    }
    .phone-box{
        width: 95%;
        margin: 0 auto;
        overflow-y: scroll;
        .box-title{
            display: -webkit-flex;
            justify-content: center;
            .tip{
                width: 100%;
                text-align: center;
                margin-top: 30px;
                margin-bottom: 20px;
                font-size: 14px;
                color: rgb(2, 179, 237);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .dataOrigin{
            display: -webkit-flex;
            align-items: center;
            margin-bottom: 15px;
            .data, .origin{
                font-size: 9px;
                color: rgb(153, 153, 153);
            }
            .origin{
                width: 165px;
                margin-left: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .imageUrl{
            width: 100%;
            height: 150px;
            margin-bottom: 15px;
            .imgs{
                width: 100%;
                height: 100%;
            }
        }
        .phone-content{
            width: 100%;
            height: 284px;
            .words{
                // width: 100%;
                // height: 100%;
                // display: -webkit-flex;
                // flex-direction: column;
                // overflow-y: scroll;
                // flex-wrap: wrap;
                font-size: 10px;
                color: rgb(51, 51, 51);
                .word{
                    
                }
            }
        }
    }
    
    .footer{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background: rgb(2, 179, 237);
        .foo{
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 30px;
            color: rgb(255, 255, 255);
            font-size: 12px;
            cursor: pointer;
        }
    }
    .problemBox{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        width: 287px;
        height: 571px;
        background: rgba(0,0,0,.3);
        z-index: 999;
        .problemMain{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 225px;
            height: auto;
            background: #ffffff;
            border-radius: 10px;
            .close{
                display: -webkit-flex;
                justify-content: flex-end;
                .icon_cancel{
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                    margin-top: 10px;
                    cursor: pointer;
                }
            }
            .problem{
                width: 90%;
                margin: 0 auto;
                .tooltip{
                    text-align: center;
                    font-size: 14px;
                    color: rgb(51, 51, 51);
                }
                .question{
                    font-size: 12px;
                    color: rgb(102, 102, 102);
                    margin-top: 5px;
                    margin-bottom: 10px;
                }
                .answers{
                    display: -webkit-flex;
                    align-items: center;
                    margin-left: 20px;
                    margin-bottom: 15px;
                    .uncheck{
                        width: 15px;
                        height: 15px;
                        margin-right: 5px;
                    }
                    .options{
                        font-size: 12px;
                        color: rgb(102, 102, 102);
                    }
                    .icon_right{
                        width: 15px;
                        height: 15px;
                        margin-left: 15px;
                    }
                }
            }
            .know{
                width: 100%;
                height: 34px;
                border-top: 1px solid #eeeeee;
                text-align: center;
                line-height: 34px;
                font-size: 12px;
                color: rgb(2, 179, 237);
                cursor: pointer;
            }
        }
    }
</style>


