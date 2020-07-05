<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20 one_agent_info" style="height: 200px">
                    <h3>所有代理信息</h3>
                    <div>
                        <p>引入用户付费总额：{{allMoney}} 元 （一级+二级）</p>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20 one_agent_info" style="height: 200px">
                    <h3>一级代理信息</h3>
                    <div>
                        <p>当前代理号：{{groupId}}</p>
                        <p>引入用户总数：{{userCounts}}</p>
                        <p>引入用户付费总数：{{payCount}} <span v-if="payCount > 0" @click="getPayList" class="get_pay_list">查看详情</span></p>
                        <p>引入用户付费总额：{{sumMoney}} 元 （一级）</p>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20 one_agent_info" style="height: 200px">
                    <h3>二级代理信息</h3>
                    <div>
                        <p>代理所引入的总收益：{{agentMoney}} 元 （二级）</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="15">
            <el-col :span="12">
                <el-card shadow="hover" class="mgb20">
                    <h3 style="margin: 25px auto 15px;text-align: center">引入用户清单</h3>
                    <div style="height: 500px">
                        <el-scrollbar style="height: 100%">
                            <el-table :data="list" stripe border style="width: 100%">
                                <el-table-column
                                        type="index"
                                        width="100"
                                        label="序号">
                                </el-table-column>
                                <el-table-column
                                        prop="username"
                                        label="用户微信名">
                                </el-table-column>
                                <el-table-column label="引入时间">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.createTime | formatDate}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="付费次数">
                                    <template slot-scope="scope">
                                        {{scope.row.paycount}}
                                        <span class="pay_detail" v-if="scope.row.paycount > 0" @click="gotoPayDetail(scope.row.openid)" >详情</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-scrollbar>
                    </div>

                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <h3 style="margin: 25px auto 15px;text-align: center">二级代理详情</h3>
                    <div style="height: 500px">
                        <el-scrollbar style="height: 100%">
                            <el-table :data="agentTwoList" stripe border style="width: 100%">
                                <el-table-column
                                        prop="groupId"
                                        label="代理号">
                                </el-table-column>
                                <el-table-column
                                        prop="usercounts"
                                        label="引入用户数">
                                </el-table-column>
                                <el-table-column label="付费次数">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.paycount}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="总金额">
                                    <template slot-scope="scope">
                                        {{scope.row.summoney}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-scrollbar>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="收益类别清单" :visible.sync="showPayInfo">
                <el-table :data="payList">
                    <el-table-column property="cate" label="类别"></el-table-column>
                    <el-table-column property="price" label="金额"></el-table-column>
                    <el-table-column property="num" label="人数"></el-table-column>
                </el-table>
            </el-dialog>
        <el-dialog :visible.sync="showEachPayInfo" title="个人收益订单详情">
            <div class="tips__body_pay">
                <div v-if="predictPayDetail.length > 0" class="schoolScoreLine">
                    <div v-for="(item, index) in predictPayDetail" :key="index">
                        <div class="school-item__info">
                            <div class="school-item__name">
                                <div>
                                    订单号：{{item.arr.orderId}}
                                </div>
                                <div>
                                    <span>{{item.arr.province}}</span>
                                    <span>{{item.arr.category}}</span>
                                    <span>{{item.arr.batch}}</span>
                                </div>
                            </div>
                            <div class="school-item_rank">
                                <div class="school-item_rank_left">
                                    金额:
                                    <span>{{item.arr.money}}</span>
                                </div>
                                <div class="school-item_rank_right">
                                    {{item.arr.createTime | formatDate}}
                                    <div>创建时间</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="no_pay">暂无付费订单</div>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
    import {findAgentInfo, getAllAgent, getVipPayInfo, getPredictInfo, getOneScoreProvince} from '@/api/index'
    import {formatDate} from '../../utils/date.js'
    // import BScroll from 'better-scroll'
    import _ from 'underscore'

    export default {
        data () {
            return {
                payList: [],
                showPayInfo: false,
                showEachPayInfo: false,
                isEnd: false,
                majorScroll: null,
                payScroll: null,
                list: [],
                page: 0,
                loading: false,
                userName: '',
                userCounts: '',
                payCount: '',
                vipmap: [],
                yucemap: [],
                sumMoney: '',
                allMoney: '',
                agentMoney: '',
                profit: '',
                nowTime: '',
                nowWeekSummoney: '',
                preWeekSummoney: '',
                province: '',
                agentList: [],
                provinceList: [],
                sum: 0,
                vipPayDetail: [],
                predictPayDetail: [],
                level: 0,
                agentTwoList: []
            }
        },
        computed: {
            groupId () {
                console.log('groupId:', this.$store.state.user.groupId)
                // return this.$route.query.groupId
                return localStorage.groupId
                // return this.$store.state.user.groupId
                // if (this.$store.state.user.groupId === '') {
                //     return this.$route.query.groupId
                // }
                // return this.$store.state.user.groupId
            },
        },
        mounted () {
            if (this.groupid === '') {
                this.getOneScoreProvince()
                this.getAllAgent()
            } else {
                this.getList()
            }
            // this.init()
        },
        filters: {
            formatDate (time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            }
        },
        methods: {
            getPayList () { // 获取付费详情
                this.showPayInfo = true
            },
            gotoPayDetail (openid) {
                this.predictPayDetail = []
                console.log('付费详情')
                getPredictInfo({
                    openid: openid
                }).then(res => {
                    // this.predictPayDetail = res.data.data.data
                    res.data.data.data.map(item => {
                        let temp = {cate: '预测页面', arr: item}
                        this.predictPayDetail.push(temp)
                    })
                    // this.initPay()
                    console.log(res.data.data, res.data.data.data)
                })
                console.log('11111', this.predictPayDetail)
                getVipPayInfo({
                    openid: openid
                }).then(resp => {
                    // this.vipPayDetail = resp.data.data
                    if (resp.data.data.data !== null) {
                        resp.data.data.data.map(item => {
                            let temp = {cate: 'vip用户', arr: item}
                            this.predictPayDetail.push(temp)
                        })
                    }
                    // this.vipPayDetail = resp.data.data.map()
                })
                this.showEachPayInfo = true
                console.log('个人付费详情：', this.predictPayDetail)
            },
            nextPage: _.debounce(function () {
                console.log(this.isEnd, this.loading)
                if (this.isEnd || this.loading) {
                    return
                }
                this.page++
                if (this.groupid === '') {
                    this.getAllAgent()
                } else {
                    this.getList()
                }
            }, 50, true),
            reList: _.debounce(function () {
            }, 50, true),
            getList () {
                findAgentInfo({
                    // groupId: this.groupId,
                    b: 0.6,
                    groupId: this.groupId,
                    page: this.page
                }).then(res => {
                    this.payList = []
                    this.yucemap = res.data.data.yucemap
                    this.vipmap = res.data.data.vipmap
                    this.level = res.data.data.level
                    this.userName = res.data.data.username
                    this.userCounts = res.data.data.usercounts
                    this.payCount = res.data.data.paycount
                    this.sumMoney = res.data.data.summoney
                    this.allMoney = res.data.data.allMoney
                    this.agentMoney = res.data.data.agentMoney
                    this.profit = res.data.data.profit
                    this.preWeekSummoney = res.data.data.preWeekSummoney
                    this.nowWeekSummoney = res.data.data.nowWeekSummoney
                    this.nowTime = res.data.data.nowTime
                    this.agentTwoList = res.data.data.agentDTOS
                    // if (this.list.length > 0) {
                    //   this.list.push(res.data.data.agentusers)
                    // }
                    for (let item in Object.keys(this.yucemap)) {
                        console.log('temp:', item, this.yucemap)
                        let temp = {'cate': '预测页面', 'price': Object.keys(this.yucemap)[item], 'num': this.yucemap[Object.keys(this.yucemap)[item]]}
                        this.payList.push(temp)
                    }
                    // for (let itemVip in Object.keys(this.vipmap)) {
                    //     let temp = {'cate': 'vip用户', 'price': Object.keys(this.vipmap)[itemVip], 'num': this.vipmap[Object.keys(this.vipmap)[itemVip]]}
                    //     this.payList.push(temp)
                    // }
                    if (res.data.data.agentusers.length < 10) {
                        this.isEnd = true
                    }
                    const userName = this.list.map(item => item.username)
                    res.data.data.agentusers.map(item => {
                        if (userName.indexOf(item.username) === -1) {
                            this.list.push(item)
                        }
                    })
                    this.nextPage()
                })
            },
            getAllAgent () {
                getAllAgent({
                    province: this.province,
                    page: this.page,
                    pageSize: 20
                }).then(res => {
                    if (res.data.code === 0) {
                        console.log('获取所有代理：', res.data)
                        this.sum = res.data.data.sum
                        if (res.data.data.data.length < 20) {
                            this.isEnd = true
                        }
                        const userName = this.agentList.map(item => item.groupId)
                        res.data.data.data.map(item => {
                            if (userName.indexOf(item.groupId) === -1) {
                                this.agentList.push(item)
                            }
                        })
                        this.nextPage()
                        // this.$nextTick(() => {
                        //     this.majorScroll && this.majorScroll.refresh()
                        // })
                        // this.agentList = res.data.data.data
                    }
                })
            },
            getOneScoreProvince () {
                console.log(this.province)
                getOneScoreProvince().then(res => {
                    // console.log(res.data)
                    this.provinceList = res.data
                })
            },
            onChangePro (val) {
                this.province = val
                this.page = 0
                this.agentList = []
                this.getAllAgent()
            }
        }
    }
</script>
<style scoped lang="less">
.one_agent_info {
    display: flex;
    justify-content: center;
    align-items: center;
    h3 {
        margin-bottom: 15px;
    }
    p {
        line-height: 30px;
    }
    .get_pay_list {
        color: #2d8cf0;
        margin-left: 10px;
    }
}
.pay_detail {
    color: #2d8cf0;
    margin-left: 6px;
}
.tips__body_pay {
    font-size: 13px;
    height: calc(100% - 20px);
    overflow: hidden;
    p {
        margin-bottom: 10px;
        text-align: justify;
    }
}
.schoolScoreLine {
    color: #767c98;
    padding-top: 2px;
    margin: 10px 8px 10px;
    /*text-align: center;*/
    border-radius: 10px;
    background-color: #fff;
}
.school-item__info {
    width: 80%;
    margin-left: 14%;
    padding-left: 0;
    position: relative;
    margin-bottom: 8%;
}
.school-item__name {
    margin-top: 4px;
    font-size: 15px;
    color: #000;
    padding-bottom: 5px;
    border-bottom: 1px solid #ececec;
    padding-top: 2px;
    position: relative;
    div {
        display: inline-block;
    }
    div:nth-child(1) {
        margin-right: 12%;
    }
    .major_name {
        /*display: inline;*/
        overflow: hidden;
        white-space: nowrap;
        width: 80%;
        text-overflow: ellipsis;
    }
    .goal_city {
        /*z-index: 10;*/
        position: absolute;
        /*background-color: #FF6666;*/
        background-color: rgba(245, 108, 108, 0.5);
        font-size: 12px;
        color: #fff;
        padding: 0 5px;
        top: -13px;
        left: 30%;
        border-width:0;
        border-style:solid;
        border-color:transparent;
        /*border-top-width:10px;*/
        /*border-top-color:currentColor;*/
        border-radius: 10px 0 0 0;
        /*!*border-top-left-radius: 10px;*/
        border-bottom-left-radius: -10px;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
    }
    span {
        font-size: 12px;
        border: 1px solid rgb(26, 134, 241);
        padding: 1px 1px;
        margin-left: 13px;
        color: rgb(26, 134, 241);
        border-radius: 4px;
        letter-spacing: 0;
    }
    span:first-child {
        margin-left: 3px;
    }
}
.school-item_rank {
    /*letter-spacing: 0;*/
    display: flex;
    margin-top: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ececec;
    position: relative;
    .school-item_rank_left, .school-item_rank_right {
        /*display: inline-block;*/
        flex: 1;
        /*position: absolute;*/
    }
    .school-item_rank_left {
        font-weight: bolder;
        color: #000;
        font-size: 17px;
        border-right: 1px solid #ececec;
        .school_name {
            margin-top: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        div {
            font-weight: normal;
            font-size: 12px;
            color: #9c9c9c;
        }
        span {
            color: rgb(255, 158, 0);
        }
    }
    .school-item_rank_right {
        padding-left: 15px;
        color: #000;
        div {
            font-size: 12px;
            color: #9c9c9c;
            span {
                color: #000;
            }
        }
        div:nth-child(3) {
            margin-top: 3px;
            color: rgb(0, 115, 231);
        }
    }
}
.school-item_score {
    color: #000;
    margin-top: 5px;
    font-size: 13px;
}
</style>
<style>
    body {
        margin: 0;
    }
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
