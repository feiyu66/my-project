<template>
    <div class="box">
        <p class="title">文章管理</p>
        <div class="head">
            <div class="head-top">
                <p class="left">添加文章</p>
                <p class="toBack" @click="toBack">返回</p>
            </div>
            <div class="head-main">
                <div class="each-item">
                    <p class="item">标题：</p>
                    <el-input v-model="title" @input="changeWord" maxlength='150' placeholder="请输入内容"><template slot="append">{{titleNum}}</template></el-input>
                    <div class="too" v-if="titleFlag">
                        <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="required">必填项</p>
                    </div> 
                </div>
                <div class="each-item">
                    <p class="item">版块：</p>
                    <div class="radio">
                        <button class="btn" :class="[plateId == item.name ? 'on' : '']" @click="radioData(item.name, item.id)" v-for="(item, index) in data" :key='index'>{{item.name}}</button>
                    </div>
                    <div class="too" v-if="plateFlag">
                        <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="required">必填项</p>
                    </div> 
                </div>
                <div class="each-item ">
                    <p class="item">出处：</p>
                    <el-input v-model="source" @input="inputSource" maxlength='150' placeholder="请输入内容"><template slot="append">{{sourceNum}}</template></el-input>
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
                        <div class="too" v-if="valueDateFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="each-item itemNum">
                        <p class="item">浏览量基数：</p>
                        <div class="number">
                             <input v-model="views" @input="inputViews" type="text" class="num"> 
                        </div>
                        <div class="too" v-if="viewsFalg">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
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
                    <div class="uploadSuccess" v-if="successFlag">
                        <img class="prompt" src="http://doctor.dlcaring.com/prompt.png" alt="">
                        <p class="success">上传成功！</p>
                    </div>
                    <div class="uploadSuccess" v-if="failFlag">
                        <img class="prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="success">上传失败！</p>
                    </div>
                    <div class="too" v-if="imgFlag">
                        <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="required">必填项</p>
                    </div>
                     <!-- <div class="imgUrl">
                        <img style="width: 200px; height: 140px;" class="imageUrl" src="http://dl-bs-bucket.img-cn-beijing.aliyuncs.com/20180824090118655-1" alt="">  
                    </div>   -->
                </div>
                <div class="problem" v-if="showFlag">
                    <div class="subject">
                        <p class="subject-title">问题题目：</p>
                        <el-input v-model="subject1" @input="inputProblem" maxlength='150' placeholder="请输入内容"><template slot="append">{{problemNum}}</template></el-input>
                        <div class="too" v-if="problemFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio v-model="radio" label="1">A</el-radio>
                        </p>
                        <el-input v-model="subject2" @input="inputAnserA" maxlength='150' placeholder="请输入内容"><template slot="append">{{answerANum}}</template></el-input>
                        <div class="too" v-if="answerAFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio v-model="radio" label="2">B</el-radio>
                        </p>
                        <el-input v-model="subject3" @input="inputAnserB" maxlength='150' placeholder="请输入内容"><template slot="append">{{answerBNum}}</template></el-input>
                        <div class="too" v-if="answerBFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio v-model="radio" label="3">C</el-radio>
                        </p>
                        <el-input v-model="subject4" @input="inputAnserC" maxlength='150' placeholder="请输入内容"><template slot="append">{{answerCNum}}</template></el-input>
                        <div class="too" v-if="answerCFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                    <div class="option">
                        <p class="option-left">
                            <el-radio v-model="radio" label="4">D</el-radio>
                        </p>
                        <el-input v-model="subject5" @input="inputAnserD" maxlength='150' placeholder="请输入内容"><template slot="append">{{answerDNum}}</template></el-input>
                        <div class="too" v-if="answerDFlag">
                            <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                            <p class="required">必填项</p>
                        </div> 
                    </div>
                </div>
                <div class="Keyword">
                    <p class="item">关键字(多选)：</p>
                    <ul class="uls">
                        <li class="word" :class="item.active == true ? 'bg' : ''" @click="wordStyle(index, item.id)" v-for="(item, index) in keyWord" :key='index'>{{item.name}}</li>
                    </ul>
                    <div class="too" v-if="tagIdsFlag">
                        <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="required">必填项</p>
                    </div> 
                </div>
                <div class="editor">
                    <p class="item">正文：</p>
                     <div class='tinymce'>
                        <editor class="tinymce-textarea" :id='tinymceId' v-model='tinymceHtml' :init='init'></editor>
                        <div class="editor-custom-btn-container">
                            <p>上传图片</p>
                            <input type="file" class="DitorUpload" id="DitorUpload" @change="imageSuccessCBK">
                            <!-- <editorImage color="#1890ff" class="editor-upload-btn" id='EditorUpload' @successCBK="imageSuccessCBK">
                            </editorImage>  -->
                        </div> 
                    </div> 
                    <div class="too" v-if="editorContentFlag">
                        <img class="red_Prompt" src="http://doctor.dlcaring.com/red_Prompt.png" alt="">
                        <p class="required">必填项</p>
                    </div>
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
    import axios from 'axios'
    import Tinymce from '../../components/Tinymce'
    import localhost from '../../util/localhost'
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
    var imageUrl = '' // 图片路径
    export default {
        components: {Editor, Tinymce, editorImage},
        props: {
            id: {
                type: String
            }
        },
        data () {
            return {
                tinymceHtml: '',
                hasChange: false,
                hasInit: false,
                tinymceId: this.id || 'vue-tinymce-' + +new Date(),
                fullscreen: false,
                init: {
                    language_url: '/static/tinymce4.7.5/langs/zh_CN.js',
                    skin_url: '/static/tinymce/skins/lightgray',
                    height: 300,
                    plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
                    toolbar:
                    'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
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
                            this.disabledStyle()
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
                                $image.attr('data-wscnw',$image[0].width);
                                $image.addClass('wscnph');
                            }
                        }, 0);
                        return img
                    }
                },
                simplemde: null,
                hasChange: false,
                successFlag: false, // 图片上传成功
                failFlag: false, // 图片上传失败
                clearableFlag: false,
                showFlag: false, // 问题题目
                editorContent: '', // 正文
                editorContentFlag: false,
                title: '', // 标题
                titleFlag: false,
                titleNum: 150,
                source: '', // 出处
                sourceFlag: false,
                sourceNum: 150,
                plateId: '', // 版块
                plateFlag: false,
                plate: null,
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
                valueDateFlag: false,
                startData: '',
                views: null, // 浏览量
                viewsFalg: false,
                imgUrl: '', // 图片路径
                imgFlag: false,
                tagIds: [], // 关键字
                tagIdsFlag: false,
                uploadImg: '',
                uploadFlag: false,
                fileList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                radio: null,
                disabledFalg: false, // 提交
                arr: []
            }
        },
        mounted () {
            tinymce.init({})
        },
        watch: {
            value(val) {
                if (!this.hasChange && this.hasInit) {
                    this.$nextTick(() =>
                    window.tinymce.get(this.tinymceId).setContent(val || ''))
                }
            }
        },
        methods: {
            destroyTinymce() {
                if (window.tinymce.get(this.tinymceId)) {
                    window.tinymce.get(this.tinymceId).destroy()
                }
            },
            setContent(value) {
                window.tinymce.get(this.tinymceId).setContent(value)
            },
            getContent() {
                window.tinymce.get(this.tinymceId).getContent()
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
                            window.tinymce.get(_this.tinymceId).insertContent(
                                `<img style="width: 100%;" class="wscnph" src="${url}" >`)
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
            inputViews (event){
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
                this.disabledStyle()
            },
            changeImg(){  // 上传图片
                var formData = new FormData();
                formData.append("image", document.getElementById("FileUpload").files[0]);   
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
                        if (data.code == '200') {
                            imageUrl = data.data
                            this.imgUrl = data.data
                            this.successFlag = true
                        } else {
                            this.failFlag = true
                            setTimeout(() => {
                                this.failFlag = false
                            }, 2000)
                        }
                        // this.disabledStyle()
                    }
                })
            },
            wordStyle (index, id) {
                this.tagIds = []
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
                this.disabledStyle()
            },
            uploadArticle () { // 提交
                if (this.title.length < 1) { // 标题
                    this.titleFlag = true
                } else {
                    this.titleFlag = false
                }
                if (this.plate == null) { // 版块
                    this.plateFlag = true
                } else {
                    this.plateFlag = false
                }
                if (this.source.length < 1) { // 出处
                    this.sourceFlag = true
                } else {
                    this.sourceFlag = false
                }
                if (this.startData == '') { // 发布时间
                    this.valueDateFlag = true
                } else {
                    this.valueDateFlag = false
                }
                if (this.views == null) { // 浏览量
                    this.viewsFalg = true
                } else {
                    this.viewsFalg = false
                }
                if (imageUrl == '') { // 图片路径
                    this.imgFlag = true
                } else {
                    this.imgFlag = false
                }
                if (this.tagIds == '') { // 关键字
                    this.tagIdsFlag = true
                } else {
                    this.tagIdsFlag = false
                }
                if (this.tinymceHtml == '') { // 正文
                    this.editorContentFlag = true
                } else {
                    this.editorContentFlag = false
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
                        title:this.title,
                        plate:this.plate,
                        origin:this.source,
                        prePublishTime:this.startData,
                        basicViews:this.views,
                        imageUrl: imageUrl,
                        questionName: this.subject1,
                        answerA: this.subject2,
                        answerB: this.subject3,
                        answerC: this.subject4,
                        answerD: this.subject5,
                        rightKey: this.radio,
                        content: this.tinymceHtml,
                        userId: localStorage.getItem('id'),
                        tagIds: this.tagIds
                    }
                } else {
                    this.article = {
                        title:this.title,
                        plate:this.plate,
                        origin:this.source,
                        prePublishTime:this.startData,
                        basicViews:this.views,
                        imageUrl: imageUrl,
                        content: this.tinymceHtml,
                        userId: localStorage.getItem('id'),
                        tagIds: this.tagIds
                    }
                }
                console.log(this.article)
                if (this.disabledFalg) {
                    $.ajax({
                        type: 'put',
                        url: localhost + 'backstage/article/upload',
                        xhrFields:{withCredentials:true},
                        contentType : "application/json; charset=UTF-8",
                        dataType: "json",
                        headers: {
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        data: JSON.stringify(this.article),
                        success: data => {
                            console.log(data)
                            if (data.code == '200') {
                                this.$message.success("上传成功！");
                                this.disabledFalg = false
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
                    if(this.title.length < 1 || this.source.length < 1 || this.plate == null || this.startData == '' || this.views == null || this.tagIds == '' || this.tinymceHtml == '' || this.subject1.length < 1 || this.subject2.length < 1 || this.subject3.length < 1 || this.subject4.length < 1 || this.subject5.length < 1) {
                        this.disabledFalg = false
                    } else {
                        this.disabledFalg = true
                    }
                } else {
                    if(this.title.length < 1 || this.source.length < 1 || this.plate == null || this.startData == '' || this.views == null || this.tagIds == '' || this.tinymceHtml == '') {
                        console.log(11111)
                        this.disabledFalg = false
                    } else {
                        console.log(33333)
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
                this.disabledStyle()
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            radioData (name, id) {
                this.plate = id
                this.plateId = name
                if (name == '必读') {
                    this.showFlag = true
                } else {
                    this.showFlag = false
                }
                this.disabledStyle()
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
.simplemde-container >.CodeMirror {
  min-height: 150px;
  line-height: 20px;
}

.simplemde-container>.CodeMirror-scroll {
  min-height: 150px;
}

.simplemde-container>.CodeMirror-code {
  padding-bottom: 40px;
}

.simplemde-container>.editor-statusbar {
  display: none;
}

.simplemde-container>.CodeMirror .CodeMirror-code .cm-link {
  color: #1890ff;
}

.simplemde-container>.CodeMirror .CodeMirror-code .cm-string.cm-url {
  color: #2d3b4d;
}

.simplemde-container>.CodeMirror .CodeMirror-code .cm-formatting-link-string.cm-url {
  padding: 0 2px;
  color: #E61E1E;
}
.simplemde-container > .editor-toolbar.fullscreen,
.simplemde-container > .CodeMirror-fullscreen {
  z-index: 1003;
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
                width: auto;
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
    .uploadSuccess{
        display: -webkit-flex;
        align-items: center;
        margin-left: 30px;
        .prompt{
            width: 30px;
            height: 30px;
        }
        .success{
            margin-left: 5px;
            font-size: 16px;
        }
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
</style>

