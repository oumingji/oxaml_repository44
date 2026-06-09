  // setTimeout('playVideo()', 4000)//
/**动播放+考试脚本
 * 
 * @Author Nick
 * @Date 2024-05-04
 * @Version 5.0
 * 
 * */

/**
 * 
 * 初始化操作
 * 
 * */
function init() {


    runFirstJob()

}

function initVideoListener() {

    console.log('初始化video监听')
    var current_video = document.getElementsByTagName('video')[0]
    if (current_video != null) {
        current_video.removeAttribute('loop')


        current_video.addEventListener('ended', function () {
            console.log('播放结束')
            //setTimeout('runFirstJob()', 3000)

            //clearInterval(this.timer)
        })

        current_video.addEventListener('pause', function () {
            console.log('播放暂停')
            //setTimeout('playVideo()', 4000)//

        })


        current_video.addEventListener('error', function () {
            // Handle the content length mismatch error
            console.log('视频播放错误，重新播放')
            setTimeout('playVideo()', 4000)

        });

    } else {
        console.log('未找到video组件，初始化监听失败')
    }
    // current_video.addEventListener('playing',function(){
    //     console.log('播放中')

    
}

function initVideoInterval(currentNode){
    clearInterval(this.timer)

    this.timer = setInterval(() => {

        var result = isFinishedOfNode(currentNode)
        console.log('当前任务是否完成:' + result)
        if (result) {
            clearInterval(this.timer)
            setTimeout('runFirstJob()', 3000)
        }
    }, 60000)

}

/**
 * 
 * 播放视频
 * 
 * */
function playVideo() {
    console.log('播放视频')
    //var noPlayArr = getNoPlayMap()


    var current_video = document.getElementsByTagName('video')[0]
    if (current_video != null) {

        if (current_video.parentNode.style.display == 'block') {

        }
        current_video.play().then(function () {
            // 视频成功播放
            console.log('视频成功播放');
            console.log('视频正在播放中');
        }).catch(function (error) {
            // 处理播放错误
            console.log('视频播放出错,可能网络延迟太高');
            console.error('视频播放出错:', error);
            changeVideoSource()
            setTimeout('playVideo()', 3000)
        });


    } else {

        console.log('播放失败,video组件不存在')
    }
}


/**
 * 
 * 播放第一个未进行的任务
 * 
 * */
function runFirstJob() {

    var noPlayArr = getNoPlayMap()


    if (noPlayArr.length > 0) {
        var ddNode = noPlayArr[0]
        ddNode.click()
        console.log("正在执行任务:" + ddNode.innerText)

        console.log('根据任务类型执行任务')
        //setTimeout('playByType({ddNode})', 3000)
        var current_video = document.getElementsByTagName('video')[0]
        //判断任务类型PDF/Video
        var pdfElement = getPDFElement()
        console.log('videoElement', current_video)
        console.log('pdfElement', pdfElement)
        console.log('正在判断任务类型')
        if (current_video != null) {
            if (current_video.parentNode.style.display != 'none') {

                //初始化video监听 
                console.log('判断为视频，正在播放...')
                if (this.isVideoListener == 0) {
                    initVideoListener()
                    this.isVideoListener = 1
                }
                initVideoInterval(ddNode)
                playVideo()
            }
        }

        if (pdfElement != null) {
            if (pdfElement.style.display != 'none') {
                console.log('判断为PDF，正在播放...')
                palyfirstpdf()
                setTimeout(function () {
                    playPDF(ddNode)
                }, 3000);
            }

        }

    } else {

        console.log('任务全部执行完成')
        clearInterval(this.timer)

        var result = isFinishOfCourse()
        if (result) {
            //startExam()

            setTimeout('startExam()', 5000)

            setTimeout('autoAnswer()', 10000)
        }
    }
}


/**
 * 
 * 切换视频源
 * 
 * */
function changeVideoSource() {
    var realSelect = document.getElementById('real-select')


    // 获取所有的option元素
    var options = realSelect.getElementsByTagName('option');

    if (options != null) {

        var lineCount = options.length
        // 遍历所有的option并打印出来 0 1 2  ---3
        var currentLine = 0
        var nextLine = 0


        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                currentLine = i
            }
        }


        if (currentLine == lineCount - 1) {
            nextLine = 0
        } else {
            nextLine = currentLine + 1
        }


        realSelect.selectedIndex = nextLine


        changeLine(options[nextLine].value)
        console.log('当前视频源：' + options[currentLine].textContent)
        console.log('切换视频源：' + options[nextLine].textContent)
    } else {
        console.log('切换视频源错误,视频源不存在')
    }


}

