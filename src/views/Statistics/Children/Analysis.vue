<template>
    <div class="box" ref="box">
        <p class="title">体检人次统计分布>体检人员属性分布</p>
        <div class="head">
            <div class="head-top"><p>体检人员属性分布</p></div>
            <div class="main">
                <div class="main-top">
                    <ul class="uls">
                        <li :class="num == index ? 'on': ''" v-for="(item, index) in data" :key='index' @click="switchData(index)">{{item}}</li>
                    </ul>
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
                </div>
                <div class="main-echarts">
                    <div class="echarts" v-if="num == '0'">
                        <Charts :options="polar" ref='barCharts'></Charts>
                    </div>
                    <div class="echarts" v-if="num == '1'">
                        <Charts :options="polar2" ref='pieCharts'></Charts>
                    </div>
                    <div class="echarts" v-if="num == '2'">
                        <Charts :options="polar3" ref='doubleCharts'></Charts>
                    </div>
                </div>
            </div>  
        </div>
        <div class="footer">
            <div class="tip">
                <p>{{startDate}} 至 {{endDate}} 人数统计明细</p>
                <!-- <button @click="exportOffice(this,'targetTable','excel下载')">导出</button> -->
            </div>
            <table class="targetTable" id="targetTable">
                <tr align="center">
                    <th>统计</th>
                    <th>男性</th>
                    <th>女性</th>
                    <th>合计</th>
                </tr>
                <tr align="center">
                    <td>年龄段</td>
                    <td>人数</td>
                    <td>人数</td>
                    <td>人数(百分比)</td>
                </tr>
                <tr align="center" v-for="(item, index) in targetTable" :key="index">
                    <td>{{item.age}}</td>
                    <td>{{item.maleData}}</td>
                    <td>{{item.femaleData}}</td>
                    <td>{{item.totalData}}</td>
                </tr>
                <tr class="foot" align="center">
                    <td>合计</td>
                    <td>{{mSum}}</td>
                    <td>{{fSum}}</td>
                    <td>{{totalSum}}</td>
                </tr>
                <!-- <div class="table-left">
                    <p>统计</p>
                    <p>年龄段</p>
                    <ul class="uls">
                        <li v-for="(item, index) in age" :key="index">{{item}}</li>
                    </ul>
                    <b>合计</b>
                </div>
                <div class="table-left">
                    <p>男性</p>
                    <p>人数</p>
                    <ul class="uls">
                        <li v-for="(item, index) in maleData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{mSum}}</b>
                </div>
                <div class="table-left">
                    <p>女性</p>
                    <p>人数</p>
                    <ul class="uls">
                        <li v-for="(item, index) in femaleData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{fSum}}</b>
                </div>
                <div class="table-left">
                    <p>合计</p>
                    <p>人数（百分比）</p>
                    <ul class="uls">
                        <li v-for="(item, index) in totalData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{totalSum}}</b>
                </div> -->
                <!-- <el-table
                    :data="tableTime"
                    border
                    stripe
                    show-summary
                    :summary-method = 'getSummaries'
                    style="width: 100%;">
                    <el-table-column align="center" label="统计">
                        <el-table-column
                            prop="city"
                            align="center"
                            label="年龄段"
                            width="180">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="男性">
                        <el-table-column
                            prop="sex.m.count"
                            align="center"
                            label="人数（百分比）"
                            width="180">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="女性">
                        <el-table-column
                            prop="sex.f.count"
                            align="center"
                            label="人数（百分比）"
                            width="180">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="合计">
                        <el-table-column
                            prop="count"
                            align="center"
                            label="人数（百分比）"
                            width="180">
                        </el-table-column>
                    </el-table-column>
                </el-table> -->
            </table>
        </div>
    </div>
