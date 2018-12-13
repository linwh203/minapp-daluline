// 1. 挑战问答次数，接口checkpoint增加字段？需要挑战次数以及所持金币2个数据
// 详细见ICheckPointRequest

// 2. 分享增加挑战次数，上限几次？增加次数调用哪个接口？
// 每天通过分享增加的挑战次数是3次
// 增加次数,通过IAddCountRequest接口来实现

// 3. 回答错误一题就扣一次挑战次数？
// 连续答对6题 猜算通过一关
// 如果我答对3题 第四题答错 那就直接结束(因为不可能是"连续"答对了)
// 用户再使用一次挑战次数 又要从头开始回答


// 4. 过关增加金币调用哪个接口？
// 后端会自动计算

// 5. 个人成就页面，奖励兑换商品列表？
// 6. 奖励兑换调哪个接口？
// 是直接拿手机给工作人员看 然后工作人员给礼物
// 所以是没有相关商品列表  也没有兑换的接口的



// 用户的知识问答相关数据查询
interface ICheckPointRequest{
	method:"get",
	route:'/quiz/getcheckpoint',
	params:{
		LineId: string;
		token: string;
	}
}

interface ICheckPointResponse{
	res_code: number;
	res_msg: string;
	data:{
		// 当前在第几关,0表示一关没有过,1表示过了第一关,以此类推
		score: number;
		// 剩余的挑战次数
		count: number;
		// 当前金币
		coin: number;
	}
}

// 增加挑战次数
interface IAddCountRequest{
	method:"post",
	route:"/quiz/addCount",
	body:{
		LineId: string;
		token: string;
	}
}

interface IAddCountResponse{
	res_code: number;
	res_msg: string;
	data:{
		// 增加之后的挑战次数
		count: number;
	}
}


// 金币兑换勋章
interface IBuyTitleRequest{
	method:"post",
	route:"/quiz/buyTitle",
	body:{
		LineId: string;
		token: string;
		// 金币数量
		coin: number;
	}	
}

interface IBuyTitleResponse{
	res_code: number;
	res_msg: string;
	data: {
		// 兑换到的勋章个数
		count: number;
	}
}

// 当前的勋章数量
interface IGetTitleRequest {
	method: "post",
	route: "/quiz/getTitle",
	body: {
		LineId: string;
		token: string;
	}	

}

interface IGetTitleResponse {
	res_code: number;
	res_msg: string;
	data: {
		// 现在的勋章个数
		count: number;
	}
}