/**
 * 
 * 播放PDF
 * 
 * */
function playPDF(ddNode) {
    console.log('正在播放PDF')
    var pdfElement = getPDFElement()

    if (pdfElement != null) {
        //上一页
        var pageUpButton = getFrameDocumentOfPDF().getElementsByClassName('pageUp')[0]
        //下一页
        var pageDownButton = getFrameDocumentOfPDF().getElementsByClassName('pageDown')[0]

        if (pageDownButton) {

            clearInterval(this.timer)
            isUp = false

            this.timer = setInterval(() => {

                var downDisabled = pageDownButton.getAttribute('disabled')
                if (downDisabled != null) {
                    isUp = true
                }

                var upDisabled = pageUpButton.getAttribute('disabled')
                if (upDisabled != null) {
                    isUp = false
                }

                if (isUp) {
                    pageUpButton.click()
                } else {
                    pageDownButton.click()
                }

                isFinish = isFinishOfPDF(ddNode)
                if (isFinish != null) {
                    if (isFinish) {
                        console.log('播放PDF完成')
                        console.log('clear timer')
                        clearInterval(this.timer)
                        setTimeout('runFirstJob()', 3000)
                    }
                } else {
                    console.log('获取进度出错...')
                    console.log('clear timer')

                    clearInterval(this.timer)
                    console.log('程序结束...')
                }

            }, 1200)

        } else {
            console.log('下一页不存在')
        }


    } else {
        console.log('PDF文件不存在')
    }


}


/**
 * 
 * 判断当前PDF阅读进度是否完成
 * 
 * */
function isFinishOfPDF(currentNode) {
    if (typeof currentNode != 'undefined') {

        if (currentNode.innerText.search('已完成') == -1) {
            console.log('当前进度：未完成---', currentNode.innerText)
            return false
        }
        console.log('当前进度：已完成---', currentNode.innerText)
        return true
    }
    console.log('获取进度出错')
    return null
}

/**
 * 
 * 设置视频进度条
 * 
 * */
function setVideoSeek(currentTime) {
    var current_video = document.getElementsByTagName('video')[0]

    current_video.currentTime = currentTime
    current_video.play()
}


/**
 * 
 * 获取侧边栏现实的进度
 * 
 * */
function getCurrentShowProgress() {
    var currentDDNode = getCurrentDDNode()
    if (currentDDNode != null) {

        var currentNodeText = currentDDNode.innerText

        let progressStr = ''
        for (var i = currentNodeText.length - 1 - 1; i >= 0; i--) {

            if (currentNodeText[i] != ' ') {
                progressStr = currentNodeText[i] + progressStr
            } else {
                break
            }
        }

        console.log('当前显示的进度：' + progressStr)
        return progressStr
    }
    return null
}

/**
 * 
 * 判断进度条是否合规
 * 
 * */
function isProgressOK() {

    var progressStr = getCurrentShowProgress()

    if (progressStr != null) {

        var current_video = document.getElementsByTagName('video')[0]
        var current_progress = current_video.currentTime / current_video.duration


        console.log('当前实际进度: ' + Math.floor(current_progress * 100))
        console.log('当前show进度:' + progressStr)


        if ((Math.floor(current_progress * 100) > (Number(progressStr) + 2)) || (Math.floor(current_progress * 100) < (Number(progressStr) - 4))) {

            if (current_video.currentTime > (current_video.duration - 10)) {

                clearInterval(this.timer)
                console.log('判定进度ok')
                return true
            }


            return false
        }

        return true
    }
    return null
}


/**
 * 
 * 判断任务节点是否完成,防止播放完成但进度条在末尾卡在，不会自动播放一下个视频
 * 
 * */
function isFinishedOfNode(ddNode) {
    if (typeof ddNode != 'undefined') {

        if (ddNode.innerText.search('已完成') == -1) {
            console.log('当前进度：未完成---', ddNode.innerText)
            return false
        }
        console.log('当前进度：已完成---', ddNode.innerText)
        return true
    }
    console.log('获取进度出错')
    return null
}


