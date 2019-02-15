<template>
  <div class="box">
    <div class="cHospital">
        <p class="title">医院管理>合作医院管理</p>
        <div class="section">
          <div class="head-top"><p>合作医院管理</p></div>
          <div class="search_title">
              <el-col :span="4">
                <el-input placeholder="请输入医院代码或名称" size="mini" style="width:100%" />
              </el-col>
              <p class="search_word">查询</p>
          </div>
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
                          class="untying_word">禁用</el-button>
                      <el-button
                          size="small"
                          type="text"
                          class="untying_word"
                          @click.native.prevent="deleteRow(scope.row, scope.$index, tableData)">删除</el-button>
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
    <!-- 新建医院/编辑 -->
    <div v-if="dialogVisible" class="edit_boxs">
      <div class="edit_items">
        <p class="edit_title">{{tooltipWord}}</p>
        <ul class="uls_items">
          <li class="list">
            <p class="list_name list_on">*网点代码：</p>
            <el-col :span="10">
                <el-input v-model="dotCode" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*网点名称：</p>
            <el-col :span="10">
                <el-input v-model="nameOfDot" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">网点简称：</p>
            <el-col :span="10">
                <el-input v-model="dotShort" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*平台费率(%)：</p>
            <el-col :span="10">
                <el-input v-model="platformRate" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*季度费用：</p>
            <el-col :span="10">
                <el-input v-model="quarterlyCost" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*季购上限：</p>
            <el-col :span="10">
                <el-input v-model="upperLimit" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*年度费用：</p>
            <el-col :span="10">
                <el-input v-model="AnnualCost" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*年购上限：</p>
            <el-col :span="10">
                <el-input v-model="AnnualPurchase" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">联系人：</p>
            <el-col :span="10">
                <el-input v-model="contacts" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">手机：</p>
            <el-col :span="10">
                <el-input v-model="mobilePhone" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">电话：</p>
            <el-col :span="10">
                <el-input v-model="telephone" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">传真：</p>
            <el-col :span="10">
                <el-input v-model="fax" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">邮编：</p>
            <el-col :span="10">
                <el-input v-model="zipCode" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">地址：</p>
            <el-col :span="10">
                <el-input v-model="address" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">邮箱：</p>
            <el-col :span="10">
                <el-input v-model="mailbox" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">网站主页：</p>
            <el-col :span="10">
                <el-input v-model="homepage" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">报告标题：</p>
            <el-col :span="10">
                <el-input v-model="reportTitle" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name">LOGO图标：</p>
            <el-col :span="10">
                <el-input v-model="logoIcon" size="mini" style="width: 100%;"/>
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
    <!-- 删除 -->
    <div v-if="deleteFlag" class="edit_boxs">
        <div class="untying_box">
            <p class="untying_title">删除确认</p>
            <p class="untying_tooltip">确定删除此用户吗？</p>
            <div class="btn_box">
                <p class="btn_cancel" @click="deleteFlag = false">取消</p>
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
        tooltipWord: '', // ---- 新建医院/编辑 ----
        dialogVisible: false, // ---- 编辑 ----
        dotCode: '', // 网点代码
        nameOfDot: '', // 网点名称
        dotShort: '', // 网点简称
        platformRate: '', // 平台费率
        quarterlyCost: '', // 季度费用
        upperLimit: '', // 季购上限
        AnnualCost: '', // 年度费用
        AnnualPurchase: '', // 年购上限
        contacts: '', // 联系人
        mobilePhone: '', // 手机
        telephone: '', // 电话
        fax: '', // 传真
        zipCode: '', // 邮编
        address: '', // 地址
        mailbox: '', // 邮箱
        homepage: '', // 网站主页
        reportTitle: '', // 报告标题
        logoIcon: '', // logo图标
        permissionOptions: [ // 权限选项
          {
            checked: false,
            name: '处方审核'
          },
          {
            checked: false,
            name: '康复方案'
          },
          {
            checked: false,
            name: '数据统计'
          },
        ],
        deleteFlag: false, // ---- 删除 ----
      }
    },
    methods: {
      NewlyBuild () { // 新建医院
        this.tooltipWord = '新建医院'
        this.dialogVisible = true
      },
      handleEdit (row) {
        this.tooltipWord = '编辑'
        this.dialogVisible = true
      },
      deleteRow () {
        this.deleteFlag = true
      },
      preservationData () { // 保存数据
        if (!this.dotCode) {
          this.$message.error('网点代码不能为空！');
        } else if (!this.nameOfDot) {
          this.$message.error('网点名称不能为空！');
        } else if (!this.platformRate) {
          this.$message.error('平台费率不能为空！');          
        } else if (!this.quarterlyCost) {
          this.$message.error('季度费用不能为空！');          
        } else if (!this.upperLimit) {
          this.$message.error('季购上限不能为空！');          
        } else if (!this.AnnualCost) {
          this.$message.error('年度费用不能为空！');          
        } else if (!this.AnnualPurchase) {
          this.$message.error('年购上限不能为空！');          
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
  .cHospital{
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
  .search_title{
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: -webkit-flex;
    align-items: center;
  }
  .search_word{
    width: 70px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    font-size: 16px;
    color: rgb(255, 255, 255);
    background-color: rgb(2, 179, 237);
    border-radius: 5px;
    margin-left: 20px;
    cursor: pointer;
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
  .table_boxs{
      margin-left: 30px;
      margin-right: 30px;
  }
  .edit_word{
      color: rgb(2, 179, 237);
  }
  .untying_word{
      color:#ff0000;
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
  // ---- 删除 ----
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
