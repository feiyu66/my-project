<template>
    <div class="management">
        <div class="box">
            <p class="title">患教内容管理>文章管理</p>
            <div class="head">
                <div class="head-top"><p>文章管理</p></div>
                <div class="main">
                    <div class="main-title">
                        <input type="text" v-model="titleVal" class="ipt" placeholder="标题、内容、关键字">
                        <div class="data">
                            <p class="releaseData">按发布时间：</p>
                            <el-date-picker
                                v-model="time"
                                @change="dataTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                        <el-select v-model="publisher" placeholder="请选择发布人">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                        <button class="btn" @click="doFilter">搜索</button>
                        <div class="addData" @click="addData">
                            <img class="add" src="http://doctor.dlcaring.com/add.png" alt="">
                            <p>添加</p>
                        </div>
                    </div>
                    <div class="main-screen">
                        <p>筛选:</p>
                        <div class="screen">
                            <div class="list" :class="num == index ? 'on' : ''" @click="screenData(item.id, index)" v-for="(item, index) in data" :key='index'>{{item.name}}</div>
                        </div>
                    </div>
                    <div class="main-tab">
                        <el-table
                            :data="tableDataEnd"
                            stripe
                            row-key="id"
                            header-row-class-name="rowHead"
                            style="width: 100%">
                            <el-table-column
                                prop="plate"
                                label="版块"
                                align='center'
                                width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="rowClick(scope.row)" v-if="scope.row.peoples_count==0">版块</el-button>
                                    <el-button type="text" size="small" @click="rowClick(scope.row)" v-else>{{scope.row.plate}}</el-button>
                                </template> 
                            </el-table-column>
                            <el-table-column
                                prop="title"
                                label="标题"
                                show-overflow-tooltip
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                prop="uploadTime"
                                label="上传日期"
                                show-overflow-tooltip
                                class-name='bg'
                                width="300"
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                prop="publishTime"
                                label="发布日期"
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="状态"
                                align='center'>
                                <template scope="scope">
                                    <span v-if="scope.row.status === 0" style="color: rgb(102, 102, 102);">待发布</span>
                                    <span v-else-if="scope.row.status === 1" style="color: rgb(55, 199, 52);">已发布</span>
                                </template> 
                            </el-table-column>
                            <el-table-column
                                prop="userName"
                                label="发布人"
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align='center'>
                                <template slot-scope="scope">
                                    <el-button
                                        size="small"
                                        type="text"
                                        @click="handleEdit(scope.row)">编辑</el-button>
                                    <el-button
                                        size="small"
                                        type="text"
                                        @click.native.prevent="deleteRow(scope.row, scope.$index, tableDataEnd)">删除</el-button>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column
                                label="今日必读"
                                align='center'>
                                <template slot-scope="scope">
                                    <el-button
                                        :disabled = 'disabledStatus'
                                        size="mini"
                                        type="warning"
                                        @click="openDate(scope.$index)">{{text}}</el-button>
                                        <span>{{date}}</span>
                                </template>
                            </el-table-column> -->
                        </el-table>
                        <div class="foo">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                :page-sizes="[20]"
                                :page-size='pagesize'
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="totalItems">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="deleteFlag" class="deleteBox">
                <div class="delete">
                    <div class="delete-title">
                        <p class="tip-left">删除提示</p>
                        <img @click="cancelData" class="cancel" src="http://doctor.dlcaring.com/cancel.png" alt="">
                    </div>
                    <div class="del-content">
                        <img class="prompt" src="http://doctor.dlcaring.com/prompt.png" alt="">
                        <p class="del">你确定删除吗？删除后将不可找回</p>
                    </div>
                    <div class="btn">
                        <button class="button determine" @click="determineData">确定</button>
                        <button class="button cancel" @click="cancelData">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="flag" class="release-date">
            <div class="dateBox">
                <p class="close" @click="close">&times</p>
                <p>该文章将选用为 今日必读</p>
                <div class="choiceDate">
                    <p class="tootip">请选择预计发布时间</p>
                    <el-date-picker
                        v-model="choiceDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div class="determine"><el-button type="primary" @click="determine">确定</el-button></div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jQuery'
    import localhost from '../../../util/localhost'
    export default {
        data () {
            return {
                data: [
                    {
                        id: '00',
                        name: '全部'
                    },
                    {
                        id: 4,
                        name: '今日必读'
                    },
                    {
                        id: 1,
                        name: '最新资讯'
                    },
                    {
                        id: 2,
                        name: '论科学运动'
                    },
                    {
                        id: 3,
                        name: '论健康饮食'
                    }
                ],
                num: 0, // 筛选样式
                time: '',
                startData: '', // 起始时间
                endData: '', // 截止时间
                publisher: '', // 发布人员
                options: [
                    {
                        value: 0,
                        label: '全部人员'
                    }
                ],
                totalItems: 0, // 总共条数
                pagesize: 0,
                currentPage: 1,
                tableData: [],
                tableDataEnd: [],
                text: '选用',
                flag: false, // 今日必读发布时间的状态
                choiceDate: '', // 今日必读发布时间
                disabledStatus: false,
                date: '',
                titleVal: '', // 标题、内容、关键字
                screenId: null, // 筛选
                deleteFlag: false, // 删除状态
                deleteIndex: null,
                rowId: null,
                rowsData: [],
                typeId: null, // 筛选类型
            }
        },
        created () {
            let condition = {
                pageNum: 1
            }
            $.ajax({
                type: 'post',
                url: localhost + 'backstage/article/list',
                xhrFields:{withCredentials:true},
                contentType : "application/json; charset=UTF-8",
                dataType: "json",
                headers: {
                    // 'Login_Authorization': localStorage.getItem('token'),
                    // 'User_Id': localStorage.getItem('id')
                },
                data: JSON.stringify(condition),
                success: data => {
                    console.log(data)
                    if (data.code === '200') {
                        let arr = []
                        this.count = 0
                        this.pagesize = data.data.pageSize
                        this.totalItems = data.data.total
                        this.tableDataEnd = data.data.datas
                        data.data.datas.forEach((item) => {
                            if (arr.indexOf(item.userName) == -1) {
                                arr.push(item.userName)
                            }
                        })
                        arr.forEach(item => {
                            let obj = {}
                            obj.value = ++this.count
                            obj.label = item
                            this.options.push(obj)
                        })
                    }
                }
            })
        },
        methods: {
            doFilter () { // 搜索
                if (this.titleVal === '' && this.startData === '' && this.endData === '' && this.publisher === '') {
                    this.$message.warning("查询条件不能为空！");
                    return
                }
                if (this.publisher == '全部人员') {
                    this.condition = {
                        keywords: this.titleVal,
                        publisher: '',
                        startTime: this.startData,
                        endTime: this.endData,
                        screen: this.typeId
                    }
                } else {
                    this.condition = {
                        keywords: this.titleVal,
                        screen: this.typeId,
                        publisher: this.publisher,
                        startTime: this.startData,
                        endTime: this.endData
                    }
                }
                console.log(this.condition)
                this.defaultAjax()
            },
            screenData (id, index) { // 筛选
                this.num = index
                this.typeId = id
                if (id == '00') {
                    if (this.publisher == '全部人员') {
                        this.condition = {
                            keywords: this.titleVal,
                            publisher: '',
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    } else {
                        this.condition = {
                            keywords: this.titleVal,
                            publisher: this.publisher,
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    }
                } else {
                    if (this.publisher == '全部人员') {
                        this.condition = {
                            keywords: this.titleVal,
                            publisher: '',
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    } else {
                        this.condition = {
                            keywords: this.titleVal,
                            publisher: this.publisher,
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    }   
                }
                this.defaultAjax()
            },
            defaultAjax () {
                $.ajax({
                    type: 'post',
                    url: localhost + 'backstage/article/list',
                    xhrFields:{withCredentials:true},
                    contentType : "application/json; charset=UTF-8",
                    dataType: "json",
                    headers: {
                        // 'Login_Authorization': localStorage.getItem('token'),
                        // 'User_Id': localStorage.getItem('id')
                    },
                    data: JSON.stringify(this.condition),
                    success: data => {
                        console.log(data)
                        if (data.code === '200') {
                            this.pagesize = data.data.pageSize
                            this.totalItems = data.data.total
                            this.tableDataEnd = data.data.datas
                        } else {
                            this.totalItems = 0
                            this.tableDataEnd = []
                        }
                    }
                })
            },
            openDate (row) { // 今日必读发布时间
                console.log(row)
                this.flag = true
            },
            close () { // 关闭弹层
                this.flag = false
            },
            determine () { // 确定今日必读发布时间
                if (!this.choiceDate){
                    this.$message('请选择今日必读发布时间');
                } else {
                    this.flag = false
                    this.disabledStatus = true           
                    this.text = '已选'
                    let newData = new Date(this.choiceDate)
                    let Month = newData.getMonth() + 1
                    let Data = newData.getDate()
                    let Hours = newData.getHours()
                    let Minute = newData.getMinutes()
                    if (Month < 10) {
                        Month =  '0' + Month
                    }
                    if (Data < 10) {
                        Data =  '0' + Data
                    }
                    if (Minute < 10) {
                        Minute = '0' + Minute
                    }
                    this.date = newData.getFullYear() + '-' + Month + '-' + Data
                }
            },
            handleEdit(row) {
                $.ajax({
                    url: localhost + 'backstage/article/' + row.id,
                    type: 'get',
                    xhrFields:{withCredentials:true},
                    contentType : "application/json; charset=UTF-8",
                    dataType: "json",
                    headers: {
                        // 'Login_Authorization': localStorage.getItem('token'),
                        // 'User_Id': localStorage.getItem('id')
                    },
                    success: data => {
                        console.log(data)
                        if (data.code == '200') {
                            this.$router.push({
                                name: 'editArticle',
                                params: {
                                    id: row.id
                                }
                            })
                        } else {
                            this.$message.error(data.msg);
                        }
                    }
                })
            },
            cancelData () {
                this.deleteFlag = false
            },
            determineData(){
                $.ajax({
                    type: 'patch',
                    url: localhost + 'backstage/article/delete/' + this.rowId,
                    xhrFields:{withCredentials:true},
                    contentType : "application/json; charset=UTF-8",
                    headers: {
                        // 'Login_Authorization': localStorage.getItem('token'),
                        // 'User_Id': localStorage.getItem('id')
                    },
                    dataType: "json",
                    success: data => {
                        console.log(data)
                        if (data.code == '200') {
                            this.rowsData.splice(this.deleteIndex, 1);
                            this.$message.success(data.msg);
                            this.deleteFlag = false
                        } else {
                            this.$message.error(data.msg);
                        }
                    } 
                })
            },
            deleteRow(row , index, rows) { // 删除数据
                if (row.plate == '必读') {
                    this.$message.error('今日必读内容不能删除！')
                } else {
                    this.deleteFlag = true
                    this.deleteIndex = index
                    this.rowId = row.id
                    this.rowsData = rows
                }
            },
            rowClick (row, event, column) {
                console.log(row)
                this.$router.push({
                    name: 'preview',
                    params: {
                        id: row.id
                    }
                })
            },
            handleSizeChange(val) {
                this.pagesize = val
            },
            handleCurrentChange(val) {
                // console.log(val)
                console.log(val)
                this.currentPage = val
                this.pagesize = 0
                this.totalItems = 0
                this.tableDataEnd = []
                // let condition = {
                //     pageNum: val,
                //     scscreen: this.typeId
                // }
                if (this.typeId == '00') {
                    if (this.publisher == '全部人员') {
                        this.condition = {
                            pageNum: val,
                            keywords: this.titleVal,
                            publisher: '',
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    } else {
                        this.condition = {
                            pageNum: val,
                            keywords: this.titleVal,
                            publisher: this.publisher,
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    }
                } else {
                    if (this.publisher == '全部人员') {
                        this.condition = {
                            pageNum: val,
                            keywords: this.titleVal,
                            publisher: '',
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    } else {
                        this.condition = {
                            pageNum: val,
                            keywords: this.titleVal,
                            publisher: this.publisher,
                            screen: this.typeId,
                            startTime: this.startData,
                            endTime: this.endData
                        }
                    }   
                }
                $.ajax({
                    type: 'post',
                    url: localhost + 'backstage/article/list',
                    xhrFields:{withCredentials:true},
                    contentType : "application/json; charset=UTF-8",
                    dataType: "json",
                    headers: {
                        // 'Login_Authorization': localStorage.getItem('token'),
                        // 'User_Id': localStorage.getItem('id')
                    },
                    data: JSON.stringify(this.condition),
                    success: data => {
                        console.log(data)
                        if (data.code === '200') {
                            this.pagesize = data.data.pageSize
                            this.totalItems = data.data.total
                            this.tableDataEnd = data.data.datas
                        }
                    }
                })
            },
            addData () {
                this.$router.replace('/addData')
            },
            dataTime() {
                if (this.time == null) {
                    this.time = ''
                    this.startData = ''
                    this.endData = ''
                } else {
                    this.releaseData(this.time[0], this.time[1])
                }
                
            },
            releaseData(start, end) {
                let newDate1 = new Date(start);
                let newDate2 = new Date(end);
                // 开始时间
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
                // 结束时间
                let Month2 = newDate2.getMonth() + 1
                let Data2 = newDate2.getDate()
                let Hours2 = newDate2.getHours()
                let Minute2 = newDate2.getMinutes()
                let Seconds2 = newDate2.getSeconds()
                if (Month2 < 10) {
                    Month2 =  '0' + Month2
                }
                if (Data2 < 10) {
                    Data2 =  '0' + Data2
                }
                if (Hours2 < 10) {
                    Hours2 = '0' + Hours2
                }
                if (Minute2 < 10) {
                    Minute2 = '0' + Minute2
                }
                if (Seconds2 < 10) {
                    Seconds2 = '0' + Seconds2
                }
                this.endData = newDate2.getFullYear() + '-' + Month2 + '-' + Data2 + ' ' + Hours2 + ':' + Minute2 + ':' + Seconds2
            }
        }
    }
</script>
<style>
    .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
        width: 300px;
    }
</style>

<style lang="less" scoped>
    .management{
        width: 100%;
        height: 100%;
    }
    .release-date{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 999;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        .dateBox{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            width: 35%;
            .close{
                display: -webkit-flex;
                justify-content: flex-end;
                margin-top: 10px;
                margin-bottom: 10px;
                margin-right: 10px;
                font-size: 28px;
                cursor: pointer;
            }
            .choiceDate{
                display: -webkit-flex;
                align-items: center;
                margin-top: 20px;
                margin-bottom: 20px;
                margin-left: 20px;
                .tootip{
                    margin-right: 10px;
                }
            }
            .determine{
                width: 100%;
                margin-bottom: 20px;
                display: -webkit-flex;
                justify-content: center;
                .el-button{
                    width: 150px;
                }
            }
        }
    }
    .box{
        position: relative;
        padding: 30px;
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
                height: 50px;
                display: -webkit-flex;
                align-items: center;
                p{
                    width: 100%;
                    height: 25px;
                    line-height: 25px;
                    border-left: 3px solid #02B3ED;
                    margin-left: 20px;
                    padding-left: 10px;
                }
            }
            .main-title{
                display: -webkit-flex;
                align-items: center;
                .ipt{
                    width: 160px;
                    height: 37px;
                    border-radius: 10px;
                    border: 1px solid #cccccc;
                    font-size: 14px;
                    color: #606266;
                    padding-left: 10px;
                    margin-left: 20px;
                    outline: none;
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
                .data{
                    display: -webkit-flex;
                    align-items: center;
                    margin-left: 20px;
                    .releaseData{
                        font-size: 14px;
                        color: rgb(102, 102, 102);
                    }
                }
                .el-select{
                    width: 140px;
                    margin-left: 20px;
                }
                .btn{
                    margin-left: 20px;
                    width: 80px;
                    height: 40px;
                    border-radius: 10px;
                    border: none;
                    outline: none;
                    color: #ffffff;
                    font-size: 14px;
                    background: #02B3ED;
                    cursor: pointer;
                }
                .addData{
                    width: 100px;
                    height: 40px;
                    border: 1px solid rgb(2, 179, 237);
                    display: -webkit-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 5px;
                    margin-left: 10%;
                    color: rgb(2, 179, 237);
                    font-size: 16px;
                    cursor: pointer;
                    .add{
                        width: 22px;
                        height: 22px;
                        margin-right: 10px;
                    }
                }
            }
            .main-screen{
                display: -webkit-flex;
                align-items: center;
                height: 50px;
                line-height: 50px;
                p{
                    height: 50px;
                    margin-left: 20px;
                }
                .screen{
                    width: auto;
                    display: -webkit-flex;
                    .list{
                        width: 90px;
                        height: 30px;
                        font-size: 14px;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;
                        border: 1px solid rgb(2, 179, 237);
                        color: rgb(2, 179, 237);
                        margin-left: 20px;
                        border-radius: 25px;
                    }
                    .on{
                        background: rgb(2, 179, 237);
                        color: #ffffff;
                        border: 1px solid rgb(2, 179, 237);
                    }
                }
            }
            .main-tab{
                padding: 30px;
                padding-bottom: 0;
                .el-table{
                    color: #666666;
                    .bg .cell{
                        width: 300px;    
                        overflow: hidden;    
                        text-overflow:ellipsis;    
                        white-space: nowrap;
                    }
                }
                .foo{
                    height: 60px;
                    display: -webkit-flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
    // 删除弹出框
    .deleteBox{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 999;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        .delete{
            width: 45%;
            // height: 264px;
            background: #ffffff;
            border-radius: 10px;
            .delete-title{
                display: -webkit-flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 20px;
                .tip-left{
                    font-size: 20px;
                    color: rgb(51, 51, 51);
                    margin-left: 5%;
                }
                .cancel{
                    width: 30px;
                    height: 30px;
                    margin-right: 5%;
                    cursor: pointer;
                }
            }
            .del-content{
                display: -webkit-flex;
                justify-content: center;
                align-items: center;
                margin-top: 9%;
                .prompt{
                    width: 50px;
                    height: 50px;
                }
                .del{
                    font-size: 16px;
                    color: rgb(102, 102, 102);
                    margin-left: 20px;
                }
            }
            .btn{
                display: -webkit-flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: 8%;
                padding-bottom: 5%;
                .button{
                    width: 90px;
                    height: 36px;
                    margin-right: 5%;
                    border-radius: 10px;
                    font-size: 14px;
                    cursor: pointer;
                    outline: none;
                }
                .determine{
                    background: rgb(2, 179, 237);
                    color: rgb(255, 255, 255);
                    border: none;
                }
                .cancel{
                    color: rgb(102, 102, 102);
                    background: #E6E6E6;
                    border: 1px solid #B3B3B3;
                }
            }
        }
    }
</style>