/**
 * 
 * 获取当前正在播放的Node节点
 * 
 * */
function getCurrentDDNode() {
    var noPlayArr = getNoPlayMap()

    for (var i = 0; i < noPlayArr.length; i++) {
        var ddNode = noPlayArr[i]
        var classAttribute = ddNode.getAttribute('class')

        if (classAttribute == 'active') {
            return ddNode
        }
    }
    return null
}


/**
 * 
 * 获取当前未播放的视频集合
 * 
 * */
function getNoPlayMap() {

    var noPlayArr = []

    var chapter = document.getElementsByClassName('chapter')[0]

    if (chapter != null) {
        var chapterChildNodes = chapter.childNodes

        for (var i = 0; i < chapterChildNodes.length; i++) {

            if (chapterChildNodes[i].nodeName == 'DL') {

                var dlNode = chapterChildNodes[i]

                var ddNodes = dlNode.getElementsByTagName('dd')


                for (var j = 0; j < ddNodes.length; j++) {
                    var ddNode = ddNodes[j]


                    if (ddNode.innerText.search('已完成') == -1) {


                        //console.log(j,ddNode.innerText)

                        noPlayArr.push(ddNode)
                    }
                }
            }
        }
        return noPlayArr
    }
}

/**
 * 
 * 判断课程是否全部已完成 
 * */
function isFinishOfCourse() {
    var chapter = document.getElementsByClassName('chapter')[0]

    if (typeof chapter == 'undefined') {
        console.log("当前页面不对，请进入课程观看页面")
        return false
    }


    var chapterChildNodes = chapter.childNodes

    for (var i = 0; i < chapterChildNodes.length; i++) {

        if (chapterChildNodes[i].nodeName == 'DL') {

            var dlNode = chapterChildNodes[i]

            var ddNodes = dlNode.getElementsByTagName('dd')


            for (var j = 0; j < ddNodes.length; j++) {
                var ddNode = ddNodes[j]

                if (ddNode.innerText.search('已完成') == -1) {

                    //console.log(j,ddNode.innerText)

                    return false
                }
            }
        }
    }
    console.log('所有课程全部完成')
    return true
}

/**
 * 
 *  自动考试部分
 * 
 * 
 * */


/**
 * 获取indexedDB 
 * */

function getIndexDB() {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    if (indexedDB) {
        return indexedDB
    }
    console.error("indexedDB not supported by this browser")
    return null
}


/**
 * 
 * 初始化数据库、表
 * */
function initStore() {
    const indexedDB = getIndexDB()
    const request = indexedDB.open("questionDB", 1)
    request.onerror = (event) => {
        console.error("IndexDB error: ", event)
        return false
    }

    //当试图打开一个版本号高于数据库当前版本号的数据库时，该事件就会运行
    request.onupgradeneeded = () => {
        //获取数据库连接
        const db = request.result

        //定义一个新存储
        const store = db.createObjectStore("question", {
            keypath: "id",
            autoIncrement: true
        })
        //制定一个属性作为索引
        //store.createIndex("todos_text", ["text"],{unique:false})
    }

    request.onsuccess = () => {
        console.log('store init onsuccess..')
        return true
    }
    return false
}


/**
 * 新增问题
 * */
function addQuestion(name, type, answer) {

    const indexedDB = getIndexDB()
    const request = indexedDB.open("questionDB", 1)
    request.onerror = (event) => {
        console.error("IndexDB error: ", event)
        return false
    }

    // type: 0 单选 1多选
    request.onsuccess = (event) => {
        //获取数据库连接
        const db = request.result
        const tx = db.transaction("question", "readwrite")

        //创建一个与我们存储的事务
        const questionStore = tx.objectStore("question")
        var data = {
            name: name.trim(),
            type: type,
            answer: answer.trim(),
            createTime: new Date()
        }


        questionStore.add({ data })

        return true
    }


}


/**
 * 
 * 查询全部问题
 * 
 * */
function getAllQuestion() {

    const indexedDB = getIndexDB()
    const request = indexedDB.open("questionDB", 1)


    request.onsuccess = (event) => {

        //获取数据库连接
        const db = request.result
        //创建事务对象
        const tx = db.transaction("question", "readwrite")
        //创建一个与我们存储的事务
        const questionStore = tx.objectStore("question")
        //得到所有待办事项
        const query = questionStore.getAll()

        //使用数据查询
        query.onsuccess = () => {


            emitQuestions(query.result)

            // for (var i = query.result.length - 1; i >= 0; i--) {
            //     var question = query.result[i]
            //     console.log(i+":"+question.data.name +" 答案：" + question.data.answer)
            // }
        }
    }

}

