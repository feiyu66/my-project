<template>
    <div class="box">
        <p class="title">病种统计分布 > 病种分布概述</p>
        <div class="head">
            <div class="head-top"><p>病种分布概述</p></div>
            <div class="block">
                <div class="element-ui">
                    <p>
                        <el-date-picker
                            v-model="startDate"
                            type="date"
                            @change="startTime"
                            placeholder="选择日期">
                        </el-date-picker> 至
                        <el-date-picker
                            v-model="endDate"
                            type="date"
                            @change="endTime"
                            placeholder="选择日期">
                        </el-date-picker>
                    </p>
                    <el-select v-model="value2" ref="selectVal" @change="channelData" filterable placeholder="渠道">
                        <el-option
                            v-for="item in options"
                            :key="item.fName"
                            :label="item.fName"
                            :value="item.fId">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="main">
                <div class="echarts">
                    <Chart :style="flag == false ? 'display: block;' : 'display: none;'" :options="polar" ref='chartVm'></Chart>
                    <p :style="flag == true ? 'display: block;' : 'display: none;'" class="too">暂无数据</p>
                </div>
            </div>
        </div>
        <div class="table-box">
            <div class="tip">
                <p>{{Hospital}} {{startDate}} 至 {{endDate}} 人数统计明细</p>
            </div>
            <div class="table-main">
                <div class="table-left">
                    <p>管理目标</p>
                    <ul class="uls">
                        <li v-for="(item, index) in data" :key="index">{{item}}</li>
                    </ul>
                    <b>合计</b>
                </div>
                <div class="table-left">
                    <p>人数</p>
                    <ul class="uls">
                        <li v-for="(item, index) in tableData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{sum}}</b>
                </div>
                <div class="table-left">
                    <p>占比</p>
                    <ul class="uls">
                        <li v-for="(item, index) in percentage" :key="index">{{item}}</li>
                    </ul>
                    <b></b>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Chart from '../../../components/Charts/Charts.vue'
    import localhost from '../../../util/localhost'
    import hex_md5 from 'js-md5'
    import $ from 'jQuery'
    export default {
        name: 'attributeAnalysis',
        components: {
            Chart
        },
        data () {
            return {
                value2: '', // 选择医院
                Hospital: '', // 提示医院
                flag: false,
                charData: [],
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                sum: 0,
                data:['癌症','代谢综合征','肥胖','高血压','骨关节疾病', '冠心病', '慢阻肺', '糖尿病', '痛风', '血脂异常', '脂肪肝'],
                options: [{fId: '0',
                            fName: '所有医院',
                            fShortname: '所有医院'}],
                polar: {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        top: '20%',
                        right: '10%',
                        data:['癌症','代谢综合征','肥胖','高血压','骨关节疾病', '冠心病', '慢阻肺', '糖尿病', '痛风', '血脂异常', '脂肪肝']
                    },
                    series: []
                },
                tableData: [],
                percentage: []
            };
        },
        mounted () {
            this.upToTop()
            this.Hospital = '所有医院'
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            this.startDate = start
            this.endDate = end
            this.timeData(this.startDate, this.endDate)
            // 获取所有渠道
            $.ajax({
                type: "get",
                url: localhost + "backstage/statistics/allChannels",
                dataType: "json",
                xhrFields:{withCredentials:true},
                headers: {
                    // 'Login_Authorization': localStorage.getItem('token'),
                    // 'User_Id': localStorage.getItem('id')
                },
                data: {},
                success: (data) => {
                    let code = data.code
                    if (code === '200') {
                        data.data.forEach((item) => {
                            this.options.push(item)
                            this.options = this.options.slice(0, 11)
                        })
                    }
                }
            });
            // 根据不同类型和时间获取分布
            this.changeTime()
        },
        watch: {
            charData (value) {
                this.seriesData = []
                this.count = 0
                for(let key in value) {
                    this.seriesData.push(value[key])
                }
                this.seriesData.forEach((i) => {
                    if (i == 0) {
                        this.count++
                    }
                })
                if (this.count == this.seriesData.length) {
                    this.flag = true
                } else {
                    this.flag = false
                    this.polar.series = [
                        {
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: true,
                            tooltip : {
                                trigger: 'item',
                                formatter: "{b} : {c}人 ({d}%)"
                            },
                            label: {
                                show: true
                            },
                            labelLine: {
                                show: true
                            },
                            data:[
                                {value:this.seriesData[0], name:'癌症'},
                                {value:this.seriesData[1], name:'代谢综合征'},
                                {value:this.seriesData[2], name:'肥胖'},
                                {value:this.seriesData[3], name:'高血压'},
                                {value:this.seriesData[4], name:'骨关节疾病'},
                                {value:this.seriesData[5], name:'冠心病'},
                                {value:this.seriesData[6], name:'慢阻肺'},
                                {value:this.seriesData[7], name:'糖尿病'},
                                {value:this.seriesData[8], name:'痛风'},
                                {value:this.seriesData[9], name:'血脂异常'},
                                {value:this.seriesData[10], name:'脂肪肝'}
                            ]
                        }
                    ]
                    this.$refs.chartVm.setOption(this.polar)
                }
                
            }
        },
        methods: {
            startTime () { // change时间
                this.timeData(this.startDate, this.endDate)
                this.changeTime()
            },
            endTime () { // change时间
                this.timeData(this.startDate, this.endDate)
                this.changeTime()
            },
            channelData () { // change医院渠道
                for(let i in this.options) {
                    if (this.value2 == this.options[i].fId) {
                        this.Hospital = this.options[i].fName
                    }
                }
                this.changeTime()
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index] += '';
                } else {
                    sums[index] = 'N/A';
                }
                });

                return sums;
            },
            timeData (start, end){
                let newDate1 = new Date(start);
                let newDate2 = new Date(end);
                // 开始时间
                let Month = newDate1.getMonth() + 1
                let Data = newDate1.getDate()
                if (Month < 10) {
                    Month =  '0' + Month
                }
                if (Data < 10) {
                    Data =  '0' + Data
                }
                this.startDate = newDate1.getFullYear() + '-' + Month + '-' + Data
                // 结束时间
                let Month2 = newDate2.getMonth() + 1
                let Data2 = newDate2.getDate()
                if (Month2 < 10) {
                    Month2 =  '0' + Month2
                }
                if (Data2 < 10) {
                    Data2 =  '0' + Data2
                }
                this.endDate = newDate2.getFullYear() + '-' + Month2 + '-' + Data2
            },
            changeTime () {
                this.tableData = []
                this.percentage = []
                this.sum = 0
                if(this.value2 == '0') {
                    this.options = [{fId: '0',
                            fName: '所有医院',
                            fShortname: '所有医院'}],
                    $.ajax({
                        type: "get",
                        url: localhost + "backstage/statistics/allChannels",
                        dataType: "json",
                        data: {},
                        headers: {
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        xhrFields:{withCredentials:true},
                        success: (data) => {
                            let code = data.code
                            if (code === '200') {
                                data.data.forEach((item) => {
                                    this.options.push(item)
                                })
                            }
                        }
                    });
                    $.ajax({
                        type: "get",
                        url: localhost + "backstage/statistics/distribute/8",
                        dataType: "json",
                        data: {
                            time: this.startDate + 'x' + this.endDate
                        },
                        xhrFields:{withCredentials:true},
                        headers: {
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        success: (data) => {
                            let code = data.code
                            if (code === '200') {
                                this.charData = data.data
                                for(let key in data.data) {
                                    this.tableData.push(data.data[key])
                                    this.sum += data.data[key]
                                }
                                this.tableData.map(item => {
                                    if(item == 0) {
                                        this.percentage.push('0%')
                                    } else {
                                        this.percentage.push(((item/ this.sum).toFixed(2) * 100).toFixed(0) + '%')
                                    }
                                })
                            }
                        }
                    });
                } else {
                   $.ajax({
                        type: "get",
                        url: localhost + "backstage/statistics/distribute/8",
                        dataType: "json",
                        data: {
                            time: this.startDate + 'x' + this.endDate,
                            channelId: this.value2
                        },
                        xhrFields:{withCredentials:true},
                        headers: {
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        success: (data) => {
                            let code = data.code
                            if (code === '200') {
                                this.charData = data.data
                                for(let key in data.data) {
                                    this.tableData.push(data.data[key])
                                    this.sum += data.data[key]
                                }
                                this.tableData.map(item => {
                                    if(item == 0) {
                                        this.percentage.push('0%')
                                    } else {
                                        this.percentage.push(((item/ this.sum).toFixed(2) * 100).toFixed(0) + '%')
                                    }
                                })
                            }
                        }
                    }); 
                }
                
            }
        }
    }
</script>
<style lang="less" scoped>
    .box{
        margin: 30px;
    }
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
        .block{
            height: 50px;
            display: -webkit-flex;
            align-items: center;
            justify-content: flex-end;
            .element-ui{
                width: 700px;
                display: -webkit-flex;
                align-items: center;
                justify-content: space-around;
                p{
                    display: -webkit-flex;
                    align-items: center;
                    .el-date-editor.el-input, .el-date-editor.el-input__inner{
                        margin: 0 5px;
                        width: 150px;
                    }
                }
                .el-date-editor{
                    width: 300px;
                    .el-input__inner{
                        width: 300px;
                        height: 30px;
                        line-height: 30px;
                    }
                }
                .el-select{
                    width: 150px;
                    .el-input{
                        .el-input__inner{
                            height: 30px;
                            line-height: 30px;
                        }
                    }
                }
            }
        }
    }
    .main{
        .echarts{
            height: 500px;
            position: relative;
            .too{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: #cccccc;
            }
        }
    }
    .table-box{
        margin-top: 20px;
        background-color: #fff;
        border-radius: 10px;
        .tip{
            height: 50px;
            display: -webkit-flex;
            align-items: center;
            border-bottom: 1px solid #eeeeee;
            p{
                width: 100%;
                height: 25px;
                line-height: 25px;
                border-left: 3px solid #02B3ED;
                margin-left: 20px;
                padding-left: 10px;
            }
        }
        .table-main{
            padding: 20px;
            display: -webkit-flex;
            flex-direction: row;
            .table-left{
                width: 240px;
                display: -webkit-flex;
                flex-direction: column;
                p, b{
                    width: 100%;
                    height: 60px;
                    display: -webkit-flex;
                    justify-content: center;
                    align-items: center;
                    color: #0CB5ED;
                }
                p{
                    background: #EEEEEE;
                }
                b{
                    background: #F7F7F7
                }
                .uls{
                    li{
                       width: 100%;
                        height: 60px;
                        display: -webkit-flex;
                        justify-content: center;
                        align-items: center;
                        color: #666666;
                        &:nth-child(even){
                            background: #F7F7F7;
                        }
                    }
                }
            }
        }
    }
    
</style>
