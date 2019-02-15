<template>
    <div class="box">
        <p class="title">文章管理</p>
        <div class="head">
            <div class="head-top">
                <p class="left">编辑文章</p>
                <p class="toBack" @click="toBack">返回</p>
            </div>
            <div class="head-main">
                <div class="each-item">
                    <p class="item">标题：</p>
                    <el-input v-model="title" @input="changeWord" maxlength='100' placeholder="请输入内容"><template slot="append">{{titleNum}}</template></el-input>
                    <div class="too" v-if="titleFlag">
                        <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="required">必填项</p>
                    </div> 
                </div>
                <div class="each-item">
                    <p class="item">版块：</p>
                    <div class="radio">
                        <button class="btn" :class="[plateId == item.name ? 'on' : '']" @click="radioData(index, item.name, item.id)" v-for="(item, index) in data" :key='index'>{{item.name}}</button>
                    </div>
                </div>
                <div class="each-item">
                    <p class="item">出处：</p>
                    <el-input v-model="source" @input="inputSource" maxlength='100' placeholder="请输入内容"><template slot="append">{{sourceNum}}</template></el-input>
                    <div class="too" v-if="sourceFlag">
                        <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="required">必填项</p>
                    </div> 
                </div>
                <div class="dataNum">
                    <div class="each-item item-date">
                        <p class="item">计划发布时间：</p>
                        <el-date-picker
                            v-model="valueDate"
                            @change="dataTime"
                            type="datetime"
                            :clearable="clearableFlag"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="each-item itemNum">
                        <p class="item">浏览量基数：</p>
                        <div class="number">
                            <input v-model="views" type="text" class="num">
                        </div>
                    </div>
                </div>
                <div class="listImg">
                    <p class="item">列表图片：</p>
                    <div class="uploadImg">
                        <img class="addition" src="http://doctor.dlcaring.com/addition.png" alt="">
                        <p class="tooltip clickImg">点击添加图片</p>
                        <p class="tooltip wordImg">支持jpg/png/git格式RGB模式，不超过5M</p>
                        <input type="file" class="FileUpload" @change="changeImg" id="FileUpload">
                    </div>
                    <!-- <div>
                        <img :src="imageUrl" alt="">
                    </div> -->
                </div>
                <div class="problem" v-if="showFlag">
                    <div class="subject">
                        <p class="subject-title">问题题目：</p>
                        <el-input v-model="subject1" @input="inputProblem" maxlength='100' placeholder="请输入内容"><template slot="append">{{problemNum}}</template></el-input>
                        <div class="too" v-if="problemFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio disabled v-model="radio1" label="1">A</el-radio>
                        </p>
                        <el-input v-model="subject2" @input="inputAnserA" maxlength='50' placeholder="请输入内容"><template slot="append">{{answerANum}}</template></el-input>
                        <div class="too" v-if="answerAFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio disabled v-model="radio1" label="2">B</el-radio>
                        </p>
                        <el-input v-model="subject3" @input="inputAnserB" maxlength='50' placeholder="请输入内容"><template slot="append">{{answerBNum}}</template></el-input>
                        <div class="too" v-if="answerBFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio disabled v-model="radio1" label="3">C</el-radio>
                        </p>
                        <el-input v-model="subject4" @input="inputAnserC" maxlength='50' placeholder="请输入内容"><template slot="append">{{answerCNum}}</template></el-input>
                        <div class="too" v-if="answerCFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio disabled v-model="radio1" label="4">D</el-radio>
                        </p>
                        <el-input v-model="subject5" @input="inputAnserD" maxlength='50' placeholder="请输入内容"><template slot="append">{{answerDNum}}</template></el-input>
                        <div class="too" v-if="answerDFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                </div>
                <div class="Keyword">
                    <p class="item">关键字(多选)：</p>
                    <ul class="uls">
                        <li class="word" :class="item.active == true ? 'bg' : ''" @click="wordStyle(index)" v-for="(item, index) in keyWord" :key='index'>{{item.name}}</li>
                    </ul>
                </div>
                <div class="editor">
                    <p class="item">正文：</p>
                    <!-- <div id="editorElem" class="editorElem"></div> -->
                     <div class='tinymce'>
                        <editor class="tinymce-textarea" :id='tinymceClass' v-model='tinymceHtml' :init='init'></editor>
                        <div class="editor-custom-btn-container">
                            <p>上传图片</p>
                            <input type="file" class="DitorUpload" id="DitorUpload" @change="imageSuccessCBK">
                            <!-- <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage> -->
                        </div> 
                    </div> 
                    <!-- <div>
                        <tinymce :height="300" v-model="content"></tinymce>
                    </div> -->
                </div>
                <div class="Preservation">
                    <button type="primary" :class="disabledFalg == true ? 'btnOn' : ''" @click="uploadArticle" class="btnAction">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jQuery'
    import E from 'wangeditor'
    import Tinymce from '../../components/Tinymce'
    import editorImage from '../../components/Tinymce/components/editorImage.vue'
    import Editor from '@tinymce/tinymce-vue'
    import tinymce from 'tinymce/tinymce'
    import 'tinymce/themes/modern/theme'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/textcolor'
    import localhost from '../../util/localhost'
    let imageUrl = '' // 图片路径
    export default {
        components: {Editor , Tinymce, editorImage},
        props: {
            name: {
                type: String
            }
        },
        data () {
            return {
                radio1: '1',
                tinymceHtml: ``,
                hasChange: false,
                hasInit: false,
                tinymceClass: this.name || 'vue-tinymce-' + +new Date(),
                fullscreen: false,
                init: {
                    language_url: '/static/tinymce/zh_CN.js',
                    language_url: '/static/tinymce4.7.5/langs/zh_CN.js',
                    skin_url: '/static/tinymce/skins/lightgray',
                    height: 300,
                    plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
                    toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
                    branding: false,
                    relative_urls: false,
                    init_instance_callback: editor => {
                        if (this.value) {
                            editor.setContent(this.value)
                        }
                        this.hasInit = true
                        editor.on('NodeChange Change KeyUp SetContent', () => {
                            this.hasChange = true
                            this.$emit('input', editor.getContent())
                        })
                    },
                    setup(editor) {
                        editor.on('FullscreenStateChanged', (e) => {
                            this.fullscreen = e.state
                        })
                    },
                    images_dataimg_filter(img) {
                        setTimeout(() => {
                            const $image = $(img);
                            $image.removeAttr('width');
                            $image.removeAttr('height');
                            if ($image[0].height && $image[0].width) {
                            $image.attr('data-wscntype', 'image');
                            $image.attr('data-wscnh', $image[0].height);
                            $image.attr('data-wscnw', $image[0].width);
                            $image.addClass('wscnph');
                            }
                        }, 0);
                        return img
                    }
                },
                clearableFlag: false,
                showFlag: false, // 问题题目
                editorContent: '',
                content: ``,
                title: '', // 标题
                titleFlag: false,
                titleNum: 150,
                source: '', // 出处
                sourceFlag: false,
                sourceNum: 150,
                plateId: '', // 版块
                plate: '',
                subject1: '', // 问题题目
                problemFlag: false,
                problemNum: 150,
                subject2: '',
                answerAFlag: false,
                answerANum: 150,
                subject3: '',
                answerBFlag: false,
                answerBNum: 150,
                subject4: '',
                answerCFlag: false,
                answerCNum: 150,
                subject5: '',
                answerDFlag: false,
                answerDNum: 150,
                keyWord: [
                    {
                        id: 1,
                        active: false,
                        name: '健康促进'
                    },
                    {
                        id: 2,
                        active: false,
                        name: '肥胖'
                    },
                    {
                        id: 3,
                        active: false,
                        name: '高血压'
                    },
                    {
                        id: 4,
                        active: false,
                        name: '糖尿病'
                    },
                    {
                        id: 5,
                        active: false,
                        name: '高血脂'
                    },
                    {
                        id: 6,
                        active: false,
                        name: '代谢综合征'
                    },
                    {
                        id: 7,
                        active: false,
                        name: '冠心病'
                    },
                    {
                        id: 8,
                        active: false,
                        name: '脂肪肝'
                    },
                    {
                        id: 9,
                        active: false,
                        name: '痛风'
                    },
                    {
                        id: 10,
                        active: false,
                        name: '骨关节类疾病'
                    },
                    {
                        id: 11,
                        active: false,
                        name: '慢阻肺'
                    },
                    {
                        id: 12,
                        active: false,
                        name: '癌症'
                    }
                ],
                data: [
                    {
                        id: 4,
                        name: '必读'
                    },
                    {
                        id: 1,
                        name: '资讯'
                    },
                    {
                        id: 2,
                        name: '运动'
                    },
                    {
                        id: 3,
                        name: '饮食'
                    }
                ],
                valueDate: '', // 发布时间
                startData: '',
                views: null, // 浏览量
                // imageUrl: '', // 图片路径
                fileList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                // radio: 1,
                disabledFalg: true, // 提交
                arr: [],
                id: null,
                diseaseSpecies: [],
            }
        },
        watch: {
            value(val) {
                if (!this.hasChange && this.hasInit) {
                    this.$nextTick(() =>
                    window.tinymce.get(this.tinymceClass).setContent(val || ''))
                }
            }
        },
        mounted () {
            tinymce.init({})
            $.ajax({
                type: 'get',
                url: localhost + 'backstage/article/' + this.$route.params.id,
                xhrFields:{withCredentials:true},
                contentType : "application/json; charset=UTF-8",
                headers: {
                    // 'Login_Authorization': localStorage.getItem('token'),
                    // 'User_Id': localStorage.getItem('id')
                },
                dataType: "json",
                data: JSON.stringify(this.article),
                success: data => {
                    console.log(data)
                    if (data.code == '200') {
                        let datas = data.data
                        this.id = datas.id
                        this.tinymceHtml = datas.content
                        // $('#editorElem').append('<p>' + this.content + '</p>')
                        // editor.create()
                        this.title = datas.title
                        this.plateId = datas.plate
                        this.source = datas.origin
                        this.valueDate = datas.uploadTime
                        this.views = datas.views
                        imageUrl = datas.imageUrl
                        this.titleNum = 150 - this.title.length
                        this.sourceNum = 150 - datas.origin.length
                        let newTag = datas.tagIds.split(',')
                        this.diseaseSpecies = newTag
                        this.keyWord.map(item => {
                            for(let i=0;i<newTag.length; i++){
                                if (item.id == newTag[i]){
                                    item.active = true
                                }
                            }
                        })
                        if (datas.plate == '必读') {
                            this.showFlag = true
                            this.radio1 = String(datas.question.rightKey)
                            this.subject1 = datas.question.title
                            this.subject2 = datas.question.answerA
                            this.subject3 = datas.question.answerB
                            this.subject4 = datas.question.answerC
                            this.subject5 = datas.question.answerD
                            this.problemNum = 150 - this.subject1.length
                            this.answerANum = 150 - this.subject2.length
                            this.answerBNum = 150 - this.subject3.length
                            this.answerCNum = 150 - this.subject4.length
                            this.answerDNum = 150 - this.subject5.length
                        } else {
                            this.showFlag = false
                        }
                    }
                }
            })
        },
        methods: {
            destroyTinymce() {
                if (window.tinymce.get(this.tinymceClass)) {
                    window.tinymce.get(this.tinymceClass).destroy()
                }
            },
            setContent(value) {
                window.tinymce.get(this.tinymceClass).setContent(value)
            },
            getContent() {
                window.tinymce.get(this.tinymceClass).getContent()
            },
            imageSuccessCBK(arr) {
                const _this = this
                var formData = new FormData();
                formData.append("image", document.getElementById("DitorUpload").files[0]);  
                $.ajax({
                    url: localhost + 'backstage/image/upload',
                    xhrFields:{withCredentials:true},
                    headers: {
                        // 'Login_Authorization': localStorage.getItem('token'),
                        // 'User_Id': localStorage.getItem('id')
                    },
                    type: 'post',
                    data: formData,
                    cache: false,
                    /**必须false才会自动加上正确的Content-Type*/
                    contentType: false,
                    /**
                    * 必须false才会避开jQuery对 formdata 的默认处理
                    * XMLHttpRequest会对 formdata 进行正确的处理
                    */
                    processData: false,
                    success: function (data) {
                        console.log(data)
                        if (data.code == 200) {
                            let url = data.data + '?x-oss-process=style/dl-m-style'
                            window.tinymce.get(_this.tinymceClass).insertContent(`<img style="width: 100%;" class="wscnph" src="${url}" >`)
                        }
                    }
                })
            },
            changeWord (value) {
                this.titleNum = 150 - value.length
                this.title = value
                this.disabledStyle()
            },
            inputSource (value) {
                this.sourceNum = 150 - value.length
                this.source = value
                this.disabledStyle()
            },
            inputProblem (value) {
                this.problemNum = 150 - value.length
                this.subject1 = value
                this.disabledStyle()
            },
            inputAnserA (value) {
                this.answerANum = 150 - value.length
                this.subject2 = value
                this.disabledStyle()
            },
            inputAnserB (value) {
                this.answerBNum = 150 - value.length
                this.subject3 = value
                this.disabledStyle()
            },
            inputAnserC (value) {
                this.answerCNum = 150 - value.length
                this.subject4 = value
                this.disabledStyle()
            },
            inputAnserD (value) {
                this.answerDNum = 150 - value.length
                this.subject5 = value
                this.disabledStyle()
            },
            changeImg(){  // 上传图片
                var formData = new FormData();
                formData.append("image", document.getElementById("FileUpload").files[0]);   
                $.ajax({
                    url: localhost + 'backstage/image/upload',
                    type: 'post',
                    headers: {
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    data: formData,
                    cache: false,
                    /**
                    *必须false才会自动加上正确的Content-Type
                    */
                    contentType: false,
                    /**
                    * 必须false才会避开jQuery对 formdata 的默认处理
                    * XMLHttpRequest会对 formdata 进行正确的处理
                    */
                    processData: false,
                    success: function (data) {
                        console.log(data)
                        if (data.code == '200') {
                            imageUrl = data.data
                        }
                    }
                })
            },
            wordStyle (index) { // 关键字多选
                if (this.diseaseSpecies == []) {
                    this.tagIds = []
                } else {
                    this.tagIds = this.diseaseSpecies
                }
                this.keyWord[index].active = !this.keyWord[index].active
                if (this.keyWord[index].active){
                    this.arr.push(this.keyWord[index])
                }
                this.arr.forEach(item => {
                    if (item.active){
                        this.tagIds.push(item.id)
                    }
                })
                this.tagIds = (Array.from(new Set(this.tagIds))).join(',')
            },
            uploadArticle () { // 提交
                if (this.title.length < 1) {
                    this.titleFlag = true
                } else {
                    this.titleFlag = false
                }
                if (this.source.length < 1) {
                    this.sourceFlag = true
                } else {
                    this.sourceFlag = false
                }
                if (this.plateId == '必读') {
                    if (this.subject1.length < 1) {
                        this.problemFlag = true
                    } else {
                        this.problemFlag = false
                    }
                    if (this.subject2.length < 1) {
                        this.answerAFlag = true
                    } else {
                        this.answerAFlag = false
                    }
                    if (this.subject3.length <1) {
                        this.answerBFlag = true
                    } else {
                        this.answerBFlag = false
                    }
                    if (this.subject4.length <1) {
                        this.answerCFlag = true
                    } else {
                        this.answerCFlag = false
                    }
                    if (this.subject5.length <1) {
                        this.answerDFlag = true
                    } else {
                        this.answerDFlag = false
                    }
                    this.article = {
                        id: this.id,
                        title: this.title,
                        plate: this.plateId,
                        origin: this.source,
                        prePublishTime: this.startData,
                        basicViews: this.views,
                        imageUrl: imageUrl,
                        questionName: this.subject1,
                        answerA: this.subject2,
                        answerB: this.subject3,
                        answerC: this.subject4,
                        answerD: this.subject5,
                        rightKey: this.radio1,
                        content: this.tinymceHtml,
                        userId: localStorage.getItem('id'),
                        tagIds: this.tagIds
                    }
                } else {
                    this.article = {
                        id: this.id,
                        title: this.title,
                        plate: this.plateId,
                        origin: this.source,
                        prePublishTime: this.startData,
                        basicViews: this.views,
                        imageUrl: imageUrl,
                        content: this.tinymceHtml,
                        userId: localStorage.getItem('id'),
                        tagIds: this.tagIds
                    }
                }
                if (this.disabledFalg) {
                    $.ajax({
                        type: 'patch',
                        url: localhost + 'backstage/article/update',
                        xhrFields:{withCredentials:true},
                        contentType : "application/json; charset=UTF-8",
                        headers: {
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        dataType: "json",
                        data: JSON.stringify(this.article),
                        success: data => {
                            console.log(data)
                            if (data.code == '200') {
                                this.disabledFalg = false
                                this.$message.success("更新成功！");
                            } else if (data.code == '202') {
                                this.$message.error(data.msg);
                            } else if (data.code == '500') {
                                this.$message.error('请填写完整！');
                            }
                        }
                    })
                }
                
            },
            disabledStyle() {
                if (this.plateId == '必读') {
                    if(this.title.length < 1 || this.source.length < 1 || this.subject1.length < 1 || this.subject2.length < 1 || this.subject3.length < 1 || this.subject4.length < 1 || this.subject5.length < 1) {
                        this.disabledFalg = false
                    } else {
                        this.disabledFalg = true
                    }
                } else {
                    if(this.title.length < 1 || this.source.length < 1) {
                        this.disabledFalg = false
                    } else {
                        this.disabledFalg = true
                    }
                }
            },
            dataTime () { // 计划发布时间
                let newDate1 = new Date(this.valueDate);
                let Month = newDate1.getMonth() + 1
                let Data = newDate1.getDate()
                let Hours = newDate1.getHours()
                let Minute = newDate1.getMinutes()
                let Seconds = newDate1.getSeconds()
                if (Month < 10) { // 月
                    Month =  '0' + Month
                }
                if (Data < 10) { // 日
                    Data =  '0' + Data
                }
                if (Hours < 10) { // 小时
                    Hours = '0' + Hours
                }
                if (Minute < 10) { // 分钟
                    Minute = '0' + Minute
                }
                if (Seconds < 10) { // 秒
                    Seconds = '0' + Seconds
                }
                this.startData = newDate1.getFullYear() + '-' + Month + '-' + Data + ' ' + Hours + ':' + Minute + ':' + Seconds
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            radioData (index, name, id) {
                this.plate = id
                this.plateId = name
                if (name == '必读') {
                    this.showFlag = true
                } else {
                    this.showFlag = false
                }
            },
            toBack () {
                this.$router.replace('/patient-content/contentManagement')
            }
        }
    }
</script>

<style lang="less" scoped>
.tinymce{
    position: relative;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 100px;
  height: 28px;
  background-color: rgb(2, 179, 237);
  border-radius: 2px;
  p{
      text-align: center;
      line-height: 28px;
      color: #ffffff;
      font-size: 14px;
  }
  /*z-index: 2005;*/
}
.DitorUpload{
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
}
    .box{
        margin: 30px;
        .title{
            margin-bottom: 20px;
            font-size: 14px;
            color: rgb(102, 102, 102)
        }
        .head{
            background-color: #ffffff;
            border-radius: 10px;
            display: -webkit-flex;
            flex-direction: column;
            .head-top{
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
            .head-main{
                .el-input{
                    width: 580px;
                }
                .item-date{
                    .el-input{
                        width: 200px;
                        color: rgb(2, 179, 237);
                    }
                }
                .itemNum{
                    margin-left: 12%;
                }
                .listImg{
                    display: -webkit-flex;
                    margin-left: 20px;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    .item{
                        font-size: 16px;
                        color: rgb(102, 102, 102);
                        margin-right: 10px;
                    }
                    .uploadImg{
                        width: 200px;
                        height: 140px;
                        background: #EEEEEE;
                        display: -webkit-flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        .addition{
                            width: 38px;
                            height: 38px;
                        }
                        .tooltip{
                            font-size: 12px;
                            color: rgb(153, 153, 153);
                        }
                        .clickImg{
                            margin-top: 5px;
                            margin-bottom: 10px;
                        }
                        .wordImg{
                            width: 120px;
                            line-height: 17px;
                        }
                        .FileUpload{
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 200px;
                            height: 140px;
                            opacity: 0;
                            outline: none;
                        }
                    }
                    .imgUrl{
                        width: 200px;
                        height: 140px;
                        margin-left: 50px;
                        .imageUrl{
                            width: 200px;
                            height: 140px;
                        }
                    }
                }
                .each-item{
                    display: -webkit-flex;
                    align-items: center;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    .item{
                        margin-left: 20px;
                        margin-right: 10px;
                        font-size: 16px;
                        color: rgb(102, 102, 102);
                    }
                    .too{
                        margin-left: 30px;
                        display: -webkit-flex;
                        align-items: center;
                        .red_Prompt{
                            width: 28px;
                            height: 28px;
                        }
                        .required{
                            margin-left: 10px;
                            font-size: 14px;
                            color: rgb(249, 85, 85);
                        }
                    }
                    .radio{
                        .btn{
                            width: 80px;
                            height: 30px;
                            text-align: center;
                            line-height: 30px;
                            outline: none;
                            background: none;
                            border: 1px solid rgb(2, 179, 237);
                            color: rgb(2, 179, 237);
                            border-radius: 25px;
                            margin-right: 20px;
                            cursor: pointer;
                        }
                        .on{
                            background: #02B3ED;
                            border: 1px solid rgb(2, 179, 237);
                            color: #ffffff;
                        }
                    }
                    .number{
                        display: -webkit-flex;
                        align-items: center;
                        .num{
                            width: 89px;
                            height: 30px;
                            outline: none;
                            text-align: center;
                            margin-right: 10px;
                            color: rgb(2, 179, 237);
                            border-radius: 10px;
                            border: 1px solid #cccccc;
                        }
                    }
                }
                .dataNum{
                    display: -webkit-flex;
                }
                .problem{
                    flex-direction: column;
                    .subject, .option{
                        display: -webkit-flex;
                        align-items: center;
                        padding-top: 10px;
                        padding-bottom: 10px;
                        .too{
                            margin-left: 30px;
                            display: -webkit-flex;
                            align-items: center;
                            .red_Prompt{
                                width: 28px;
                                height: 28px;
                            }
                            .required{
                                margin-left: 10px;
                                font-size: 14px;
                                color: rgb(249, 85, 85);
                            }
                        }
                        .subject-title{
                            margin-left: 20px;
                            margin-right: 10px;
                            font-size: 16px;
                            color:rgb(102, 102, 102);
                        }
                        .option-left{
                            width: 95px;
                            text-align: center;
                        }
                        .el-input{
                            width: 520px;
                        }
                    }
                }
                
            }
        }
        .Keyword{
            display: -webkit-flex;
            .item{
                margin-left: 20px;
                margin-right: 10px;
                line-height: 30px;
                font-size: 16px;
                color: rgb(102, 102, 102);
            }
            .uls{
                display: -webkit-flex;
                flex-wrap: wrap;
                .word{
                    width: 15%;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    border: 1px solid rgb(2, 179, 237);
                    color: rgb(2, 179, 237);
                    border-radius: 25px;
                    margin-bottom: 20px;
                    margin-right: 10px;
                    cursor: pointer;
                }
                .bg{
                    background: #02B3ED;
                    color: #ffffff;
                    border: 1px solid #02B3ED;
                }
            }
        }
        .editor{
            display: -webkit-flex;
            margin-bottom: 20px;
            .item{
                margin-left: 20px;
                margin-right: 10px;
                line-height: 30px;
                font-size: 16px;
                color: rgb(102, 102, 102);
            }
            .editorElem{
                width: 800px;
                height: auto;
                z-index: 9;
            }
        }
        .Preservation{
            margin-bottom: 20px;
            .btnAction{
                width: 300px;
                height: 60px;
                background: #DDDDDD;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                outline: none;
                font-size: 18px;
                margin-left: 77px;
            }
            .btnOn{
                background: rgb(2, 179, 237);
                color: #ffffff;
            }
        }
    }
</style>