</template>
<script>
    import Charts from '../../../components/Charts/Charts.vue'
    import localhost from '../../../util/localhost'
    import $ from 'jQuery'
    export default {
        name: 'analysis',
        components: {
            Charts
        },
        data () {
            return{
                num: 0,
                idxData: 1,
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                data: ['年龄分布', '性别分布', '年龄-性别分布'],
                age: ['<25', '25-29',  '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65以上'],
                charData: [],
                tableData: [],
                targetTable: [],
                maleData: [], // 男性人数
                mSum: 0, // 男性总人数
                femaleData: [], // 女性人数
                fSum: 0, // 女性总人数
                totalData: [], // 男女总人数及比率
                totalSum: 0, // 男女总人数及比率
                count: 0,
                percent: 0,
                polar: {},
                polar2: {},
                polar3: {}
            }
        },
        watch: {
            charData (value) {
                if (this.idxData == '1') {
                    this.seriesData = []
                    for(let key in value) {
                        this.seriesData.push(value[key])
                    }
                    this.polar = {
                        title : {
                            text: '体检人员年龄分布图 ',
                            x:'center',
                            textStyle: {
                                fontFamily: '300'
                            }
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{b} : {c}人"
                        },
                        xAxis: {
                            type: 'category',
                            data: ['<25', '25-29',  '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65以上']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                data: this.seriesData,
                                type: 'bar',
                                barWidth: '30%', // 柱条宽度
                                itemStyle:{
                                    color: '#02b3ed'
                                }
                            }
                        ]
                    }
                    this.$refs.barCharts.setOption(this.polar, true)
                } else if (this.idxData == '2') {
                    this.seriesData2 = []
                    for(let key in value) {
                        this.seriesData2.push(value[key])
                    }
                    this.polar2 = {
                        title : {
                            text: '体检人员性别分布图',
                            textStyle: {
                                fontFamily: '300'
                            },
                            x:'center'
                        },
                        color: ['#b5413d', '#306cb5'],
                        grid: {
                            top: '20%'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{b} : {c}人 ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            top: '10%',
                            right: '20%',
                            data: ['女', '男']
                        },
                        series : [
                            {
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:[
                                    {value:this.seriesData2[0], name:'女'},
                                    {value:this.seriesData2[1], name:'男'}
                                ],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                    this.$refs.pieCharts.setOption(this.polar2, true)
                } else if (this.idxData == '3') {
                    this.sexF = []
                    this.sexM = []
                    for(let key in value){
                        for(let i in value[key].sex){
                            if (i == 'f') { // 女
                                this.sexF.push(value[key].sex[i].count)
                            } else if (i == 'm') {
                                this.sexM.push(value[key].sex[i].count)
                            }
                        }
                    }
                    this.polar3 = {
                        title : {
                            text: '体检人员年龄－性别分布图 ',
                            textStyle: {
                                fontFamily: '300'
                            },
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            top: '20%'
                        },
                        legend: {
                            data:['女','男'],
                            top: '10%',
                            right: '10%'
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                dataView : {show: true, readOnly: false},
                                magicType : {show: true, type: ['line', 'bar']},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : this.age
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'女',
                                type:'bar',
                                data: this.sexF,
                                itemStyle:{
                                    color: '#b5413d'
                                },
                                markPoint : {
                                    data : [
                                        {type : 'max', name: '最大值'},
                                        {type : 'min', name: '最小值'}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name: '平均值'}
                                    ]
                                }
                            },
                            {
                                name:'男',
                                type:'bar',
                                data: this.sexM,
                                markPoint : {
                                    data : [
                                        {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                                        {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                                    ]
                                },
                                itemStyle:{
                                    color: '#306cb5'
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name : '平均值'}
                                    ]
                                }
                            }
                        ]
                    }
                    this.$refs.doubleCharts.setOption(this.polar3, true)
                }
            }
        },
        mounted () {
            this.upToTop()
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            this.startDate = start
            this.endDate = end
            this.Hospital(this.startDate, this.endDate)
            this.defaultData()
            this.timeData()
        },
        methods:{
            base64 (content) {
                return window.btoa(unescape(encodeURIComponent(content)));         
            },
            exportOffice(dom,tableID,fName){
                var type = 'excel';
                var table = document.getElementById(tableID);
                var excelContent = table.innerHTML;
                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"+type+"' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += "<meta http-equiv=Content-Type; content=text/html;charset=UTF-8>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "{worksheet}";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body><table>";
                excelFile += excelContent;
                excelFile += "</table></body>";
                excelFile += "</html>";
                var base64data = "base64," + this.base64(excelFile);
                switch(type){
                    case 'excel':
                        window.open('data:application/vnd.ms-'+type+';'+base64data);
                        // dom.href ='data:application/vnd.ms-'+type+';'+base64data;;//必须是a标签，否则无法下载改名
                        // dom.download = fName;
                    break;
                }
            },
            startTime () {
                this.Hospital(this.startDate, this.endDate)
                this.defaultData()
                this.timeData()
            },
            endTime () {
                this.Hospital(this.startDate, this.endDate)
                this.defaultData()
                this.timeData()
            },
            switchData(index) {
                this.num = index
                this.idxData = index + 1
                this.timeData()
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    data.map((item) => {
                        for(let key in item.sex) {
                            if(key == 'f'){
                                
                            }
                            // console.log(item.sex[key])
                        }
                    })
                    // console.log(data)
                    const values = data.map(item => Array(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 人';
                    } else {
                        sums[index] = 'N/A';
                    }
                });
                return sums;
            },
            Hospital (start, end){
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
            defaultData (){
                this.targetTable = []
                this.totalData = []
                this.femaleData = []
                this.maleData = []
                this.fSum = 0
                this.mSum = 0
                this.count = 0
                this.percent = 0
                $.ajax({
                    type: "get",
                    url: localhost + "backstage/statistics/distribute/3",
                    dataType: "json",
                    data: {
                        time: this.startDate + 'x' + this.endDate
                    },
                    xhrFields:{withCredentials:true},
                    // headers: {
                    //     'Login_Authorization': localStorage.getItem('token'),
                    //     'User_Id': localStorage.getItem('id')
                    // },
                    success: (data) => {
                        let code = data.code
                        if (code === '200') {
                            for(let key in data.data) {
                                let obj = {}
                                let arr = key.split(/\_/)
                                if(arr[1] == '24') {
                                    obj.age = '<25'
                                } else if (arr.length == 3) {
                                    obj.age = arr[1] + '-' + arr[2]
                                } else if (arr[1] == '65') {
                                    obj.age = arr[1] + '以上'
                                }
                                obj.totalData = data.data[key].count + ' (' + (data.data[key].percent * 100).toFixed(0) + '%)'
                                this.count +=  data.data[key].count
                                this.percent+= data.data[key].percent
                                this.totalSum = this.count + ' (' + this.percent.toFixed(0) * 100 + '%)'
                                for(let i in data.data[key].sex) {
                                    if (i == 'f') { // 女
                                        obj.femaleData = (data.data[key].sex[i].count)
                                        this.fSum += data.data[key].sex[i].count
                                    } else if (i == 'm') {
                                        obj.maleData = (data.data[key].sex[i].count)
                                        this.mSum += data.data[key].sex[i].count
                                    }
                                }
                                this.targetTable.push(obj)
                            }
                        }
                    }
                });
            },
            timeData () {
                $.ajax({
                    type: "get",
                    url: localhost + "backstage/statistics/distribute/" + this.idxData,
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
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
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
        }
        .main{
            .main-top{
                display: -webkit-flex;
                justify-content: space-between;
                align-items: center;
                background-color: #F8F8F8;
                height: 50px;
                border-bottom: 1px solid #ccc;
                .uls{
                    height: 50px;
                    display: -webkit-flex;
                    li{
                        width: 150px;
                        height: 50px;
                        display: -webkit-flex;
                        justify-content: center;
                        align-items: center;
                        border-right: 1px solid #ccc;
                        cursor: pointer;
                    }
                    .on{
                        background: #fff;
                        border-top: 2px solid #02B3ED;
                        border-right: none;
                        color: #02B3ED;
                    }
                }
                p{
                    margin-right: 50px;
                }
                .el-date-editor.el-input, .el-date-editor.el-input__inner{
                    width: 150px;
                }
                .el-range-editor.el-input__inner{
                    width: 150px;
                    padding: 0 10px;
                    
                }
                .el-input__inner{
                    width: 150px;
                    height: 30px;
                    line-height: 30px;
                }
            }
            .main-echarts{
                margin-top: 10px;
                height: 400px;
                .echarts{
                    height: 400px;
                }
            }
        }
        .footer{
            background-color: #fff;
            border-radius: 10px;
            margin-top: 20px;
            padding-bottom: 10px;
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
            .targetTable{
                margin: 20px;
                .foot{
                    color: #0CB5ED;
                }
                tr{
                    height: 60px;
                    th, td{
                        width: 200px;
                        height: 100%;
                        text-align: center;
                        line-height: 60px;
                    }
                    td:nth-child(2), td:nth-child(3){
                        color: #999999;
                    }
                    td:last-child{
                        color: #02B3ED;
                    }
                    &:nth-child(1){
                        th{
                            color: #333333;
                            &:last-child{
                                color: #0CB5ED;
                            }
                        }
                    }
                    &:nth-child(2){
                        td{
                            color: #666666;
                            &:last-child{
                                color: #0CB5ED;
                            }
                        }
                    }
                    &:nth-child(odd){
                        background: #F7F7F7;
                    }
                    td:nth-child(1){
                        color: #666666;
                    }
                    &:last-child{
                        td{
                            color: #02B3ED;
                        }
                    }
                    // p, b{
                    //     width: 100%;
                    //     height: 60px;
                    //     display: -webkit-flex;
                    //     justify-content: center;
                    //     align-items: center;
                    // }
                    // p{
                    //     background: #EEEEEE;
                    //     &:nth-child(2){
                    //         background: none;
                    //     }
                    // }
                    // b{
                    //     background: #F7F7F7;
                    //     color: #0CB5ED;
                    // }
                    // .uls{
                    //     li{
                    //     width: 100%;
                    //         height: 60px;
                    //         display: -webkit-flex;
                    //         justify-content: center;
                    //         align-items: center;
                    //         &:nth-child(odd){
                    //             background: #F7F7F7;
                    //         }
                    //     }
                    // }
                    // &:nth-child(4){
                    //     color: #0CB5ED;
                    // }
                }
            }
        }
    }
</style>

