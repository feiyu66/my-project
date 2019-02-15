<template>
    <div class="box" ref="box">
        <p class="title">体检人次统计分布>体检人次统计</p>
        <div class="head">
            <div class="head-top"><p>体检人次统计</p></div>
            <div class="block">
                <div class="element-ui">
                    <p>
                        <el-date-picker
                            v-model="startDate"
                            type="date"
                            @change="startTime"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                        </el-date-picker> 至
                        <el-date-picker
                            v-model="endDate"
                            @change="endTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </p>
                    <ul class="boo"><li>{{contentData}}</li></ul>
                </div>
                <el-select v-model="value2" @change="channelData" filterable placeholder="渠道">
                    <!-- tableDataEnd.slice((currentPage-1)*pagesize, currentPage*pagesize) -->
                    <el-option
                        v-for="item in options"
                        :key="item.fName"
                        :label="item.fName"
                        :value="item.fId">
                    </el-option>
                </el-select>
            </div>
            <div class="main">
                <ul class="uls">
                    <li class="list" :class="sum == index ? 'on' : ''" v-for="(item, index) in title" :key='index' @click='lineData(index, item.id)'>{{item.name}}</li>
                </ul>
                <div class="echarts">
                    <Chart :options="polar" ref='chartVm'></Chart>
                    <p v-if="flag" class="too">暂无数据</p>
                </div>
            </div>
        </div>
        <div class="table-box">
            <div class="tip">
                <p>{{Hospital}} {{promptingTime}} 人数统计明细</p>
                <!-- <button @click="exportOffice(this,'targetTable','excel下载')">导出</button> -->
            </div>
            <div class="table-main">
                <el-table
                    :data="tableData"
                    stripe
                    :default-sort="{prop: 'time', order: 'descending'}"
                    show-summary
                    :summary-method = 'getSummaries'
                    style="width: 100%;">
                    <el-table-column
                        prop="time"
                        align="center"
                        label="日期"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="guaHao"
                        label="体检人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="xinFeiNaiLi"
                        label="心肺耐力检查人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="xinXueGuan"
                        label="心血管体测人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="tiChengFen"
                        label="体成份检测人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="tiShiNeng"
                        label="体适能检测人次">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="wenJuan"
                        label="评估问卷">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="addData">
            <p @click='addData' :style="status === true ? 'display: block;' : 'display: none;'">加载更多</p>
            <p :style="all === true ? 'display: block;' : 'display: none;'" >已加载全部</p>
        </div>
    </div>