/**
 * 
 * 判断课程是否全部已完成 
 * */
function isFinishOfCourse() {
    var chapter = document.getElementsByClassName('chapter')[0]

    if (typeof chapter == 'undefined') {
        console.log("当前页面不对，请进入课程观看页面")
        return false
    }


    var chapterChildNodes = chapter.childNodes

    for (var i = 0; i < chapterChildNodes.length; i++) {

        if (chapterChildNodes[i].nodeName == 'DL') {

            var dlNode = chapterChildNodes[i]

            var ddNodes = dlNode.getElementsByTagName('dd')


            for (var j = 0; j < ddNodes.length; j++) {
                var ddNode = ddNodes[j]

                if (ddNode.innerText.search('已完成') == -1) {

                    //console.log(j,ddNode.innerText)

                    return false
                }
            }
        }
    }
    console.log('所有课程全部完成')
    return true
}


/**
 * 
 * 开始考试
 * 
 * */
function startExam() {
    console.log('正在开启考试')
    var examLink = document.getElementsByClassName('exam_link')[0]

    if (examLink) {
        var url = `https://iedu.foxconn.com/public/play/examUI?courseId=${courseId}`

        gotoUrl(url)

        return true
    }

    return false
}


/**
 * 
 * 自动答题
 * */
function autoAnswer() {
    console.log('正在开启答题')

    //获取题库
    getAllQuestion()


    //题库获取成功后触发emitQuestions方法
}

function emitQuestions(questions) {
    //获取单选题

    console.log('开始答题...')

    var questionWarps = getFrameDocument().getElementsByClassName('question_warp')

    var tihaos = getFrameDocument().getElementsByClassName('tihao_box')[0].getElementsByTagName('a')

    //0 通过 1未通过
    var successCode = 0;

    flag: for (var i = 0; i < questionWarps.length; i++) {

        var questionWarp = questionWarps[i]
        var hNode = questionWarp.getElementsByTagName('h3')[0]

        var option = questionWarp.getElementsByClassName('option_list')[0]

        var tmpTitle = hNode.innerText
        var index = tmpTitle.indexOf('.')
        var title = tmpTitle.substring(index + 1, tmpTitle.length).trim()

        var inputs = option.getElementsByTagName('input')

        var optionLabels = option.getElementsByTagName('label')

        //0 默认 匹配
        var matchCode = 0

        for (var j = 0; j < questions.length; j++) {
            var question = questions[j].data.name
            if (title == question) {
                matchCode = 1
                //找到题库
                if (questions[j].data.type == 0) {
                    //单选
                    var answer = questions[j].data.answer


                    for (var z = 0; z < optionLabels.length; z++) {

                        var optionLabel = optionLabels[z]

                        var inputTag = optionLabel.getElementsByTagName('input')[0]

                        if (optionLabel.innerText.trim().includes(answer)) {


                            inputTag.setAttribute("checked", "true")

                            continue flag
                        }
                    }

                } else if (questions[j].data.type == 1) {
                    //多选 todo

                    var answers = questions[j].data.answer.split('====')


                    for (var z = 0; z < optionLabels.length; z++) {

                        var optionLabel = optionLabels[z]

                        var inputTag = optionLabel.getElementsByTagName('input')[0]


                        for (var k = +1; k < answers.length; k++) {
                            if (optionLabel.innerText.includes(answers[k])) {

                                inputTag.setAttribute("checked", "true")
                            }
                        }

                    }

                    continue flag
                }
            }
        }

        if (matchCode == 0) {
            inputs[0].setAttribute("checked", "true")
            tihaos[i].classList.add("active")


            successCode = 1

        }


        //`https://iedu.foxconn.com/public/play/examUI?courseId=${courseId}`
    }


    console.log('已全部答题完毕')

    getFrameDocument().getElementsByClassName('btn-success')[0].click()

    setTimeout('confirmSubmit()', 3000)

    setTimeout('examAgain()', 10000)

}

