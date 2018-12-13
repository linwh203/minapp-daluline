// 登录
interface ILoginRequest {
  route: "/login";
  method: "get";
  param: {
    code: string;
    path: string;
  };
}

interface ILoginResponse {
  // 0 表示没有错误
  res_code: number;
  // 错误信息,没有错误的情况下,可以不需要这个属性
  res_msg?: string;
  data: {
    token: string;
  };
}

// 景点导览list的数据
interface ISpotRequest {
  route: "/spot/list";
  method: "get";
  param: {
    // 路线
    path: string;
  };
}

interface ISpotResponse {
  res_code: number;
  res_msg?: string;
  data: {
    // 景点id
    spot_id: string;
    // 景点名称
    spot_name: string;
    // 景点图片url,悬浮层图片
    spot_image: string;
    // 经度
    longitude: number;
    // 纬度
    latitude: number;
  }[];
}

// 列表导览的景点详情
interface ISpotDetailRequest {
  route: "/spot/list/detail";
  method: "get";
  param: {
    // 路线
    path: string;
    spot_id: string;
  };
}

interface ISpotDetailResponse {
  res_code: number;
  res_msg?: string;
  data: {
    // 景点id
    spot_id: string;
    // 知识图url
    image_url: string;
    // 音频url
    audio_url: string;
    // 视频url
    video_url: string;
    // 分享的title
    share_title: string;
  };
}

// 手绘图列表
interface IPicRequest {
  route: "/pic/list";
  method: "get";
  param: {
    // 路线
    path: string;
  };
}

interface IPicResponse {
  res_code: number;
  res_msg?: string;
  data: {
    // 手绘大图
    pic_image: string;
    // 图标
    pic_icon: string;
    // 高亮图标(被选中状态)
    pic_icon_active: string;
  }[];
}

// 知识问答列表
interface IQuizRequest {
  route: "/quiz/list";
  method: "get";
  param: {
    // 路线
    path: string;
    token: string;
  };
}

interface IQuizResponse {
  res_code: number;
  res_msg?: string;
  data: {
    // 题目id
    id: string;
    // 标题
    title: string;
    // 题目类型,类型枚举:'文本选择','看图识别','声音识别'
    type: "text" | "image" | "video";
    // 问题的提示
    tooltip: string;
    // 问题正文,如果是'看图识别'和'声音识别'就应该是个url字符串
    quiz: string;
    // 答案列表,如果是'看图识别'就应该是个图片地址
    answer_list: string[];
    // 正确答案的序号
    right_answer: number;
    // 我是否答对
    is_right: boolean;
  }[];
}

// 答题
interface IAnswerRequest {
  route: "/quiz/answer";
  method: "post";
  body: {
    // 用户token
    token: string;
    // 路线
    path: string;
    // 题目id
    id: string;
    // 答案序号
    answer: number;
  };
}

interface IAnswerResponse {
  res_code: number;
  res_msg?: string;
  data: {
    // 我是否答对
    is_right: boolean;
  };
}

// 我的建议
interface ISuggestRequest {
  route: "/my/suggest";
  method: "post";
  body: {
    // 用户token
    token: string;
    // 路线
    path: string;
    // 建议
    suggest: string;
    // 电话
    phone: string;
    // 图片url列表
    image_url_list: string[];
  };
}

interface ISuggestResponse {
  res_code: number;
  res_msg?: string;
}

// 拍照识别
interface IPhotoRequest {
  route: "/photo";
  method: "post";
  body: {
    // 用户token
    token: string;
    // 图片url
    image_url: string;
    // 线路
    path: string;
  };
}

interface IPhotoResponse {
  res_code: number;
  res_msg?: string;
  // 识别的列表,因为可能匹配多个照片,但是有匹配度的区别
  data: {
    // 动植物名字
    name: string;
    // 匹配度
    match: number;
    // 描述
    desc: string;
    // 详细信息的url
    detail_url: string;
  }[];
}
