---
title: "JavaScript数组总结"
date: "2022-12-05 14:30:55"
description: "js 中的数组拥有众多方法, 在这里我加以总结便于复习"
categories:
  - "Web前端"
tags:
  - "JavaScript"
  - "数据结构"
---

js 中的数组拥有众多方法, 在这里我加以总结便于复习

<!-- more -->

# 数组的定义

```ts
let arr = new Array(1, 2, 3);
let arr = [1, 2, 3];
```

# 检测是否为数组

## 使用 instanceof 运算符

instanceof ﻿ 可以判断原型是否处于原型链上

```javascript
        arr=[1,2,3];
        console.log(arr instanceof Array); //输出true
```

## 使用 Array.isArray()方法

```javascript
        arr=[1,2,3];
        console.log(Array.isArray(arr)); //输出true
```

# 数组方法

## 数组操作方法

### push()

向数组后方添加一个或多个元素, **改变**原数组, 返回**数组长度**

```ts
arr.push(10, 20);
```

### unshift()

在数组前方添加一或多个元素, **改变**原数组, 返回**数组长度**

```ts
arr.unshitf(1, 2, 3);
```

‍

### pop()

删除数组后方的元素, **改变**原数组, 返回**删除的内容**

```ts
arr.pop();
```

### shift()

删除数组前方的元素, **改变**原数组, 返回**删除的内容**

```ts
arr.shift();
```

‍

### splice()

在指定位置删除或添加元素, **改变**原数组, 返回**删除的元素组成的数组**

用法:

​`splice(操作元素的下标, 删除几个元素, 要添加的元素...)`​

```ts
arr = [1, 2, 3];
arr.splice(1, 1, 4, 5, 6);

//arr [1,4,5,6,3]
```

‍

## 数组排序

### reverse()

​`reverse() ​`​ 可以翻转数组

```javascript
            arr=[1,2,3,4,5];
            arr.reverse();
```

### sort()

对数组进行排序, **改变**原数组, 返回**排序结果**

用法:

​`arr.sort(排序函数)`​

**排序函数**: 排序函数传入两个参数, 分别为依次比较的两个元素, 如果返回大于 0 的值, 就交换位置, 如果小于 0, 就不交换

```ts
arr.sort((a, b) => a - b); // 升序
arr.sort((a, b) => b - a); // 降序
```

## 连接数组

### concat

用来连接两个数组, **不改变**原数组, 返回**连接后的数组**

语法: `arr1.concat(arr2, arr3)`​

```ts
arr.concat(arr2, [1, 2, 3]);
```

‍

## 数组迭代方法

数组迭代方法**都不会更改**原数组

### every()

判断数组元素是否**全部符合**某个条件, 返回 `true` ​ 或 `false`​

语法: `every(item=>true)`​

如果回调函数**全部**返回 `true`​, 那么才返回 `true`​, 否则就是 `false`​

```ts
arr = [1, 2, 3, 4, 5];
arr.every(item => item % 2 == 0); // false
```

### some()

判断数组元素**是否符合条件**, 只要有一个符合条件就返回 `true`​

语法: `some(item=>true)`​

只要回调函数有一个返回了 `true`​, 那么 `some` ​ 的返回值就为 `true`​, 只有全部都是 `false`​, 那么才是 `false`​

```ts
arr = [1, 2, 3, 4, 5];
arr.some(item => item % 2 == 0); // true
```

### filter()

**返回一个符合条件的新数组**, 用于从数组内部筛选元素

语法: `filter(item=>item)`​

filter 会遍历数组的每一个元素传入回调函数, 如果回调返回 true, 那么这个元素就会被加入返回的数组内

```ts
arr = [1, 3, 4, 5, 6];
arr.filter(item => item % 2 == 0);

// [ 4, 6 ]
```

‍

### map()

**返回回调函数返回值组成的数组**, 可以用来处理数组