</template>
<script>
    import Chart from '../../../components/Charts/Charts.vue'
    import localhost from '../../../util/localhost'
    import hex_md5 from 'js-md5'
    import $ from 'jQuery'
    export default {
        name: 'attribute',
        components: {
            Chart
        },
        data () {
            return {
                result: [],
                resultTableData: [],
                scrollWatch: true,
                type: 1,
                value1: [], // 选择时间
                value2: '', // 选择医院,
                Hospital: '', // 提示医院
                flag: false,
                status: false, // 点击加载更多
                all: false, // 提示加载完毕
                contentData: '最近一周',
                promptingTime : '最近一周',
                startSize: 0, // 起始位置
                pageSize: 20, // 点击加载的数据
                sum: 0,
                charData: [],
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', start);
                            }
                        }, 
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', start);
                            }
                        }, 
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', start);
                            },
                        },
                        {
                            text: '最近六个月',
                            onClick(picker) {
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                                picker.$emit('pick', start);
                            },
                        }
                    ]
                },
                options: [{fId: '0',
                            fName: '所有医院',
                            fShortname: '所有医院'}],
                title: [
                    {
                        id: '1',
                        name: '体检人次'
                    },
                    {
                        id: '4',
                        name: '心肺耐力检查人次'
                    },
                    {
                        id: '5',
                        name: '心血管体测人次'
                    },
                    {
                        id: '3',
                        name: '体成份检测人次'
                    },
                    {
                        id: '2',
                        name: '体适能检测人次'
                    },
                    {
                        id: '6',
                        name: '评估问卷'
                    }
                ],
                polar: {
                    tooltip: {
                        formatter: "{b} : {c}人"
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        splitLine: { // 是否显示刻度线
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#666666'
                            }
                        },
                        axisTick: { // 是否显示坐标轴刻度
                            show: false
                        },
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            showMinLabel: false //是否显示最小刻度
                        },
                        axisTick: { // 是否显示坐标轴刻度
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#666666'
                            }
                        },
                        splitLine: {
                            show: false,
                            // lineStyle: { // 分割线
                            //     type: 'dashed'
                            // }
                        }
                    },
                    series: []
                },
                tableData: [],
                clickTableData: []
            };
        },
        mounted () {
            this.upToTop()
            this.Hospital = '所有医院'
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.startDate = start
            this.endDate = end
            this.timeData(this.startDate, this.endDate)
            // 获取所有渠道
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
                            this.options = this.options.slice(0, 11)
                        })
                    }
                }
            });
            // 根据时间/渠道/类型查询统计人数
            // 根据时间，页码返回所有类型的统计人数，第一页数据包含总计，其他的页码不包含总计
            this.ajaxData()
            this.getBetweenDateStr(this.startDate,this.endDate)
        },
        watch: {
            charData (value) {
                let seriesData = []
                let xAxisData = []
                let resultData = []
                if(value.length > 0){
                    this.flag = false
                    this.result.forEach(item => {
                        let obj = {}
                        obj.time = item
                        obj.peopleCount = 0
                        resultData.push(obj)
                    })
                    for(let i=0; i<resultData.length; i++) {
                        let temTime = resultData[i].time
                        for(let j=0; j<value.length;j++) {
                            if (temTime == value[j].time) {
                               resultData[i]['peopleCount'] = value[j]['peopleCount']
                               break;
                            }
                        }
                    }
                    resultData.forEach((item) => {
                        seriesData.push(item.peopleCount)
                        xAxisData.push(item.time)
                    })
                    this.polar.xAxis.data = xAxisData
                    this.polar.series = [
                        {
                            data: seriesData,
                            type: 'line',
                            itemStyle : { 
                                normal : { 
                                    color:'#02B3ED'
                                }  
                            }
                        }
                    ]
                    this.$refs.chartVm.setOption(this.polar)
                } else{
                    this.flag = true
                    this.polar.xAxis.data = []
                    this.polar.series = [
                        {
                            data: [],
                            type: 'line'
                        }
                    ]
                    this.$refs.chartVm.setOption(this.polar)
                }
            }
        },
        methods: {
            getBetweenDateStr (start,end){
                this.result = []
                var beginDay = start.split("-");
                var endDay = end.split("-");
                var diffDay = new Date();
                var dateList = new Array;
                var i = 0;
                diffDay.setDate(beginDay[2]);
                diffDay.setMonth(beginDay[1]-1);
                diffDay.setFullYear(beginDay[0]);
                this.result.push(start);
                while(i == 0){
                    var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
                    diffDay.setTime(countDay);
                    dateList[2] = diffDay.getDate();
                    dateList[1] = diffDay.getMonth() + 1;
                    dateList[0] = diffDay.getFullYear();
                    if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
                    if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
                    this.result.push(dateList[0]+"-"+dateList[1]+"-"+dateList[2]);
                    if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){ i = 1;
                    }
                };
            },
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
                this.timeData(this.startDate, this.endDate)
                this.getBetweenDateStr(this.startDate, this.endDate)
                this.ajaxData()
                let Millisecond = new Date(this.endDate) - new Date(this.startDate)
                if(Millisecond /(1000 * 60 * 60 * 24) == '7'){
                    this.contentData = '最近一周'
                    this.promptingTime = '最近一周'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '30') {
                    this.contentData = '最近一个月'
                    this.promptingTime = '最近一个月'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '90') {
                    this.contentData = '最近三个月'
                    this.promptingTime = '最近三个月'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '180') {
                    this.contentData = '最近六个月'
                    this.promptingTime = '最近六个月'
                } else {
                    this.contentData = Math.abs(Millisecond / (1000 * 60 * 60 * 24)) + '天内的数据'
                    this.promptingTime = this.startDate + ' 至 ' + this.endDate
                }
            },
            endTime () {
                this.timeData(this.startDate, this.endDate)
                this.getBetweenDateStr(this.startDate,this.endDate)
                this.ajaxData()
                let Millisecond = new Date(this.endDate) - new Date(this.startDate)
                if(Millisecond /(1000 * 60 * 60 * 24) == '7'){
                    this.contentData = '最近一周'
                    this.promptingTime = '最近一周'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '30') {
                    this.contentData = '最近一个月'
                    this.promptingTime = '最近一个月'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '90') {
                    this.contentData = '最近三个月'
                    this.promptingTime = '最近三个月'
                } else if (Millisecond /(1000 * 60 * 60 * 24) == '180') {
                    this.contentData = '最近六个月'
                    this.promptingTime = '最近六个月'
                } else {
                    this.contentData = Math.abs(Millisecond / (1000 * 60 * 60 * 24)) + '天内的数据'
                    this.promptingTime = this.startDate + ' 至 ' + this.endDate
                }
            },
            channelData () { // change医院渠道
                for(let i in this.options) {
                    if (this.value2 == this.options[i].fId) {
                        this.Hospital = this.options[i].fName
                    }
                }
                this.ajaxData()
            },
            lineData (index, id) { // change时间
                this.sum = index
                this.type = id
                this.ajaxData()
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
            ajaxData (){
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
                        url: localhost + "backstage/statistics/peopleCount",
                        dataType: "json",
                        data: {
                            type: this.type,
                            time: this.startDate + 'x' + this.endDate
                        },
                        xhrFields:{withCredentials:true},
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        success: (data) => {
                            if (data.code === '200') {
                                this.charData = data.data.results
                            }
                        }
                    });
                    $.ajax({
                        type: 'get',
                        url: localhost + 'backstage/statistics/allTypes',
                        dataType: 'json',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        xhrFields:{withCredentials:true},
                        data: {
                            time: this.startDate + 'x' + this.endDate,
                            channelId: this.value2
                        },
                        success: (data) => {
                            if (data.code === '200') {
                                this.resultData(data.data.typeCounts)
                                if (this.resultTableData.length >= this.pageSize) {
                                    this.status = true
                                    this.clickTableData = this.resultTableData.reverse()
                                    this.tableData = this.clickTableData.slice(this.startSize, this.pageSize)
                                } else {
                                    this.status = false
                                    this.tableData = this.resultTableData
                                }
                                
                            }
                        }
                    })
                } else {
                    $.ajax({
                        type: "get",
                        url: localhost + "backstage/statistics/peopleCount",
                        dataType: "json",
                        data: {
                            type: this.type,
                            time: this.startDate + 'x' + this.endDate,
                            channelId: this.value2
                        },
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        xhrFields:{withCredentials:true},
                        success: (data) => {
                            if (data.code === '200') {
                                this.charData = data.data.results
                            }
                        }
                    });
                    // 根据时间，页码返回所有类型的统计人数，第一页数据包含总计，其他的页码不包含总计
                    $.ajax({
                        type: 'get',
                        url: localhost + 'backstage/statistics/allTypes',
                        dataType: 'json',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            // 'Login_Authorization': localStorage.getItem('token'),
                            // 'User_Id': localStorage.getItem('id')
                        },
                        xhrFields:{withCredentials:true},
                        data: {
                            time: this.startDate + 'x' + this.endDate,
                            channelId: this.value2
                        },
                        success: (data) => {
                            if (data.code === '200') {
                                this.resultData(data.data.typeCounts)
                                if (this.resultTableData.length > this.pageSize) {
                                    this.status = true
                                    this.clickTableData = this.resultTableData.reverse()
                                    this.tableData = this.clickTableData.slice(this.startSize, this.pageSize)
                                } else {
                                    this.status = false
                                    this.tableData = this.resultTableData
                                }
                            }
                        }
                    })
                }
            },
            addData () {
                this.tableData = this.clickTableData.slice(this.startSize, this.pageSize += this.pageSize)
                if (this.tableData.length === this.clickTableData.length) {
                    this.all = true
                    this.status = false
                } else {
                    this.all = false
                }
            },
            resultData (typeCounts){
                this.resultTableData = []
                this.result.forEach(item => {
                    let obj = {}
                    obj.guaHao = 0
                    obj.tiChengFen = 0
                    obj.tiShiNeng = 0
                    obj.time = item
                    obj.wenJuan = 0
                    obj.xinFeiNaiLi = 0
                    obj.xinXueGuan = 0
                    this.resultTableData.push(obj)
                })
                for(let i=0; i<this.resultTableData.length; i++) {
                    let temTime = this.resultTableData[i].time
                    for(let j=0; j<typeCounts.length;j++) {
                        if (temTime == typeCounts[j].time) {
                            this.resultTableData[i]['guaHao'] = typeCounts[j]['guaHao']
                            this.resultTableData[i]['tiChengFen'] = typeCounts[j]['tiChengFen']
                            this.resultTableData[i]['tiShiNeng'] = typeCounts[j]['tiShiNeng']
                            this.resultTableData[i]['wenJuan'] = typeCounts[j]['wenJuan']
                            this.resultTableData[i]['xinFeiNaiLi'] = typeCounts[j]['xinFeiNaiLi']
                            this.resultTableData[i]['xinXueGuan'] = typeCounts[j]['xinXueGuan']
                            break;
                        }
                    }
                }
            },
            timeData (start, end){
                let newDate1 = ''
                let newDate2 = ''
                if(new Date(end) - new Date(start) < 0) {
                    newDate1 = new Date(end);
                    newDate2 = new Date(start);
                } else {
                    newDate1 = new Date(start);
                    newDate2 = new Date(end);
                }
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
            }
        }
    }
