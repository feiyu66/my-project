<template>
    <div class="box">
        <p class="title">管理目标统计分布 > 各目标人群属性分布</p>
        <div class="head">
            <div class="head-top"><p>各目标人群属性分布</p></div>
            <div class="main">
                <ul class="uls">
                    <li class="list" :class="sum == index ? 'on' : ''" v-for="(item, index) in title" :key='index' @click='lineData(index, item.id, item.name)'>{{item.name}}</li>
                </ul>
                <div class="data">
                    <div class="data-top">
                        <ol class="ols">
                            <li :class="bg == index ? 'bg' : ''" v-for="(item, index) in data" :key='index' @click='agesexData(index)'>{{item}}</li>
                        </ol>
                        <div class="block">
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
                        </div>
                    </div>
                    <div class="main-echarts">
                        <div class="echarts" v-if="bg == '0'">
                            <Charts :options="polar" ref='barCharts'></Charts>
                            <p v-if="!noData" class="noData">暂无数据</p>
                        </div>
                        <div class="echarts" v-if="bg == '1'">
                            <Charts :options="polar2" ref='pieCharts'></Charts>
                        </div>
                        <div class="echarts" v-if="bg == '2'">
                            <Charts :options="polar3" ref='doubleCharts'></Charts>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-box">
            <div class="tip">
                <p>{{startDate}} 至 {{endDate}} {{objectives}}人数统计明细</p>
            </div>
            <div class="table-main">
                <div class="table-left">
                    <p>统计</p>
                    <p>年龄段</p>
                    <ul class="tab">
                        <li style="color: #666666;" v-for="(item, index) in age" :key="index">{{item}}</li>
                    </ul>
                    <b>合计</b>
                </div>
                <div class="table-left">
                    <p>男性</p>
                    <p>人数</p>
                    <ul class="tab">
                        <li style="color: #999999;" v-for="(item, index) in maleData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{mSum}}</b>
                </div>
                <div class="table-left">
                    <p>女性</p>
                    <p>人数</p>
                    <ul class="tab">
                        <li style="color: #999999;" v-for="(item, index) in femaleData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{fSum}}</b>
                </div>
                <div class="table-left">
                    <p>合计</p>
                    <p style="color: #02B3ED;">人数（百分比）</p>
                    <ul class="tab">
                        <li v-for="(item, index) in totalData" :key="index">{{item}}</li>
                    </ul>
                    <b>{{totalSum}}</b>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Charts from '../../../components/Charts/Charts.vue'
    import localhost from '../../../util/localhost'
    import hex_md5 from 'js-md5'
    import $ from 'jQuery'
    export default {
        name: 'cobjectives',
        components: {
            Charts
        },
        data () {
            return {
                flag: false,
                noData: false,
                sum: 0,
                bg: 0,
                targetId: '01',
                charData: [],
                sexageData: 5,
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                options: [],
                maleData: [], // 男性人数
                mSum: 0, // 男性总人数
                femaleData: [], // 女性人数
                fSum: 0, // 女性总人数
                totalData: [], // 男女总人数及比率
                totalSum: 0, // 男女总人数及比率
                count: 0,
                percent: 0,
                objectives: '肥胖', // 提示管理目标
                data: ['年龄分布', '性别分布', '年龄-性别分布'],
                title: [
                    {
                        id: '05',
                        name: '肥胖'
                    },
                    {
                        id: '03',
                        name: '高血压'
                    },
                    {
                        id: '04',
                        name: '糖尿病'
                    },
                    {
                        id: '06',
                        name: '高血脂'
                    },
                    {
                        id: '02',
                        name: '代谢综合征'
                    },
                    {
                        id: '01',
                        name: '健康促进'
                    },
                    {
                        id: '07',
                        name: '慢阻肺'
                    }
                ],
                age: ['<25', '25-29',  '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65以上'],
                polar: {},
                polar2: {},
                polar3: {}
            };
        },
        mounted () {
            this.upToTop()
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            this.startDate = start
            this.endDate = end
            this.timeData(this.startDate, this.endDate)
            this.ajaxData()
            this.defaultData()
        },
        watch: {
            charData (value) {
                if (this.bg == '0') {
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
                        this.noData = false
                        this.polar = {}
                        this.$refs.barCharts.setOption(this.polar, true)
                    } else {
                        this.noData = true
                        this.polar = {
                            title : {
                                text: '各目标人群年龄分布图',
                                textStyle: {
                                    fontFamily: '300'
                                },
                                x:'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{b} : {c}人"
                            },
                            legend: {
                                orient: 'vertical',
                                top: '20%',
                                right: '10%',
                                data:['<25', '25-29',  '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65以上']
                            },
                            series: [
                                {
                                    type:'pie',
                                    radius: ['50%', '70%'],
                                    avoidLabelOverlap: true,
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    label: {
                                        show: true
                                    },
                                    labelLine: {
                                        show: true
                                    },
                                    data:[
                                        {value:this.seriesData[0], name:'<25'},
                                        {value:this.seriesData[1], name:'25-29'},
                                        {value:this.seriesData[2], name:'30-34'},
                                        {value:this.seriesData[3], name:'35-39'},
                                        {value:this.seriesData[4], name:'40-44'},
                                        {value:this.seriesData[5], name:'45-49'},
                                        {value:this.seriesData[6], name:'50-54'},
                                        {value:this.seriesData[7], name:'55-59'},
                                        {value:this.seriesData[8], name:'60-64'},
                                        {value:this.seriesData[9], name:'65以上'}
                                    ]
                                }
                            ]
                        }
                        this.$refs.barCharts.setOption(this.polar, true)
                    }
                } else if (this.bg == '1') {
                    this.seriesData2 = []
                    for(let key in value) {
                        this.seriesData2.push(value[key])
                    }
                    this.polar2 = {
                        title : {
                            text: '各目标人群性别分布图',
                            textStyle: {
                                fontFamily: '300'
                            },
                            x:'center'
                        },
                        color: ['#b5413d', '#306cb5'],
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
                } else if (this.bg == '2') {
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
                            text: '各目标人群年龄－性别分布图 ',
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
                                data : ['<25', '25-29',  '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65以上',]
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
                                markPoint : {
                                    data : [
                                        {type : 'max', name: '最大值'},
                                        {type : 'min', name: '最小值'}
                                    ]
                                },
                                itemStyle:{
                                    color: '#b5413d'
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
        methods: {
            startTime () {
                this.timeData(this.startDate, this.endDate)
                this.ajaxData()
                this.defaultData()
            },
            endTime () {
                this.timeData(this.startDate, this.endDate)
                this.ajaxData()
                this.defaultData()
            },
            lineData (index, id, item) {
                this.objectives = item
                this.sum = index
                this.targetId = id
                this.ajaxData()
                this.defaultData()
            },
            agesexData (index) {
                this.bg = index
                this.sexageData = 5
                this.sexageData = this.sexageData + index
                this.ajaxData()
            },
            ajaxData () {
                $.ajax({
                    type: "get",
                    url: localhost + "backstage/statistics/distribute/" + this.sexageData,
                    dataType: "json",
                    data: {
                        targetId: this.targetId,
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
                })
            },
            defaultData (){
                this.totalData = []
                this.femaleData = []
                this.maleData = []
                this.fSum = 0
                this.mSum = 0
                this.count = 0
                this.percent = 0
                $.ajax({
                    type: "get",
                    url: localhost + "backstage/statistics/distribute/7",
                    dataType: "json",
                    data: {
                        time: this.startDate + 'x' + this.endDate,
                        targetId: this.targetId
                    },
                    xhrFields:{withCredentials:true},
                    headers: {
                        // 'Login_Authorization': localStorage.getItem('token'),
                        // 'User_Id': localStorage.getItem('id')
                    },
                    success: (data) => {
                        let code = data.code
                        if (code === '200') {
                            for(let key in data.data) {
                                this.totalData.push((data.data[key].count + ' (' + (data.data[key].percent * 100).toFixed(0) + '%)'))
                                this.percent+= data.data[key].percent
                                for(let i in data.data[key].sex) {
                                    if (i == 'f') { // 女
                                        this.femaleData.push(data.data[key].sex[i].count)
                                        this.fSum += data.data[key].sex[i].count
                                    } else if (i == 'm') {
                                        this.maleData.push(data.data[key].sex[i].count)
                                        this.mSum += data.data[key].sex[i].count
                                    }
                                }
                            }
                            this.count = this.fSum + this.mSum
                            this.totalSum = this.count + ' (' + this.percent.toFixed(0) * 100 + '%)'
                        }
                    }
                }) 
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
    }
    .main{
        .uls{
            height: 50px;
            display: -webkit-flex;
            background-color: #F7F7F7;
            border-bottom: 1px solid #ccc;
            .list{
                width: 130px;
                height: 50px;
                font-size: 16px;
                border-right: 1px solid #ccc;
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
        .data{
            .data-top{
                margin-top: 20px;
                height: 50px;
                display: -webkit-flex;
                justify-content: space-between;
                .ols{
                    height: 50px;
                    display: -webkit-flex;
                    align-items: center;
                    li{
                        width: 130px;
                        height: 30px;
                        display: -webkit-flex;
                        align-items: center;
                        justify-content: center;
                        border: 1px solid #ccc;
                        border-radius: 25px;
                        margin-left: 30px;
                        cursor: pointer;
                    }
                    .bg{
                       background-color: #02B3ED;
                       border: 1px solid #02B3ED;
                       color: #ffffff;
                       border: none;
                    }
                }
                .block{
                    height: 50px;
                    display: -webkit-flex;
                    align-items: center;
                    margin-right: 30px;
                    .el-date-editor.el-input, .el-date-editor.el-input__inner{
                        margin: 0 5px;
                        width: 150px;
                    }
                }
            }
            .main-echarts{
                margin-top: 10px;
                height: 400px;
                .echarts{
                    height: 400px;
                    position: relative;
                    .noData{
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        color: #cccccc;
                    }
                }
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
                }
                p{
                    background: #EEEEEE;
                    &:nth-child(1){
                        color: #333333;
                    }
                    &:nth-child(2){
                        color: #666666;
                        background: none;
                    }
                }
                b{
                    background: #F7F7F7;
                    color: #0CB5ED;
                }
                .tab{
                    li{
                    width: 100%;
                        height: 60px;
                        display: -webkit-flex;
                        justify-content: center;
                        align-items: center;
                        &:nth-child(odd){
                            background: #F7F7F7;
                        }
                    }
                }
                &:nth-child(4){
                    color: #0CB5ED;
                }
            }
        }
    }
</style>
