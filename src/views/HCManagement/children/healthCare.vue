<template>
    <div class="box">
        <div class="healthCare">
            <p class="title">医院管理>医护管理</p>
            <div class="section">
                <div class="head-top"><p>医护管理</p></div>
                <div class="newly_build" @click="NewlyBuild">
                    <img class="filing" src="http://doctor.dlcaring.com/filing.png" alt="">
                    <p class="newly_word">新建</p>
                </div>
                <div class="table_boxs">
                    <el-table
                        :data="tableData"
                        :header-cell-style="getRowClass"
                        style="width: 100%">
                        <el-table-column
                            prop="date"
                            label="日期"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="姓名"
                            align="center"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址"
                            align="center"
                            width="300">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <el-button
                                    size="small"
                                    type="text"
                                    class="edit_word"
                                    @click="handleEdit(scope.row)">编辑</el-button>
                                <el-button
                                    size="small"
                                    type="text"
                                    class="untying_word"
                                    @click.native.prevent="deleteRow(scope.row, scope.$index, tableData)">解绑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination_boxs">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="40">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 新建医护/编辑 -->
        <div v-if="dialogVisible" class="edit_boxs">
            <div class="edit_items">
                <p class="edit_title">{{tooltipWord}}</p>
                <ul class="uls_items">
                    <li class="list">
                        <p class="list_name list_on">*手机号(默认密码1)：</p>
                        <el-col :span="10">
                            <el-input v-model="editPhone" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name list_on">*姓名：</p>
                        <el-col :span="10">
                            <el-input v-model="editName" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">昵称：</p>
                        <el-col :span="10">
                            <el-input v-model="nickname" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name list_on">*密码：</p>
                        <el-col :span="10">
                            <el-input v-model="editPassword" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">性别：</p>
                        <el-col :span="10">
                            <el-select size="mini" style="width: 100%;" v-model="valueSex" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in optionsSex"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">出生日期：</p>
                        <el-col :span="10">
                            <el-date-picker
                                size="mini"
                                style="width:100%;"
                                v-model="dateOfBirth"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">手机号：</p>
                        <el-col :span="10">
                            <el-input v-model="editPhone" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">固定电话：</p>
                        <el-col :span="10">
                            <el-input v-model="telephone" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">邮箱：</p>
                        <el-col :span="10">
                            <el-input v-model="editMailbox" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">QQ号：</p>
                        <el-col :span="10">
                            <el-input v-model="editQQ" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">微信号：</p>
                        <el-col :span="10">
                            <el-input v-model="editWeChat" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">联系地址：</p>
                        <el-col :span="10">
                            <el-input v-model="editAddress" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">邮政编码：</p>
                        <el-col :span="10">
                            <el-input v-model="editCode" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">身份证号：</p>
                        <el-col :span="10">
                            <el-input disabled v-model="editIDNumber" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">单位名称：</p>
                        <el-col :span="10">
                            <el-input v-model="editUnitName" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name list_on">*职业：</p>
                        <el-col :span="10">
                            <el-select size="mini" style="width: 100%;" v-model="editOccupation" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in occupation"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">职级：</p>
                        <el-col :span="10">
                            <el-select size="mini" style="width: 100%;" v-model="editRank" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in rank"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">职称：</p>
                        <el-col :span="10">
                            <el-input v-model="editTitle" size="mini" style="width: 100%;"/>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name list_on">*认证状态：</p>
                        <el-col :span="10">
                            <el-select size="mini" style="width: 100%;" v-model="editAStatus" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in aStatus"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </li>
                    <li class="list">
                        <p class="list_name">认证资料：</p> 
                        <el-col :span="10" style="display: -webkit-flex;">
                            <el-button style="width: 45%" size="mini">认证图1</el-button>
                            <el-button style="width: 45%" size="mini">认证图2</el-button>
                        </el-col>                       
                    </li>
                    <li class="list">
                        <p class="list_name">管理员：</p>
                        <el-col :span="10">
                            <el-checkbox v-model="editAdministrators"></el-checkbox>
                        </el-col>
                    </li>
                </ul>
                <div class="permission_options">
                    <p class="options_word">权限选项：</p>
                    <div class="options_items">
                        <p class="items_list" v-for="(item, index) in permissionOptions" :key="index">
                            <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
                        </p>
                    </div>
                </div>
                <div class="permission_options">
                    <p class="options_word">擅长：</p>
                    <div class="options_box">
                        <textarea class="Be_good_at"></textarea>
                    </div>
                </div>
                <div class="permission_options">
                    <p class="options_word">介绍：</p>
                    <div class="options_box">
                        <textarea class="Be_good_at"></textarea>
                    </div>
                </div>
                <div class="permission_options">
                    <p class="options_word">认证结果：</p>
                    <div class="options_box">
                        <textarea class="Be_good_at"></textarea>
                    </div>
                </div>
                <div class="permission_options">
                    <p class="options_word">备注：</p>
                    <div class="options_box">
                        <textarea class="Be_good_at"></textarea>
                    </div>
                </div>
                <div class="btn_box">
                    <p class="btn_cancel" @click="dialogVisible = false">取消</p>
                    <p class="btn_determine" @click="preservationData">确定</p>
                </div>
            </div>
        </div>
        <!-- 解绑 -->
        <div v-if="untyingFlag" class="edit_boxs">
            <div class="untying_box">
                <p class="untying_title">解绑确认</p>
                <p class="untying_tooltip">确定解绑此用户吗？</p>
                <div class="btn_box">
                    <p class="btn_cancel" @click="untyingFlag = false">取消</p>
                    <p class="btn_determine">确定</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
                }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
                }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            currentPage: 1,
            tooltipWord: '', // 新建/编辑 title
            dialogVisible: false, // --- 编辑 ---
            editPhone: '', // 手机号
            editName: '', // 姓名
            nickname: '', // 昵称
            editPassword: '', // 密码
            optionsSex: [
                {
                    value: '0',
                    label: '=== 空值 ==='
                },
                {
                    value: '1',
                    label: '男'
                },
                {
                    value: '2',
                    label: '女'
                }
            ],
            valueSex: '', // 性别
            dateOfBirth: '', // 出生日期
            telephone: '', // 固定电话
            editMailbox: '', // 邮箱
            editQQ: '', // qq号
            editWeChat: '', // 微信号
            editAddress: '', // 联系地址
            editCode: '', // 邮政编码
            editIDNumber: '', // 身份证号
            editUnitName: '', // 单位名称
            editOccupation: '', // 职业
            occupation: [
                {
                    value: '医师',
                    label: '医师'
                },
                {
                    value: '健管师',
                    label: '健管师'
                },
                {
                    value: '运动师',
                    label: '运动师'
                },
                {
                    value: '营养师',
                    label: '营养师'
                },
                {
                    value: '康复师',
                    label: '康复师'
                },
                {
                    value: '心理师',
                    label: '心理师'
                }
            ],
            editRank: '', // 职级
            rank: [
                {
                    value: '=== 空值 ===',
                    label: '=== 空值 ==='
                },
                {
                    value: '初级',
                    label: '初级'
                },
                {
                    value: '中级',
                    label: '中级'
                },
                {
                    value: '高级',
                    label: '高级'
                },
                {
                    value: '专家',
                    label: '专家'
                },
                {
                    value: '其它',
                    label: '其它'
                }
            ],
            editTitle: '', // 职称
            editAStatus: '', // 认证状态
            aStatus: [
                {
                    value: '无认证',
                    label: '无认证'
                },
                {
                    value: '申请认证',
                    label: '申请认证'
                },
                {
                    value: '认证通过',
                    label: '认证通过'
                },
                {
                    value: '认证失败',
                    label: '认证失败'
                },
            ],
            editAdministrators: false, // 管理员
            permissionOptions: [
                {
                    checked: false,
                    name: '会员建档'
                },
                {
                    checked: false,
                    name: '处方生成'
                },
                {
                    checked: false,
                    name: '添加会员'
                },
                {
                    checked: false,
                    name: '解绑会员'
                },
                {
                    checked: false,
                    name: '分配会员'
                },
                {
                    checked: false,
                    name: '处方审核'
                },
                {
                    checked: false,
                    name: '处方调整'
                },
                {
                    checked: false,
                    name: '健康指导'
                },
                {
                    checked: false,
                    name: '移除会员'
                },
                {
                    checked: false,
                    name: '数据统计'
                }
            ],
            untyingFlag: false, // --- 解绑 ---
        }
    },
    methods: {
        NewlyBuild () { // 新建
            this.tooltipWord = '新建医护'
            this.dialogVisible = true            
        },
        handleEdit (row) { // 编辑
            this.tooltipWord = '编辑'
            this.dialogVisible = true
            console.log(row)
        },
        deleteRow (row , index, rows) { // 解绑
            this.untyingFlag = true
            // this.$message({
            //     message: '该用户解绑成功！',
            //     type: 'success'
            // });
        },
        preservationData () { // 保存数据
            if (!this.editPhone) {
                this.$message.error('手机号不能为空！');
            } else if (!this.editName) {
                this.$message.error('姓名不能为空！');
            } else if (!this.editPassword) {
                this.$message.error('密码不能为空！');              
            } else if (!this.editOccupation) {
                this.$message.error('职业不能为空！');
            } else if (!this.editAStatus) {
                this.$message.error('认证状态不能为空！');                
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        getRowClass ({row, column, rowIndex, columnIndex}) {
            if (rowIndex == 0) {
                return 'background-color: rgb(247, 247, 247);color: rgb(51, 51, 51)'
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .box{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .healthCare{
        padding: 30px;
    }
    .title{
        margin-bottom: 20px;
        font-size: 14px;
        color: rgb(102, 102, 102)
    }
    .section{
        background-color: rgb(255, 255, 255);
        border-radius: 10px;
    }
    .head-top{
        display: -webkit-flex;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        p{
            margin-top: 10px;
            margin-bottom: 10px;
            width: 100%;
            height: 25px;
            line-height: 25px;
            font-style: 17px;
            color: rgb(51, 51, 51);
            border-left: 3px solid #02B3ED;
            margin-left: 20px;
            padding-left: 10px;
        }
    }
    .newly_build{
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
        margin-left: 20px;
        width: 90px;
        height: 32px;
        background-color: rgb(2, 179, 237);
        border-radius: 5px;
        cursor: pointer;
    }
    .filing{
        width: 24px;
        height: 24px;
        margin-right: 10px;
    }
    .newly_word{
        font-size: 16px;
        color:rgb(255, 255, 255);
    }
    .edit_word{
        color: rgb(2, 179, 237);
    }
    .untying_word{
        color:#ff0000;
    }
    .table_boxs{
        margin-left: 30px;
        margin-right: 30px;
    }
    .pagination_boxs{
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        padding-bottom: 30px;
    }
    // ---- 编辑 ----
    .edit_boxs{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 1;
    }
    .edit_items{
        width: 60%;
        height: 60%;
        overflow-y: scroll;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(255, 255, 255);
        border-radius: 10px;
    }
    .edit_title{
        margin-top: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        font-size: 14px;
        color:#666666;
        border-bottom: 1px solid rgb(238, 238, 238);
    }
    .uls_items{
        margin-left: 5%;
        margin-right: 5%;
        display: -webkit-flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .list{
        width: 50%;
        margin-top: 20px;
        display: -webkit-flex;
        align-items: center;
    }
    .list_name{
        width: 45%;
        font-size: 14px;
        color: rgb(102, 102, 102);   
    }
    .list_on{
        color:rgb(255, 0, 0);
    }
    .permission_options{
        margin-left: 5%;
        margin-right: 5%;
        display: -webkit-flex;
        align-items: center;
        margin-top: 20px;
    }
    .options_word{
        width: 23%;
        font-size: 14px;
        color: rgb(102, 102, 102);
    }
    .options_items{
        width: 70%;
        display: -webkit-flex;
        align-items: center;
        flex-wrap: wrap;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
    }
    .items_list{
        padding: 10px;
    }
    .options_box{
        width: 70%;
    }
    .Be_good_at{
        border-radius: 5px;
        border: 1px solid #dcdfe6;
    }
    .btn_box{
        width: 100%;
        margin-top: 20px;
        padding-bottom: 20px;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
    }
    .btn_cancel, .btn_determine{
        width: 20%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
    }
    .btn_cancel{
        border: 1px solid #dcdfe6;
        color: rgb(2, 179, 237);
    }
    .btn_determine{
        border: 1px solid rgb(2, 179, 237);
        background-color: rgb(2, 179, 237);
        color:rgb(255, 255, 255);
        margin-left: 20px;
    }
    // ---- 解绑 ----
    .untying_box{
        width: 30%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(255, 255, 255);
        border-radius: 10px;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
    }
    .untying_title{
        margin-top: 30px;
        font-size: 16px;
        color:#666666;
    }
    .untying_tooltip{
        margin-top: 50px;
        margin-bottom: 30px;
        font-size: 14px;
        color:#666666;
    }
</style>