</script>
<style>
    .el-picker-panel .el-date-picker .el-popper .has-sidebar {
        position: absolute;
        left: 10%;
    }
</style>

<style lang="less" scoped>
    .box{
        padding: 30px;
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
            justify-content: space-between;
            .element-ui{
                display: -webkit-flex;
                align-items: center;
                margin-left: 50px;
                .boo{
                    font-size: 14px;
                    color: rgb(102, 102, 102);
                    margin-left: 30px;
                    counter-reset: count;
                    li:before{
                        content: '●';
                        color: #02B3ED;
                        padding-right: 5px;
                    }
                }
                .el-date-editor.el-input, .el-date-editor.el-input__inner{
                    width: 150px;
                }
                .el-date-editor{
                    width: 300px;
                    .el-input__inner{
                        width: 300px;
                        height: 30px;
                        line-height: 30px;
                    }
                }
                .el-range-editor.el-input__inner{
                    padding: 0 10px;
                }
                .el-input__inner{
                    width: 270px;
                    height: 30px;
                    line-height: 30px;
                }
            }
            .el-select{
                width: 180px;
                margin-right: 50px;
                .el-input__inner{
                    width: 180px;
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
    }
    .main{
        .uls{
            height: 50px;
            display: -webkit-flex;
            background-color: rgb(247, 247, 247);
            border-bottom: 1px solid rgb(221, 221, 221);
            .list{
                width: 14%;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
                color: rgb(102, 102, 102);
                border-right: 1px solid rgb(221, 221, 221);
                display: -webkit-flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
            .on{
                color: #02B3ED;
                background: #ffffff;
                border-top: 2px solid #02B3ED;
                border-right: none;
                border-left: none;
            }
        }
        .echarts{
            height: 500px;
            position: relative;
            cursor: pointer;
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
        margin-top: 30px;
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
                font-size: 17px;
                color:  rgb(51, 51, 51);
                border-left: 3px solid #02B3ED;
                margin-left: 20px;
                padding-left: 10px;
            }
        }
        .table-main{
            padding: 20px;
            .el-table{
                
            }
        }
    }
    .addData{
        width: 100%;
        height: 50px;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        p{
            width: 100px;
            height: 50px;
            font-size: 18px;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            &:nth-child(1){
                color: rgb(2, 179, 237);
            }
            &:nth-child(2){
                color: rgb(102, 102, 102);
            }
        }
    }
</style>
<style lang="less">
    .el-table__footer-wrapper tbody td{
        color: #02B3ED;
    }
    .el-table__empty-text{
        color: #cccccc;
    }
</style>