function examAgain() {

    var examResult = getFrameDocument().getElementsByClassName('exam_result')[0]

    var score = examResult.getElementsByTagName('strong')[0].innerText

    if (score < 100) {
        getFrameDocument().getElementsByClassName('btn-block')[0].click()
        setTimeout('getAllQuestion()', 5000)

        console.log('考试未通过')
    } else {
        console.log('判定考试通过')
    }

}


function confirmSubmit() {
    getFrameDocument().getElementsByClassName('layui-layer-btn0')[0].click()

    setTimeout('saveQuestions()', 3000)
}

/**
 * 保存题库
 * 
 * */
function saveQuestions() {
    console.log('保存题库')
    var questionWarps = getFrameDocument().getElementsByClassName('question_warp')

    //addQuestion('ESG是一种关注企业环境、社会、治理绩效而非财务绩效的投资理念和企业评价标准，是衡量公司是否具备足够社会责任感的重要标准', 0 , '正确')


    for (var i = 0; i < questionWarps.length; i++) {

        var questionWarp = questionWarps[i]
        var hNode = questionWarp.getElementsByTagName('h3')[0]
        var tmpTitle = hNode.innerText.trim()
        var index = tmpTitle.indexOf('.')
        var title = tmpTitle.substring(index + 1, tmpTitle.length).trim()


        var option = questionWarp.getElementsByClassName('option_list')[0]

        var answerTmp = option.getElementsByClassName('answer')[0].getElementsByTagName('strong')[0].innerText

        var inputs = option.getElementsByTagName('input')

        var answer = ''

        var inputTag = inputs[0]

        var optionLabels = option.getElementsByTagName('label')


        // // addQuestion(name,type,answer)
        if (inputTag.getAttribute('type') == 'radio') {


            for (var j = 0; j < optionLabels.length; j++) {

                var label = optionLabels[j]


                if (label.innerText.includes(answerTmp)) {

                    var index = label.innerText.indexOf('：')


                    answer = label.innerText.substring(index + 1, label.innerText.length)

                }
            }


            addQuestion(title, 0, answer)

        }

        if (inputTag.getAttribute('type') == 'checkbox') {

            for (var j = 0; j < optionLabels.length; j++) {

                var label = optionLabels[j]

                for (var z = 0; z < answerTmp.length; z++) {
                    if (label.innerText.includes(answerTmp[z])) {
                        var index = label.innerText.indexOf('：')

                        answer = answer + "====" + label.innerText.substring(index + 1, label.innerText.length)

                    }
                }
            }


            addQuestion(title, 1, answer)
        }

    }

}

/**
 * 
 * 获取Frame dom对象
 * 
 * */
function getFrameDocument() {
    var frame = document.querySelector('frame')
    return frame.contentDocument
}

/**
 * 
 * 获取PDF Frame dom对象
 * 
 * */
function getFrameDocumentOfPDF() {
    var iframe = document.getElementsByName('pdfiframe')[0]
    return iframe.contentWindow.document
}


/**
 * 
 * 跳转链接
 * 
 * */
function gotoUrl(url) {
    //gotoExam()
    fr4me = '<frameset cols=\'*\'>\n<frame src=\'' + url + '\'/>';
    fr4me += '</frameset>';
    with (document) { write(fr4me); void (close()) };
}

function getPDFElement() {
    var pdf = document.getElementById('pdf')
    return pdf
}

function main() {
    //修改可拖动
    fastForward = '0'

    isVideoListener = 0

    var current_video = document.getElementsByTagName('video')[0]

    if (typeof current_video == 'undefined') {
        console.log('video_no_find')
        console.log('未找到video组件')
        console.log('正在尝试寻找播放列表')

        var noPlayArr = getNoPlayMap()

        if (noPlayArr != null) {
            if (noPlayArr.length > 0) {
                console.log('找到播放列表')
                var ddNode = noPlayArr[0]

                console.log('开始执行第一任务')
                ddNode.click()

                setTimeout('init()', 3000)
            } else {

                console.log('未找到播放列表')

                var result = isFinishOfCourse()
                if (result) {
                    //startExam()
                    setTimeout('startExam()', 2000)

                    setTimeout('autoAnswer()', 8000)
                }
            }
        } else {
            console.log('未找到播放列表')
            console.log('程序结束')
        }

    } else {

        init()
    }


    //初始化数据库
    initStore()

}

main()