语法: `map(item=>item)`​

map 会遍历数组的每一个元素传入回调函数, 并将回调函数的返回值放入 map 返回的数组中

```ts
> arr=[1,2,3,4,5]
[ 1, 2, 3, 4, 5 ]
> arr.map(item=>item+10)
[ 11, 12, 13, 14, 15 ]
```

### foreach()

**无返回值**, 遍历数组每个元素并执行回调函数

```ts
> arr=[1,2,3,4,5]
[ 1, 2, 3, 4, 5 ]
> arr.forEach((item,index)=>{console.log(item,index)})
1 0
2 1
3 2
4 3
5 4
undefined
```

### reduce()

详情参阅
[https://www.freecodecamp.org/chinese/news/the-ultimate-guide-to-javascript-array-methods-reduce/](https://www.freecodecamp.org/chinese/news/the-ultimate-guide-to-javascript-array-methods-reduce/)

用来处理数组, 最后返回一个任意类型的值

语法: `arr.reduce((pre,current)=>{},initVal)`​

参数:

-   ​`pre`​ :上次迭代的结果
-   ​`current`​: 当前迭代的值
-   ​`initVal`​: 初始值

执行过程: `reduce` ​ 方法会迭代数组内所有值, 并且会把上次 `return` ​ 的执行结果作为当前的 `pre` ​ 参数

注意: `reduce` ​ 中一定要使用 `return` ​ 返回值

```js
// 累加值
let arr = [1, 2, 3, 4, 5];

let res = arr.reduce((sum, val) => {
    sum += val;
    return sum;
}, 0);
console.log(res);

// 拼合字符串
let arr2 = ["小明", "小红", "小强"];

let res2 = arr2.reduce((sum, val) => {
    sum += val;
    return sum;
}, "");
console.log(res2);

// 求每个人的年龄和

let arr3 = [
    {
        name: "小明",
        age: 20,
    },
    {
        name: "小hs",
        age: 30,
    },
    {
        name: "小a",
        age: 50,
    },
];

let res3 = arr3.reduce((sum, val) => {
    sum += val.age;
    return sum;
}, 0);
console.log(res3);
```

‍

## 生成数组方法

### from()

可以将伪数组(例如函数的 `arguments`​)转换为真正的数组, 返回转换完成的数组

```ts
Array.from(arguments);
```

还可以接受第二个参数，用来对每个元素进行处理，将处理后的值放入返回的数组

```js
Array.from([1, 2, 3], x => x * x);
// [1, 4, 9]
```

## 数组搜索方法

​`index`​ 系列方法直接传入要搜索的值, `find`​ 系列方法传入回调

### indexOf()

返回**搜索结果所在的下标,** 如果没有结果那么返回 **`-1`**​

```ts
> arr
[ 1, 2, 3, 4, 5 ]
> arr.indexOf(3)
2
```

### lastIndexOf()

从**后面开始搜索**, 返回**搜索结果所在的下标, ​** 如果没有结果那么返回 **`-1`**​

```ts
> arr=[11,12,12,13,11,11,12,13]
[
  11, 12, 12, 13,
  11, 11, 12, 13
]
> arr.lastIndexOf(11)
5
```

### includes()

搜索数组, 如果包含参数值, 返回`true`​, 否则返回`false`​

```ts
> arr.includes(11)
true
```

### find()

传入一个回单函数, `find`​**返回第一个回调函数返回 true 的元素**

```ts
> arr=[11,12,12,13,11,11,12,13]
[
  11, 12, 12, 13,
  11, 11, 12, 13
]
> arr.find(item=>item>0)
11
```

‍

### findIndex()

传入一个回单函数, `find`​**返回第一个回调函数返回 true 的元素的下标**

```ts
> arr.findIndex(item=>item>12)
3
```

### findLast()

与`find`​ 类似, 从后查找

### findLastIndex()

与`findIndex`​ 类似, 从后查找
