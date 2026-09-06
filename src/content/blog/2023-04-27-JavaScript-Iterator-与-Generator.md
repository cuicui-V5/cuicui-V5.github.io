---
title: "JavaScript Iterator 与 Generator"
date: "2023-04-27 09:29:32"
description: "Iterator 迭代器"
categories:
  - "Web前端"
tags:
  - "JavaScript"
  - "ES6"
---

# Iterator 迭代器

为各种数据结构提供一个统一的迭代方法, Iterator 迭代器主要使用 for...of 迭代

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol..iterator 属性，或者说，一个数据结构只要具有 Symbol.iterator()属性，就可以认为是"可遍历的”(iterable)。Symbol..iterator 属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。

原生默认具备 Iterator 接口的数据结构如下。

-   Array
-   Set
-   Map
-   String
-   arguments 对象
-   NodeList 对象

如果一个对象具有 `[Symbol.Iterator]` 方法, 那么我们可以说它实现了迭代器, 是一个可迭代对象

迭代器需要返回一个函数, 此函数的返回值包含一个 next 函数, next 函数返回值有两个属性, 分别为 value 和 done

```ts
const obj = {
    name: "tim",
    age: 20,
    habits: ["sing", "jump", "rap", "basketball"],
    [Symbol.iterator]: function () {
        let index = 0;
        return {
            next: () => {
                return {
                    value: this.habits[index++],
                    done: index >= this.habits.length + 1,
                };
            },
        };
    },
};

// const iter = obj[Symbol.iterator]();
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());

for (const item of obj) {
    console.log(item);
}
```

实现了 `[Symbol.Iterator]` 方法的对象就可以使用 `for...of` 循环了

## Generator 生成器函数

Generator 函数是 ES6 提供的一种异步编程解决方案
Generator 函数是一个状态机，封装了多个内部状态。
执行 Generator 函数会返回一个迭代器对象，也就是说，Generator 函数除了状态机，还是一个迭代器对象生成函数。返回的迭代器对象，可以依次遍历 Generator 函数内部的每一个状态。

```ts
function* gen() {
    const res1 = yield "你好";
    console.log(res1);
    const res2 = yield "世界";
    console.log(res2);
    const res3 = yield "!";
    console.log(res3);
}
const g = gen();
// for (const i of g) {
//     console.log(i);
// }
console.log(g.next(1));
console.log(g.next(2));
console.log(g.next(3));
```

`yield` 表达式的作用是暂停生成器函数的执行，并在该位置上将控制权交回给调用方，等到再次调用该生成器对象的 `next()` 方法时继续执行。

==!!!== `yield` 表达式返回值取决于下一个 `next()` 方法中传入的参数。

在执行 `g.next(1)` 时，生成器函数会一直执行到第一个 `yield` 表达式处，然后暂停，将"你好"返回给调用者，并在等待下一次 `next()` 方法的执行。由于第一个 `yield` 表达式的返回值并不需要接收外部传递进来的任何值，因此 `res1` 变量就没有被赋值，也就是被忽略了。

## 配合 promise 实现异步操作

```ts
const pro = num => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num * 10);
        }, 1000);
    });
};
function* gen() {
    console.log("gen执行了");
    const res1 = yield pro(1);
    console.log(res1);
    const res2 = yield pro(res1);
    console.log(res2);
    const res3 = yield pro(res2);
    console.log(res3);
}
const g = gen();

g.next().value.then(res => {
    console.log(res);
    g.next(res).value.then(res => {
        console.log(res);
        g.next(res).value.then(res => {
            console.log(res);
            g.next();
        });
    });
});
```

async/await 只是这种操作的语法糖

# 异步迭代器

如果 Generator 函数前面加了 `async`, 那么这个函数就叫做==异步生成器==, 异步生成器生成的叫做==异步迭代器==.
异步迭代器的`.next ​`方法返回一个 `promise ​`对象,这个 `promise ​`对象的结果会包含 `value ​`和 `done ​`两个属性.
如果`.next` 对应的 `yield ​`后面是普通对象, 那么这个 `promise ​`会立刻 `resolve`.
如果`​ yield` 后面是一个 `promise ​`对象, 那么`.next` 返回的 `promise ​`被 `resolve ​`的时机是 `.next` 对应的 `yield ​`后面的 `promise ​`状态变为 `resolve ​`的时候.
`yield ​`后的 `Promise ​`对象 `resolve ​`之前，代码会暂停执行, 所以如果同步调用多个`.next`, 异步迭代器内部也会按照顺序执行.

可以使用`for await (item of 异步迭代器)` 来迭代异步迭代器

```ts
const timer = (time: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(time);
            resolve(time);
        }, time);
    });
};

// 如果generator函数前面加了async, 那么这个函数就叫做异步生成器, 异步生成器生成的叫做异步迭代器.
// 异步迭代器的.next方法返回一个promise对象,这个 promise 对象的结果会包含 value 和 done 两个属性.
// 如果.next对应的yield后面是普通对象, 那么这个promise会立刻resolve.
// 如果yield后面是一个promise对象, 那么.next返回的promise被resolve的时机是next对应的yield后面的promise状态变为resolve的时候.
// yield后的Promise对象resolve之前，代码会暂停执行, 所以如果同步调用多个.next, 异步迭代器内部也会按照顺序执行.

async function* gen() {
    yield timer(1000);
    yield timer(1000);
    yield timer(1000);
}

function test1() {
    const g: any = gen();

    g.next().then((res: any) => {
        console.log(res); //输出{ value: 1000, done: false }
    });
    g.next();
    g.next(); // 同步调用next, 异步迭代器内部也会按顺序执行, 因为yield后的Promise对象resolve之前，代码会暂停执行
}
// test1();

async function test2() {
    const g: any = gen();

    console.log(await g.next());
    await g.next();
    await g.next(); // 可以使用 await 获取异步迭代器的数据
}
// test2();

async function test3() {
    const g: any = gen();
    // 可以使用 for await (item of 异步迭代器) 来依次获取异步迭代器数据
    for await (const item of g) {
        console.log(item);
    }
}
test3();
```
