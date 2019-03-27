/**
 * Created by Administrator on 2019/3/27.
 */


function OuterService() {

    function bingo(parm) {
        alert("点击了外在触发器" + parm)
    }

    return {
        bingo: bingo,
    }
}
