<template>
    <div class="help-container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card shadow="hover" class="box-card">
                    <div slot="header" class="clearfix">
                        <span><i class="el-icon-question"></i> 常见问题解答 (FAQ)</span>
                    </div>
                    <el-collapse v-model="activeNames" accordion>
                        <el-collapse-item name="1">
                            <template slot="title">
                                <i class="el-icon-info"></i> 校园委托系统是什么？
                            </template>
                            <div class="answer-content">
                                校园委托系统是一个在线平台，允许学生、教职工或其他校园成员发布和接受各种校园内的委托任务。这些任务可能包括帮忙取快递、购买教材、参与校园活动组织等。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="2">
                            <template slot="title">
                                <i class="el-icon-user"></i> 我如何使用校园委托系统？
                            </template>
                            <div class="answer-content">
                                按照提示填写个人信息进行注册。注册成功后，你可以浏览并发布委托任务，或接受他人发布的任务。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="3">
                            <template slot="title">
                                <i class="el-icon-money"></i> 发布任务需要支付费用吗？
                            </template>
                            <div class="answer-content">
                                现阶段，系统允许免费发布任务。你可以在发布任务前查看系统规定或联系客服了解详情。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="4">
                            <template slot="title">
                                <i class="el-icon-check"></i> 如何确保任务的完成质量和安全性？
                            </template>
                            <div class="answer-content">
                                系统要求用户进行实名认证，提供信誉评级系统，允许用户对任务完成者进行评价和反馈。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="5">
                            <template slot="title">
                                <i class="el-icon-warning-outline"></i> 如果我接受了任务但无法完成怎么办？
                            </template>
                            <div class="answer-content">
                                如果你在接受任务后发现无法完成，应尽快与任务发布者联系并说明情况。你可以尝试与发布者协商解决方案，如取消任务、寻找替代完成者等。为了避免类似情况的发生，建议在接受任务前仔细阅读任务要求并确保自己有能力完成。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="6">
                            <template slot="title">
                                <i class="el-icon-wallet"></i> 任务完成后如何支付报酬？
                            </template>
                            <div class="answer-content">
                                任务完成后的报酬支付方式取决于委托发布者。常见的支付方式包括在线转账、现金交易等。你可以在任务发布时与发布者协商确定支付方式，并在任务完成后按照约定进行支付。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="7">
                            <template slot="title">
                                <i class="el-icon-lock"></i> 我的个人信息在校园委托系统中是否安全？
                            </template>
                            <div class="answer-content">
                                校园委托系统会采取一系列安全措施来保护用户的个人信息。这些措施包括数据加密、访问控制、隐私设置等。然而，你仍然需要注意保护自己的个人信息，避免在系统中泄露过多敏感信息。
                            </div>
                        </el-collapse-item>
                        <el-collapse-item name="8">
                            <template slot="title">
                                <i class="el-icon-headset"></i> 如果我在使用校园委托系统时遇到问题怎么办？
                            </template>
                            <div class="answer-content">
                                如果你在使用校园委托系统时遇到问题，可以首先查看系统的帮助文档或常见问题解答。如果无法解决问题，你可以联系系统的客服或技术支持团队寻求帮助。
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="box-card contact-card">
                    <div slot="header" class="clearfix">
                        <span><i class="el-icon-phone-outline"></i> 联系方式</span>
                    </div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="el-icon-message"></i>
                            <div class="text">
                                <h4>客服邮箱</h4>
                                <p>support@campus-entrust.com</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="el-icon-phone"></i>
                            <div class="text">
                                <h4>客服热线</h4>
                                <p>021-12345678</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="el-icon-location-information"></i>
                            <div class="text">
                                <h4>办公地址</h4>
                                <p>行政楼 101 室</p>
                            </div>
                        </div>
                    </div>
                    <div class="qrcode-section">
                        <p>关注我们</p>
                        <div class="qrcode-placeholder">
                            <i class="el-icon-full-screen"></i>
                        </div>
                    </div>
                </el-card>

                <el-card shadow="hover" class="box-card feedback-card" style="margin-top: 20px;">
                    <div slot="header" class="clearfix">
                        <span><i class="el-icon-edit-outline"></i> 意见反馈</span>
                    </div>
                    <el-form label-position="top">
                        <el-form-item label="您的建议">
                            <el-input type="textarea" :rows="4" placeholder="请输入您的宝贵建议..."></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 100%">提交反馈</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'HelpSupport',
        data() {
            return {
                activeNames: ['1']
            }
        },
        methods: {
            
        }
    }
</script>

<style lang="less" scoped>
    .help-container {
        padding: 10px;
    }

    .box-card {
        margin-bottom: 20px;
        
        .clearfix {
            span {
                font-size: 16px;
                font-weight: 600;
                
                i {
                    margin-right: 5px;
                    color: #409EFF;
                }
            }
        }
    }
    
    .answer-content {
        padding: 10px 0;
        color: #606266;
        line-height: 1.6;
        font-size: 14px;
    }
    
    /deep/ .el-collapse-item__header {
        font-size: 14px;
        font-weight: 500;
        
        i {
            margin-right: 8px;
            color: #909399;
        }
        
        &.is-active {
            color: #409EFF;
            i {
                color: #409EFF;
            }
        }
    }
    
    .contact-info {
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f2f5;
            
            &:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            
            i {
                font-size: 24px;
                color: #409EFF;
                margin-right: 15px;
                width: 40px;
                height: 40px;
                background: #ecf5ff;
                border-radius: 50%;
                text-align: center;
                line-height: 40px;
            }
            
            .text {
                h4 {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    color: #303133;
                }
                
                p {
                    margin: 0;
                    font-size: 13px;
                    color: #606266;
                }
            }
        }
    }
    
    .qrcode-section {
        margin-top: 20px;
        text-align: center;
        
        p {
            font-size: 14px;
            color: #909399;
            margin-bottom: 10px;
        }
        
        .qrcode-placeholder {
            width: 120px;
            height: 120px;
            background: #f0f2f5;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            
            i {
                font-size: 40px;
                color: #c0c4cc;
            }
        }
    }
</style>