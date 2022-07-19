export const ROBOT_STATUS = {
  0:"开启",
  1:"关闭",
};

// 策略
export const ROBOT_STRATEGY= [
  {
    label: '行情推送',
    value: 0,
    name: 'market'
  },
  {
    label: '【杠杆】基于MA杠杆交易策略',
    value: 1,
    name: 'maLeverTrade'
  },
  {
    label: '【永续】网格交易',
    value: 2,
    name: 'swapGridTrade'
  },
  {
    label: '【现货】模拟测试',
    value: 3,
    name: 'mock'
  },
  {
    label: '【现货】网格交易',
    value: 4,
    name: 'spotGridTrade'
  }
];

