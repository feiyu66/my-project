<template>
  <div class="box">
    <div class="treadmill">
        <p class="title">医院管理>合作医院跑步机管理</p>
        <div class="section">
          <div class="head-top"><p>合作医院跑步机管理</p></div>
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
                      label="状态"
                      align="center">
                      <template slot-scope="scope">
                          <el-button 
                            size="small"
                            class="status_data">生成</el-button>
                      </template>
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
    <!-- 新建跑步机/编辑 -->
    <div v-if="editFlag" class="edit_boxs">
      <div class="edit_items">
        <p class="edit_title">{{tooltipWord}}</p>
        <ul class="uls_items">
          <li class="list">
            <p class="list_name list_on">*医院名称：</p>
            <el-col :span="10">
                <el-input v-model="hospitalName" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*跑步机编号：</p>
            <el-col :span="10">
                <el-input v-model="TNumber" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
          <li class="list">
            <p class="list_name list_on">*跑步机授权码：</p>
            <el-col :span="10">
                <el-input v-model="ACode" size="mini" style="width: 100%;"/>
            </el-col>
          </li>
        </ul>
        <div class="btn_box">
            <p class="btn_cancel" @click="editFlag = false">取消</p>
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
        deleteFlag: false, // --- 删除 ----
        editFlag: false, // --- 新建/编辑 ---
        hospitalName: '', // 医院名称
        TNumber: '', // 跑步机编号
        ACode: '', // 跑步机授权码
      }
    },
    methods: {
      NewlyBuild () { // 新建
        this.tooltipWord = '新建跑步机'
        this.editFlag = true
      },     
      handleEdit (row) { // 编辑
        this.tooltipWord = '编辑'
        this.editFlag = true
          console.log(row)
      },
      deleteRow (row , index, rows) { // 删除
        this.deleteFlag = true
          // this.$message({
          //     message: '该用户解绑成功！',
          //     type: 'success'
          // });
      },
      preservationData () {
        if (!this.hospitalName) {
          this.$message.error('医院名称不能为空！');
        } else if (!this.TNumber) {
          this.$message.error('跑步机编号不能为空！');
        } else if (!this.ACode) {
          this.$message.error('跑步机授权码不能为空！');
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
  .treadmill{
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
  .status_data{
    background-color: rgb(2, 179, 237);
    color:rgb(255, 255, 255);
    border: 1px solid rgb(2, 179, 237);
    padding: 5px 15px;
  }
  .status_on{
    background-color: rgb(153, 153, 153);
    border: 1px solid rgb(153, 153, 153);
  }
  .pagination_boxs{
      display: -webkit-flex;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
      padding-bottom: 30px;
  }
  // ---- 删除 ----
  .edit_boxs{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, .3);
      z-index: 1;
  }
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
  // --- 新建跑步机/编辑 ---
  .edit_items{
      width: 60%;
      // height: 30%;
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
      margin-bottom: 15%;
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
</style>
