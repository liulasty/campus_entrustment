<template>
    <div>
        <!-- 常见问题解答（FAQ） -->
        <el-card class="box-card">
            <h4 slot="header" class="clearfix">
                <span>常见问题解答</span>
            </h4>
            <!-- 在这里添加FAQ列表 -->

            <p class="question">校园委托系统是什么？</p>
            <p class="answer">校园委托系统是一个在线平台，允许学生、教职工或其他校园成员发布和接受各种校园内的委托任务。这些任务可能包括帮忙取快递、购买教材、参与校园活动组织等。</p>

            <p class="question">我如何使用校园委托系统？</p>
            <p class="answer">按照提示填写个人信息进行注册。注册成功后，你可以浏览并发布委托任务，或接受他人发布的任务。</p>
            <p class="question">发布任务需要支付费用吗？</p>
            <p class="answer">现阶段，系统允许免费发布任务。你可以在发布任务前查看系统规定或联系客服了解详情。</p>
            <p class="question">如何确保任务的完成质量和安全性？</p>
            <p class="answer">系统要求用户进行实名认证，提供信誉评级系统，允许用户对任务完成者进行评价和反馈。</p>
            <p class="question">如果我接受了任务但无法完成怎么办？</p>
            <p class="answer">
                如果你在接受任务后发现无法完成，应尽快与任务发布者联系并说明情况。你可以尝试与发布者协商解决方案，如取消任务、寻找替代完成者等。为了避免类似情况的发生，建议在接受任务前仔细阅读任务要求并确保自己有能力完成。
            </p>
            <p class="question">任务完成后如何支付报酬？</p>
            <p class="answer">任务完成后的报酬支付方式取决于委托发布者。常见的支付方式包括在线转账、现金交易等。你可以在任务发布时与发布者协商确定支付方式，并在任务完成后按照约定进行支付。</p>
            <p class="question">我的个人信息在校园委托系统中是否安全？</p>
            <p class="answer">校园委托系统会采取一系列安全措施来保护用户的个人信息。这些措施包括数据加密、访问控制、隐私设置等。然而，你仍然需要注意保护自己的个人信息，避免在系统中泄露过多敏感信息。</p>
            <p class="question">如果我在使用校园委托系统时遇到问题怎么办？</p>
            <p class="answer">如果你在使用校园委托系统时遇到问题，可以首先查看系统的帮助文档或常见问题解答。如果无法解决问题，你可以联系系统的客服或技术支持团队寻求帮助。</p>
        </el-card>

        <!-- 联系方式 -->
        <el-card class="box-card">
            <h4 slot="header" class="clearfix">
                <span>联系方式</span>
            </h4>
            <!-- 在这里添加联系方式 -->
        </el-card>

        <!-- 其他部分... -->

        <!-- 使用指南和教程 -->
        <!-- 文档和下载 -->
        <!-- 帮助中心 -->
    </div>
</template>

<script>
    export default {
        name: 'HelpSupport',
        // ... 其他选项，如data, methods等  
    }  
</script>

<style scoped>
    /* 在这里添加样式 */
    .box-card {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .question {
        font-weight: bold;
        margin-bottom: 10px;
    }

    .answer {
        margin-bottom: 20px;
    }
</style>